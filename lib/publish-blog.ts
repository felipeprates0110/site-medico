import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import {
  WEEKDAY_LABELS,
  getBrazilNowParts,
  isRuleDueNow,
  normalizePublishTime,
} from "@/lib/blog-calendar";

type PublishRule = {
  id: string;
  weekday: number;
  category_id: string;
  publish_time: string;
  active: boolean;
  label: string | null;
  category?: { name: string } | null;
};

export type PublishCronResult = {
  publishedByRule: { ruleId: string; articleId: string; title: string }[];
  publishedScheduled: { articleId: string; title: string }[];
  emptySlots: { ruleId: string; message: string }[];
  skipped: string[];
};

/**
 * Executa a publicação automática do calendário editorial.
 * Analogia: o garçom olha o cardápio do dia e serve o prato mais antigo da prateleira certa.
 */
export async function runBlogPublishCron(
  nowDate = new Date()
): Promise<PublishCronResult> {
  const now = getBrazilNowParts(nowDate);
  const result: PublishCronResult = {
    publishedByRule: [],
    publishedScheduled: [],
    emptySlots: [],
    skipped: [],
  };

  // 1) Artigos agendados pontualmente
  const { data: scheduledArticles, error: scheduledError } = await supabaseAdmin
    .from("blog_articles")
    .select("id, title, scheduled_at")
    .eq("status", "scheduled")
    .lte("scheduled_at", nowDate.toISOString());

  if (scheduledError) throw scheduledError;

  for (const article of scheduledArticles ?? []) {
    const { error } = await supabaseAdmin
      .from("blog_articles")
      .update({
        status: "published",
        published_at: nowDate.toISOString(),
        scheduled_at: null,
        updated_at: nowDate.toISOString(),
      })
      .eq("id", article.id)
      .eq("status", "scheduled");

    if (!error) {
      result.publishedScheduled.push({
        articleId: article.id,
        title: article.title,
      });
    }
  }

  // 2) Regras ativas do calendário para o dia da semana atual
  const { data: rules, error: rulesError } = await supabaseAdmin
    .from("blog_publish_rules")
    .select(`
      id,
      weekday,
      category_id,
      publish_time,
      active,
      label,
      category:blog_categories(name)
    `)
    .eq("active", true)
    .eq("weekday", now.weekday)
    .order("sort_order", { ascending: true });

  if (rulesError) throw rulesError;

  for (const raw of rules ?? []) {
    const rule = raw as unknown as PublishRule;
    const publishTime = normalizePublishTime(String(rule.publish_time));

    if (!isRuleDueNow(publishTime, now)) {
      result.skipped.push(`rule:${rule.id}:ainda_nao_horario`);
      continue;
    }

    // Já publicou neste slot hoje?
    const { data: alreadyPublished } = await supabaseAdmin
      .from("blog_articles")
      .select("id")
      .eq("published_by_rule_id", rule.id)
      .eq("publish_slot_date", now.dateStr)
      .limit(1);

    if (alreadyPublished && alreadyPublished.length > 0) {
      result.skipped.push(`rule:${rule.id}:ja_publicado`);
      continue;
    }

    // Já gerou alerta para este slot?
    const { data: existingAlert } = await supabaseAdmin
      .from("blog_publish_alerts")
      .select("id")
      .eq("rule_id", rule.id)
      .eq("slot_date", now.dateStr)
      .maybeSingle();

    if (existingAlert) {
      result.skipped.push(`rule:${rule.id}:alerta_existente`);
      continue;
    }

    // Próximo da fila (mais antigo ready da categoria)
    const { data: nextArticle, error: queueError } = await supabaseAdmin
      .from("blog_articles")
      .select("id, title")
      .eq("status", "ready")
      .eq("category_id", rule.category_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (queueError) throw queueError;

    const categoryRel = rule.category as
      | { name?: string }
      | { name?: string }[]
      | null;
    const categoryName = Array.isArray(categoryRel)
      ? categoryRel[0]?.name || "categoria"
      : categoryRel?.name || "categoria";

    if (!nextArticle) {
      const message = `${WEEKDAY_LABELS[rule.weekday]} (${now.dateStr}) — ${categoryName}: sem artigo na fila.`;
      const { error: alertError } = await supabaseAdmin
        .from("blog_publish_alerts")
        .insert({
          rule_id: rule.id,
          slot_date: now.dateStr,
          message,
        });

      if (!alertError) {
        result.emptySlots.push({ ruleId: rule.id, message });
      }
      continue;
    }

    const { error: publishError } = await supabaseAdmin
      .from("blog_articles")
      .update({
        status: "published",
        published_at: nowDate.toISOString(),
        scheduled_at: null,
        published_by_rule_id: rule.id,
        publish_slot_date: now.dateStr,
        updated_at: nowDate.toISOString(),
      })
      .eq("id", nextArticle.id)
      .eq("status", "ready");

    if (!publishError) {
      result.publishedByRule.push({
        ruleId: rule.id,
        articleId: nextArticle.id,
        title: nextArticle.title,
      });

      // Resolve alertas antigos da mesma regra (se houver)
      await supabaseAdmin
        .from("blog_publish_alerts")
        .update({ resolved_at: nowDate.toISOString() })
        .eq("rule_id", rule.id)
        .is("resolved_at", null);
    }
  }

  if (
    result.publishedByRule.length > 0 ||
    result.publishedScheduled.length > 0
  ) {
    revalidatePublicSite();
  }

  return result;
}
