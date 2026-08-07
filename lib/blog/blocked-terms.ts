/**
 * Filtro de termos proibidos nos comentários do blog.
 * Analogia: é a "lista da portaria" — se a palavra estiver na lista, a mensagem nem entra na fila.
 */

/** Remove acentos e deixa em minúsculas para comparar de forma justa. */
export function normalizeForBlocklist(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * Converte o texto salvo no admin (uma palavra por linha)
 * em uma lista limpa, sem vazios e sem duplicatas.
 * Linhas que começam com # são tratadas como comentário (ignoradas).
 */
export function parseBlockedTerms(raw: string | null | undefined): string[] {
  if (!raw) return [];

  const seen = new Set<string>();
  const terms: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const term = trimmed;
    const key = normalizeForBlocklist(term);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    terms.push(term);
  }

  return terms;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Retorna true se o texto contiver algum termo da lista.
 * - Frases (com espaço ou hífen composto longo): busca como trecho.
 * - Palavras isoladas: respeita "borda" de palavra (evita "cu" em "cura").
 */
export function containsBlockedTerm(
  text: string,
  blockedTerms: string[]
): boolean {
  if (!text || blockedTerms.length === 0) return false;

  const normalizedText = normalizeForBlocklist(text);

  return blockedTerms.some((term) => {
    const normalizedTerm = normalizeForBlocklist(term);
    if (!normalizedTerm) return false;

    // Frase / expressão: pode aparecer no meio do texto
    if (/\s/.test(normalizedTerm)) {
      return normalizedText.includes(normalizedTerm);
    }

    // Palavra: só conta se estiver "sozinha" (não dentro de outra palavra)
    const pattern = new RegExp(
      `(^|[^a-z0-9])${escapeRegExp(normalizedTerm)}([^a-z0-9]|$)`
    );
    return pattern.test(normalizedText);
  });
}
