/**
 * Sanitiza HTML do blog antes de gravar ou renderizar.
 * Analogia: é o "filtro da pia" — só deixa passar tags limpas e seguras.
 * Evita XSS (scripts maliciosos embutidos no conteúdo).
 *
 * Usa DOMPurify (biblioteca padrão anti-XSS) + lista restrita do RitmoBlog.
 */
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "b",
  "i",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "br",
] as const;

const ALLOWED_TAG_SET = new Set<string>(ALLOWED_TAGS);

function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (value.startsWith("#") && !value.toLowerCase().startsWith("#javascript")) {
    return true;
  }
  return false;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Remove tags/atributos perigosos; mantém o HTML permitido pelo blog. */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";

  const pre = html
    .replace(/```(?:html)?\s*/gi, "")
    .replace(/```/g, "")
    .trim();

  // 1ª camada: DOMPurify (recomendação Aikido / padrão da indústria)
  const purified = DOMPurify.sanitize(pre, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: ["href", "rel", "target"],
    ALLOW_DATA_ATTR: false,
  });

  // 2ª camada: normaliza links e reforça href seguros
  let out = purified.replace(
    /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g,
    (match, rawTag: string) => {
      const name = rawTag.toLowerCase();
      const closing = match.startsWith("</");

      if (name === "strong") return closing ? "</b>" : "<b>";
      if (name === "em") return closing ? "</i>" : "<i>";

      if (!ALLOWED_TAG_SET.has(name)) return "";

      if (closing) {
        if (name === "br") return "";
        return `</${name}>`;
      }

      if (name === "br") return "<br />";

      if (name === "a") {
        const hrefMatch = match.match(
          /href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i
        );
        const href = (
          hrefMatch?.[2] ??
          hrefMatch?.[3] ??
          hrefMatch?.[4] ??
          ""
        ).trim();
        if (isSafeHref(href)) {
          return `<a href="${escapeAttribute(href)}" rel="noopener noreferrer">`;
        }
        return '<a href="#">';
      }

      return `<${name}>`;
    }
  );

  return out.trim();
}
