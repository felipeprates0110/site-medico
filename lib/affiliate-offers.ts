/**
 * Ofertas afiliadas do blog: tipos, normalização de produtos e escolha ponderada.
 *
 * Analogia: cada oferta é uma prateleira (título + texto).
 * Dentro dela ficam vários produtos lado a lado (Apple Watch, Galaxy Watch…).
 * O "peso" decide qual prateleira aparece no artigo; a semente (id do artigo)
 * mantém a mesma escolha a cada refresh.
 */

export type AffiliateProduct = {
  label: string;
  url: string;
  image_url: string;
  sort_order: number;
};

export type AffiliateOffer = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  /** @deprecated Preferir products — mantido sincronizado com o 1º produto */
  button_text?: string;
  /** @deprecated Preferir products — mantido sincronizado com o 1º produto */
  url?: string;
  products: AffiliateProduct[];
  weight: number;
  is_active?: boolean;
  sort_order?: number;
};

/** Como o artigo controla a caixa de oferta. */
export type AffiliateDisplayMode = "auto" | "offer" | "hide";

export function isAffiliateDisplayMode(
  value: unknown
): value is AffiliateDisplayMode {
  return value === "auto" || value === "offer" || value === "hide";
}

/**
 * Decide qual oferta mostrar no artigo.
 * Analogia: automático = ar-condicionado sozinho; offer = temperatura fixa; hide = desligado.
 */
export function resolveArticleAffiliateOffer(input: {
  display?: string | null;
  offerId?: string | null;
  articleId: string;
  categoryId?: string | null;
  forcedOffer?: AffiliateOffer | null;
  categoryOffers: AffiliateOffer[];
}): AffiliateOffer | null {
  const mode: AffiliateDisplayMode = isAffiliateDisplayMode(input.display)
    ? input.display
    : "auto";

  if (mode === "hide") return null;

  if (mode === "offer") {
    const forced = input.forcedOffer;
    if (
      forced &&
      forced.is_active !== false &&
      (!input.categoryId || forced.category_id === input.categoryId)
    ) {
      return forced;
    }
    // Oferta inválida/inativa/outra categoria → cai no automático
  }

  return pickWeightedOffer(input.categoryOffers, input.articleId);
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Valida e limpa a lista de produtos vinda do admin.
 * Retorna { products } ou { error }.
 */
export function normalizeAffiliateProducts(
  raw: unknown
): { products: AffiliateProduct[] } | { error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "Adicione pelo menos um produto na oferta" };
  }

  const products: AffiliateProduct[] = [];

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as Record<string, unknown>;
    const label = String(item?.label ?? "").trim();
    const url = String(item?.url ?? "").trim();
    const imageUrl = String(item?.image_url ?? "").trim();
    const sortRaw = Number(item?.sort_order);
    const sort_order = Number.isFinite(sortRaw) ? Math.floor(sortRaw) : i;

    if (!label) {
      return { error: `Produto ${i + 1}: informe o nome/texto do botão` };
    }
    if (!url || !isValidHttpUrl(url)) {
      return {
        error: `Produto ${i + 1}: URL afiliada inválida (use http:// ou https://)`,
      };
    }
    if (imageUrl && !isValidHttpUrl(imageUrl)) {
      return {
        error: `Produto ${i + 1}: URL da foto inválida (use http:// ou https://)`,
      };
    }

    products.push({
      label,
      url,
      image_url: imageUrl,
      sort_order,
    });
  }

  products.sort((a, b) => a.sort_order - b.sort_order);
  return { products };
}

/** Garante products[] mesmo se o registro for antigo (só button_text/url). */
export function resolveOfferProducts(
  offer: Partial<AffiliateOffer> & {
    button_text?: string | null;
    url?: string | null;
    products?: unknown;
  }
): AffiliateProduct[] {
  const normalized = normalizeAffiliateProducts(offer.products);
  if ("products" in normalized && normalized.products.length > 0) {
    return normalized.products;
  }

  const label = String(offer.button_text ?? "").trim();
  const url = String(offer.url ?? "").trim();
  if (label && url && isValidHttpUrl(url)) {
    return [{ label, url, image_url: "", sort_order: 0 }];
  }

  return [];
}

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
