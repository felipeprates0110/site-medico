/**
 * Tempo médio de leitura a partir do HTML do artigo.
 * Analogia: contamos as palavras como páginas de um livro e dividimos
 * pela velocidade média de leitura (~200 palavras/minuto em português).
 */

const WORDS_PER_MINUTE = 200;

/** Remove tags HTML e entidades simples, deixando só o texto legível. */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/** Minutos de leitura (mínimo 1). */
export function getReadingMinutes(
  htmlOrText: string,
  wordsPerMinute = WORDS_PER_MINUTE
): number {
  const words = countWords(stripHtml(htmlOrText));
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/** Texto amigável: "5 min de leitura". */
export function formatReadingTime(minutes: number): string {
  return minutes === 1 ? "1 min de leitura" : `${minutes} min de leitura`;
}

/** Formato Schema.org (ISO 8601 duration), ex.: PT5M. */
export function readingTimeIsoDuration(minutes: number): string {
  return `PT${Math.max(1, minutes)}M`;
}
