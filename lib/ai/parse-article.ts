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

/** Reexporta o sanitizador central (anti-XSS) usado no blog e no admin. */
export { sanitizeArticleHtml } from "@/lib/sanitize-html";

export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
