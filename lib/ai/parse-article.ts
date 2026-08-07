const ALLOWED_TAGS =
  /^(?:p|h2|h3|b|i|ul|ol|li|a|\/p|\/h2|\/h3|\/b|\/i|\/ul|\/ol|\/li|\/a)$/i;

export type GeneratedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  category_hint: string;
  cover_image_description: string;
  cover_image_alt: string;
  content: string;
};

/** Remove tags HTML não permitidas pelo PROMPT-BLOG; mantém texto. */
export function sanitizeArticleHtml(html: string): string {
  let out = html
    .replace(/```(?:html)?\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  out = out.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");

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
        return '<a href="#">';
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
