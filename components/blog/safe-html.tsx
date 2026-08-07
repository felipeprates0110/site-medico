import parse from "html-react-parser";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

type SafeHtmlProps = {
  html: string;
  className?: string;
};

/**
 * Renderiza HTML do blog sem dangerouslySetInnerHTML.
 * Fluxo: sanitiza (remove scripts/tags perigosas) → transforma em nós React.
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  const clean = sanitizeArticleHtml(html);
  return <div className={className}>{parse(clean)}</div>;
}
