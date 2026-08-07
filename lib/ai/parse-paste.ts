import {
  normalizeSlug,
  sanitizeArticleHtml,
  type GeneratedArticle,
} from "@/lib/ai/parse-article";

const FIELD_LABELS = [
  "TÍTULO",
  "SLUG",
  "RESUMO",
  "TÍTULO SEO",
  "DESCRIÇÃO SEO",
  "CATEGORIA",
  "IMAGEM DE CAPA (descrição + alt)",
  "IMAGEM DE CAPA",
  "CONTEÚDO HTML",
] as const;

function extractLabeledField(text: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Captura até o próximo rótulo conhecido ou fim do texto
  const nextLabels = FIELD_LABELS.filter((l) => l !== label)
    .map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const re = new RegExp(
    `(?:^|\\n)\\s*${escaped}\\s*:\\s*\\n?([\\s\\S]*?)(?=\\n\\s*(?:${nextLabels})\\s*:|\\n---\\s*$|$)`,
    "i"
  );
  const match = text.match(re);
  return match?.[1]?.trim() ?? "";
}

function parseCoverHint(raw: string): { description: string; alt: string } {
  if (!raw) return { description: "", alt: "" };
  const altMatch = raw.match(/alt\s*[:=]\s*["']?([^"'\n]+)["']?/i);
  const alt = altMatch?.[1]?.trim() ?? "";
  const description = raw
    .replace(/alt\s*[:=]\s*["']?[^"'\n]+["']?/i, "")
    .replace(/\n+/g, " ")
    .trim();
  return { description, alt };
}

function tryParseJsonPaste(raw: string): GeneratedArticle | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") && !trimmed.includes('"title"')) return null;
  try {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const jsonStr = fenced?.[1]?.trim() || trimmed;
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const data = JSON.parse(jsonStr.slice(start, end + 1)) as Record<
      string,
      unknown
    >;
    if (typeof data.title !== "string" || typeof data.content !== "string") {
      return null;
    }
    const seoTitle =
      typeof data.seo_title === "string" ? data.seo_title : String(data.title);
    return {
      title: data.title,
      slug: normalizeSlug(
        typeof data.slug === "string" ? data.slug : data.title
      ),
      excerpt:
        typeof data.excerpt === "string" ? data.excerpt : String(data.title),
      seo_title: seoTitle.includes("RitmoBlog")
        ? seoTitle
        : `${seoTitle.replace(/\s*\|\s*$/, "").trim()} | RitmoBlog`,
      seo_description:
        typeof data.seo_description === "string"
          ? data.seo_description
          : typeof data.excerpt === "string"
            ? data.excerpt
            : "",
      category_hint:
        typeof data.category_hint === "string" ? data.category_hint : "",
      cover_image_description:
        typeof data.cover_image_description === "string"
          ? data.cover_image_description
          : "",
      cover_image_alt:
        typeof data.cover_image_alt === "string" ? data.cover_image_alt : "",
      content: sanitizeArticleHtml(data.content),
    };
  } catch {
    return null;
  }
}

/**
 * Interpreta a resposta colada do chat (formato PROMPT-BLOG ou JSON).
 */
export function parseAiPasteResponse(raw: string): GeneratedArticle {
  const jsonTry = tryParseJsonPaste(raw);
  if (jsonTry) return jsonTry;

  const cleaned = raw.replace(/^\s*---\s*/m, "").replace(/\s*---\s*$/m, "");

  const title = extractLabeledField(cleaned, "TÍTULO");
  const slugRaw = extractLabeledField(cleaned, "SLUG");
  const excerpt = extractLabeledField(cleaned, "RESUMO");
  const seoTitle = extractLabeledField(cleaned, "TÍTULO SEO");
  const seoDescription = extractLabeledField(cleaned, "DESCRIÇÃO SEO");
  const category = extractLabeledField(cleaned, "CATEGORIA");
  const coverRaw =
    extractLabeledField(cleaned, "IMAGEM DE CAPA (descrição + alt)") ||
    extractLabeledField(cleaned, "IMAGEM DE CAPA");
  const contentRaw = extractLabeledField(cleaned, "CONTEÚDO HTML");

  if (!title || !contentRaw) {
    throw new Error(
      "Não encontrei TÍTULO e CONTEÚDO HTML. Cole a resposta completa no formato do prompt (TÍTULO:, SLUG:, …, CONTEÚDO HTML:)."
    );
  }

  // CATEGORIA às vezes vem "Arritmias — justificativa"
  const categoryHint = category.split(/[—\-|]/)[0]?.trim() || category;

  const cover = parseCoverHint(coverRaw);
  const seo =
    seoTitle ||
    `${title.slice(0, 60).replace(/\s*\|\s*$/, "").trim()} | RitmoBlog`;

  return {
    title: title.replace(/^\[|\]$/g, "").trim(),
    slug: normalizeSlug(slugRaw || title),
    excerpt: excerpt || title,
    seo_title: seo.includes("RitmoBlog")
      ? seo
      : `${seo.replace(/\s*\|\s*$/, "").trim()} | RitmoBlog`,
    seo_description: seoDescription || excerpt || title,
    category_hint: categoryHint,
    cover_image_description: cover.description,
    cover_image_alt: cover.alt,
    content: sanitizeArticleHtml(contentRaw),
  };
}
