import {
  fallbackContactInfo,
  fallbackFAQItems,
  fallbackInsurancePlans,
  fallbackReviews,
  fallbackSiteConfig,
  fallbackSpecialties,
} from "./fallback-data";
import { supabase } from "./supabase";

function useLocalDataOnly() {
  return process.env.USE_LOCAL_DATA === "true";
}

async function withFallback<T>(
  label: string,
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (useLocalDataOnly()) {
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
      return data ?? [];
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
  return withFallback(
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
