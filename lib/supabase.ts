import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, key);
}

function createSupabaseAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase admin não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key);
}

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient();
  }
  return supabaseClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createSupabaseAdminClient();
  }
  return supabaseAdminClient;
}

function createLazyClient(getClient: () => SupabaseClient): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      const client = getClient();
      const value = Reflect.get(client, prop, client);
      return typeof value === "function"
        ? (value as (...args: unknown[]) => unknown).bind(client)
        : value;
    },
  });
}

// Lazy: só conecta ao Supabase quando usado (evita erro no build da Vercel)
export const supabase = createLazyClient(getSupabase);
export const supabaseAdmin = createLazyClient(getSupabaseAdmin);

// Tipos TypeScript para o banco
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "secretary" | "viewer";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteConfig {
  id: string;
  doctor_name: string;
  doctor_crm: string;
  doctor_rqe: string[];
  specialty: string | null;
  subspecialty: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
  updated_at: string;
}

export interface Address {
  id: string;
  clinic_name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string;
  benefits: string[];
  common_conditions: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Treatment {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  symptoms: string[];
  diagnosis: string[];
  treatment: string[];
  preventive_care: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  category: "private" | "public" | "corporate";
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  service: string | null;
  verified: boolean;
  approved: boolean;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  type: "profile" | "clinic" | "procedure" | "other";
  url: string;
  alt_text: string | null;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "geral" | "agendamento" | "convenios" | "tratamentos";
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
