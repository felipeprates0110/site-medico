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
 */
export function parseBlockedTerms(raw: string | null | undefined): string[] {
  if (!raw) return [];

  const seen = new Set<string>();
  const terms: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const term = line.trim();
    if (!term) continue;

    const key = normalizeForBlocklist(term);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    terms.push(term);
  }

  return terms;
}

/** Retorna true se o texto contiver algum termo da lista. */
export function containsBlockedTerm(
  text: string,
  blockedTerms: string[]
): boolean {
  if (!text || blockedTerms.length === 0) return false;

  const normalizedText = normalizeForBlocklist(text);

  return blockedTerms.some((term) => {
    const normalizedTerm = normalizeForBlocklist(term);
    return normalizedTerm.length > 0 && normalizedText.includes(normalizedTerm);
  });
}
