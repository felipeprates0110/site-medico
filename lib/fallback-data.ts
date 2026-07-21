import { faqItems } from "@/data/faq";
import { insurancePlans } from "@/data/insurance";
import { reviews as staticReviews } from "@/data/reviews";
import { specialties as staticSpecialties } from "@/data/specialties";
import { DEFAULT_DOCTOR_PHOTO } from "@/lib/doctor-photo";
import { siteConfig as metadataConfig } from "@/lib/metadata";
import type {
  Address,
  ContactInfo,
  FAQItem,
  InsurancePlan,
  Review,
  SiteConfig,
  Specialty,
} from "@/lib/supabase";

const timestamp = "2024-01-01T00:00:00.000Z";

export const fallbackSiteConfig: SiteConfig = {
  id: "local",
  doctor_name: metadataConfig.doctor.name,
  doctor_crm: metadataConfig.doctor.crm,
  doctor_rqe: metadataConfig.doctor.rqe,
  specialty: metadataConfig.doctor.specialty,
  subspecialty: metadataConfig.doctor.subspecialty,
  bio: metadataConfig.description,
  profile_photo_url: DEFAULT_DOCTOR_PHOTO,
  updated_at: timestamp,
};

export const fallbackContactInfo: ContactInfo = {
  id: "local",
  phone: metadataConfig.doctor.phone,
  whatsapp: metadataConfig.doctor.whatsapp,
  email: metadataConfig.doctor.email,
  updated_at: timestamp,
};

export const fallbackPrimaryAddress: Address = {
  id: "local",
  clinic_name: metadataConfig.doctor.address.clinic,
  street: metadataConfig.doctor.address.street,
  neighborhood: metadataConfig.doctor.address.neighborhood,
  city: metadataConfig.doctor.address.city,
  state: metadataConfig.doctor.address.state,
  zip: metadataConfig.doctor.address.zip,
  latitude: metadataConfig.doctor.address.latitude,
  longitude: metadataConfig.doctor.address.longitude,
  is_primary: true,
  created_at: timestamp,
  updated_at: timestamp,
};

export const fallbackSpecialties: Specialty[] = staticSpecialties.map(
  (specialty, index) => ({
    id: specialty.id,
    title: specialty.title,
    slug: specialty.slug,
    short_description: specialty.shortDescription,
    description: specialty.description,
    icon: specialty.icon,
    benefits: specialty.benefits,
    common_conditions: specialty.commonConditions,
    display_order: index + 1,
    is_active: true,
    created_at: timestamp,
    updated_at: timestamp,
  })
);

export const fallbackInsurancePlans: InsurancePlan[] = insurancePlans.map(
  (plan) => ({
    id: plan.id,
    name: plan.name,
    category: plan.category,
    is_active: true,
    display_order: Number(plan.id),
    created_at: timestamp,
    updated_at: timestamp,
  })
);

export const fallbackReviews: Review[] = staticReviews.map((review) => ({
  id: review.id,
  author: review.author,
  date: review.date,
  rating: review.rating,
  comment: review.comment,
  service: review.service ?? null,
  verified: review.verified,
  approved: true,
  source: "Doctoralia",
  created_at: timestamp,
  updated_at: timestamp,
}));

export const fallbackFAQItems: FAQItem[] = faqItems.map((item, index) => ({
  id: item.id,
  question: item.question,
  answer: item.answer,
  category: item.category,
  display_order: index + 1,
  is_active: true,
  created_at: timestamp,
  updated_at: timestamp,
}));
