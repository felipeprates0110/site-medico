import { z } from "zod";

const ALLOWED_TAGS =
  /^(?:p|h2|h3|b|i|ul|ol|li|a|\/p|\/h2|\/h3|\/b|\/i|\/ul|\/ol|\/li|\/a)$/i;

export const generatedArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1),
  seo_title: z.string().min(1),
  seo_description: z.string().min(1),
  category_hint: z.string().optional().default(""),
  cover_image_description: z.string().optional().default(""),
  cover_image_alt: z.string().optional().default(""),
  content: z.string().min(1),
});

export type GeneratedArticle = z.infer<typeof generatedArticleSchema>;

export const topicSuggestionSchema = z.object({
  topics: z.array(
    z.object({
      title: z.string(),
      keyword: z.string(),
      angle: z.string(),
      categoryHint: z.string().optional().default(""),
    })
  ),
});

export type TopicSuggestion = z.infer<typeof topicSuggestionSchema>["topics"][number];

export const outlineSchema = z.object({
  title_suggestion: z.string().optional(),
  keyword: z.string().optional(),
  category_hint: z.string().optional(),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        bullets: z.array(z.string()).optional().default([]),
      })
    )
    .optional()
    .default([]),
  faq: z
    .array(z.object({ q: z.string(), a: z.string() }))
    .optional()
    .default([]),
  internal_links: z.array(z.string()).optional().default([]),
  key_facts_from_refs: z.array(z.string()).optional().default([]),
});

export type ArticleOutline = z.infer<typeof outlineSchema>;

/** Extrai JSON de uma resposta que pode vir envolvida em ```json ... ``` */
export function extractJsonString(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

export function parseJsonSafe<T>(raw: string, schema: z.ZodType<T>): T {
  const jsonStr = extractJsonString(raw);
  const parsed = JSON.parse(jsonStr) as unknown;
  return schema.parse(parsed);
}

/** Remove tags HTML não permitidas pelo PROMPT-BLOG; mantém texto. */
export function sanitizeArticleHtml(html: string): string {
  let out = html
    .replace(/```(?:html)?\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  // Remove scripts/styles por completo
  out = out.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

  // Normaliza tags não permitidas: mantém conteúdo interno
  out = out.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tag: string) => {
    const name = tag.toLowerCase();
    if (name === "strong") {
      return match.startsWith("</") ? "</b>" : "<b>";
    }
    if (name === "em") {
      return match.startsWith("</") ? "</i>" : "<i>";
    }
    if (ALLOWED_TAGS.test(name) || ALLOWED_TAGS.test(`/${name}`)) {
      if (name === "a") {
        // Mantém só href seguro
        if (match.startsWith("</")) return "</a>";
        const hrefMatch = match.match(/href\s*=\s*["']([^"']+)["']/i);
        const href = hrefMatch?.[1]?.trim() ?? "#";
        if (
          href.startsWith("/") ||
          href.startsWith("https://") ||
          href.startsWith("http://")
        ) {
          return `<a href="${href}">`;
        }
        return "<a href=\"#\">";
      }
      return match.startsWith("</") ? `</${name}>` : `<${name}>`;
    }
    return "";
  });

  return out.trim();
}

export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeGeneratedArticle(raw: string): GeneratedArticle {
  const article = parseJsonSafe(raw, generatedArticleSchema);
  return {
    ...article,
    slug: normalizeSlug(article.slug || article.title),
    content: sanitizeArticleHtml(article.content),
    seo_title: article.seo_title.includes("RitmoBlog")
      ? article.seo_title
      : `${article.seo_title.replace(/\s*\|\s*$/, "").trim()} | RitmoBlog`,
  };
}
