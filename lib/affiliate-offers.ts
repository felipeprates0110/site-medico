/**
 * Ofertas afiliadas do blog: tipos e escolha ponderada estável.
 *
 * Analogia: cada categoria é uma prateleira com vários produtos.
 * O "peso" define quanto espaço o produto ganha na prateleira.
 * A "semente" (id do artigo) faz o mesmo artigo sempre apontar
 * para o mesmo produto — sem mudar a cada refresh.
 */

export type AffiliateOffer = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  button_text: string;
  url: string;
  weight: number;
  is_active?: boolean;
  sort_order?: number;
};

/** Hash simples e determinístico (mesmo texto → mesmo número). */
export function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Escolhe uma oferta com base nos pesos, de forma estável para a semente.
 * Retorna null se a lista estiver vazia.
 */
export function pickWeightedOffer<T extends { weight: number }>(
  offers: T[],
  seed: string
): T | null {
  if (!offers.length) return null;

  const totalWeight = offers.reduce((sum, offer) => {
    const w = Number(offer.weight);
    return sum + (Number.isFinite(w) && w > 0 ? w : 1);
  }, 0);

  if (totalWeight <= 0) return offers[0] ?? null;

  let cursor = hashString(seed) % totalWeight;

  for (const offer of offers) {
    const w = Number(offer.weight);
    const weight = Number.isFinite(w) && w > 0 ? w : 1;
    if (cursor < weight) return offer;
    cursor -= weight;
  }

  return offers[offers.length - 1] ?? null;
}
