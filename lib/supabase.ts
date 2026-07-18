import { createClient } from "@supabase/supabase-js";

// Variáveis de ambiente do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente público (para dados públicos do site)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com service role (para operações administrativas)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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
