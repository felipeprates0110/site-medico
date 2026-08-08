import {
  fallbackContactInfo,
  fallbackFAQItems,
  fallbackInsurancePlans,
  fallbackPrimaryAddress,
  fallbackReviews,
  fallbackSiteConfig,
  fallbackSpecialties,
} from "./fallback-data";
import type { AffiliateOffer } from "./affiliate-offers";
import { resolveDoctorPhoto } from "./doctor-photo";
import { isSupabaseConfigured, supabase } from "./supabase";

function useLocalDataOnly() {
  return process.env.USE_LOCAL_DATA === "true";
}

async function withFallback<T>(
  label: string,
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (useLocalDataOnly() || !isSupabaseConfigured()) {
    return fallback;
  }

  try {
    return await fetcher();
  } catch (error) {
    console.warn(`[data] Supabase indisponível em "${label}", usando dados locais.`, error);
    return fallback;
  }
}

export async function getSpecialties() {
  return withFallback(
    "getSpecialties",
    async () => {
      const { data, error } = await supabase
        .from("specialties")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    fallbackSpecialties
  );
}

export async function getTreatments() {
  return withFallback(
    "getTreatments",
    async () => {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    []
  );
}

export async function getInsurancePlans() {
  return withFallback(
    "getInsurancePlans",
    async () => {
      const { data, error } = await supabase
        .from("insurance_plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    fallbackInsurancePlans
  );
}

export async function getApprovedReviews() {
  return withFallback(
    "getApprovedReviews",
    async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("date", { ascending: false });

      if (error) throw error;
      // Banco vazio ≠ sucesso útil: usa a amostra local (Doctoralia)
      // para a home e os cards não ficarem zerados.
      if (!data || data.length === 0) return fallbackReviews;
      return data;
    },
    fallbackReviews
  );
}

export async function getFAQItems() {
  return withFallback(
    "getFAQItems",
    async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    fallbackFAQItems
  );
}

export async function getSiteConfig() {
  const config = await withFallback(
    "getSiteConfig",
    async () => {
      const { data, error } = await supabase
        .from("site_config")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    fallbackSiteConfig
  );

  return {
    ...config,
    profile_photo_url: resolveDoctorPhoto(config.profile_photo_url),
  };
}

export async function getContactInfo() {
  return withFallback(
    "getContactInfo",
    async () => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
    fallbackContactInfo
  );
}

/** Endereço principal do consultório (o “cartão de visita” da clínica no site). */
export async function getPrimaryAddress() {
  return withFallback(
    "getPrimaryAddress",
    async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("is_primary", true)
        .maybeSingle();

      if (error) throw error;
      if (data) return data;

      const { data: first, error: firstError } = await supabase
        .from("addresses")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (firstError) throw firstError;
      if (!first) throw new Error("Nenhum endereço cadastrado");
      return first;
    },
    fallbackPrimaryAddress
  );
}

export async function getPublishedArticles() {
  return withFallback(
    "getPublishedArticles",
    async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          cover_image_url,
          created_at,
          published_at,
          updated_at,
          category:blog_categories(name)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    []
  );
}

export async function getPublishedArticleBySlug(slug: string) {
  return withFallback(
    "getPublishedArticleBySlug",
    async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select(`
          *,
          category:blog_categories(id, name)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    null
  );
}

const RELATED_ARTICLE_SELECT = `
  id,
  title,
  slug,
  excerpt,
  content,
  cover_image_url,
  published_at,
  category:blog_categories(name)
`;

type RelatedArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category:
    | { name: string }
    | { name: string }[]
    | null;
};

/**
 * Artigos relacionados para a página do post.
 * Preferência: mesma categoria → completa com recentes do blog.
 */
export async function getRelatedPublishedArticles({
  excludeId,
  categoryId,
  limit = 4,
}: {
  excludeId: string;
  categoryId?: string;
  limit?: number;
}): Promise<RelatedArticleRow[]> {
  if (!excludeId || limit <= 0) return [];

  return withFallback(
    "getRelatedPublishedArticles",
    async () => {
      const results: RelatedArticleRow[] = [];
      const seen = new Set<string>([excludeId]);

      if (categoryId) {
        const { data, error } = await supabase
          .from("blog_articles")
          .select(RELATED_ARTICLE_SELECT)
          .eq("status", "published")
          .eq("category_id", categoryId)
          .neq("id", excludeId)
          .order("published_at", { ascending: false })
          .limit(limit);

        if (error) throw error;

        for (const row of (data as RelatedArticleRow[] | null) ?? []) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);
          results.push(row);
          if (results.length >= limit) return results;
        }
      }

      const remaining = limit - results.length;
      if (remaining <= 0) return results;

      const excludeList = Array.from(seen);
      let query = supabase
        .from("blog_articles")
        .select(RELATED_ARTICLE_SELECT)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(remaining);

      // Supabase: not.in espera lista no formato ("id1","id2")
      query = query.not(
        "id",
        "in",
        `(${excludeList.map((id) => `"${id}"`).join(",")})`
      );

      const { data, error } = await query;
      if (error) throw error;

      for (const row of (data as RelatedArticleRow[] | null) ?? []) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        results.push(row);
        if (results.length >= limit) break;
      }

      return results;
    },
    []
  );
}

/** Ofertas afiliadas ativas de uma categoria (leitura pública). */
export async function getActiveAffiliateOffersByCategoryId(
  categoryId: string
): Promise<AffiliateOffer[]> {
  if (!categoryId) return [];

  return withFallback(
    "getActiveAffiliateOffersByCategoryId",
    async () => {
      const { data, error } = await supabase
        .from("affiliate_offers")
        .select(
          "id, category_id, title, description, button_text, url, products, weight, is_active, sort_order"
        )
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data as AffiliateOffer[]) ?? [];
    },
    []
  );
}

/** Uma oferta ativa por id (para override no artigo). */
export async function getActiveAffiliateOfferById(
  offerId: string
): Promise<AffiliateOffer | null> {
  if (!offerId) return null;

  return withFallback(
    "getActiveAffiliateOfferById",
    async () => {
      const { data, error } = await supabase
        .from("affiliate_offers")
        .select(
          "id, category_id, title, description, button_text, url, products, weight, is_active, sort_order"
        )
        .eq("id", offerId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return (data as AffiliateOffer) ?? null;
    },
    null
  );
}

/** Comentários aprovados de um artigo (só o que o público pode ver). */
export async function getApprovedCommentsByArticleId(articleId: string) {
  return withFallback(
    "getApprovedCommentsByArticleId",
    async () => {
      const { data, error } = await supabase
        .from("blog_comments")
        .select(
          "id, article_id, author_name, content, doctor_reply, replied_at, created_at"
        )
        .eq("article_id", articleId)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    []
  );
}
