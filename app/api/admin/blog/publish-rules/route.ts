import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import {
  normalizePublishTime,
  upcomingDatesForWeekday,
} from "@/lib/blog-calendar";

type RuleInput = {
  id?: string;
  weekday: number;
  category_id: string;
  publish_time?: string;
  active?: boolean;
  label?: string | null;
  sort_order?: number;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: rules, error } = await supabaseAdmin
      .from("blog_publish_rules")
      .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
      .order("weekday", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("publish_time", { ascending: true });

    if (error) throw error;

    // Fila por categoria (quantos "ready")
    const { data: readyArticles } = await supabaseAdmin
      .from("blog_articles")
      .select("id, title, category_id, created_at, status")
      .eq("status", "ready")
      .order("created_at", { ascending: true });

    const queueByCategory: Record<
      string,
      { count: number; titles: string[] }
    > = {};

    for (const article of readyArticles ?? []) {
      if (!article.category_id) continue;
      if (!queueByCategory[article.category_id]) {
        queueByCategory[article.category_id] = { count: 0, titles: [] };
      }
      queueByCategory[article.category_id].count += 1;
      if (queueByCategory[article.category_id].titles.length < 5) {
        queueByCategory[article.category_id].titles.push(article.title);
      }
    }

    // Prévia das próximas 4 semanas: simula quem sairia da fila
    const queuePointers: Record<string, number> = {};
    const readyList = readyArticles ?? [];

    const preview = (rules ?? [])
      .filter((r) => r.active)
      .flatMap((rule) => {
        const dates = upcomingDatesForWeekday(rule.weekday, 4);
        return dates.map((dateStr) => {
          const catId = rule.category_id as string;
          const idx = queuePointers[catId] ?? 0;
          const candidates = readyList.filter((a) => a.category_id === catId);
          const article = candidates[idx] ?? null;
          if (article) {
            queuePointers[catId] = idx + 1;
          }

          return {
            rule_id: rule.id,
            date: dateStr,
            weekday: rule.weekday,
            publish_time: normalizePublishTime(String(rule.publish_time)),
            category: rule.category,
            label: rule.label,
            article: article
              ? { id: article.id, title: article.title }
              : null,
            empty: !article,
          };
        });
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.publish_time.localeCompare(b.publish_time));

    return NextResponse.json({
      rules: rules ?? [],
      queueByCategory,
      preview,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Substitui o conjunto de regras do calendário.
 * Body: { rules: RuleInput[] }
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const rules = (body.rules ?? []) as RuleInput[];

    if (!Array.isArray(rules)) {
      return NextResponse.json(
        { error: "Envie um array de regras." },
        { status: 400 }
      );
    }

    for (const rule of rules) {
      if (
        typeof rule.weekday !== "number" ||
        rule.weekday < 0 ||
        rule.weekday > 6
      ) {
        return NextResponse.json(
          { error: "Dia da semana inválido (0–6)." },
          { status: 400 }
        );
      }
      if (!rule.category_id) {
        return NextResponse.json(
          { error: "Cada regra precisa de uma categoria." },
          { status: 400 }
        );
      }
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("blog_publish_rules")
      .select("id");

    if (existingError) throw existingError;

    const incomingIds = new Set(
      rules.filter((r) => r.id).map((r) => r.id as string)
    );
    const toDelete = (existing ?? [])
      .map((r) => r.id)
      .filter((id) => !incomingIds.has(id));

    if (toDelete.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from("blog_publish_rules")
        .delete()
        .in("id", toDelete);
      if (deleteError) throw deleteError;
    }

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const payload = {
        weekday: rule.weekday,
        category_id: rule.category_id,
        publish_time: normalizePublishTime(rule.publish_time || "08:00"),
        active: rule.active !== false,
        label: rule.label || null,
        sort_order: rule.sort_order ?? i,
        updated_at: new Date().toISOString(),
      };

      if (rule.id) {
        const { error } = await supabaseAdmin
          .from("blog_publish_rules")
          .update(payload)
          .eq("id", rule.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin
          .from("blog_publish_rules")
          .insert(payload);
        if (error) throw error;
      }
    }

    const { data: updated, error: fetchError } = await supabaseAdmin
      .from("blog_publish_rules")
      .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
      .order("weekday", { ascending: true })
      .order("sort_order", { ascending: true });

    if (fetchError) throw fetchError;

    return NextResponse.json({ rules: updated ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
