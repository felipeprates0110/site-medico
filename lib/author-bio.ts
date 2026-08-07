/**
 * Decide qual texto mostrar no card do autor do blog.
 *
 * Ordem (como uma lista de preferências):
 * 1. Bio curta — se o médico preencheu o campo opcional
 * 2. Trecho da biografia completa — para o card não ficar em branco
 * 3. Nada — se os dois campos estiverem vazios
 */
export function resolveAuthorCardBio(
  bioShort?: string | null,
  bio?: string | null,
  maxLength = 220
): string | undefined {
  const short = bioShort?.trim();
  if (short) return short;

  const full = bio?.trim();
  if (!full) return undefined;

  // Junta as primeiras linhas úteis e remove marcadores de lista (- • *)
  const excerpt = full
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" · ");

  if (!excerpt) return undefined;

  if (excerpt.length <= maxLength) return excerpt;
  return `${excerpt.slice(0, maxLength - 1).trimEnd()}…`;
}
