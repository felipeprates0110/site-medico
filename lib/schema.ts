import { reviewStats } from "@/data/reviews";
import { siteConfig } from "./metadata";

const clinicUrl = siteConfig.doctor.address.clinicUrl;
const clinicProfileUrl = siteConfig.doctor.address.clinicProfileUrl;
/** ID estável da clínica no schema — aponta para o domínio oficial da IDC */
const clinicEntityId = `${clinicUrl}#clinic`;

const clinicPostalAddress = {
  "@type": "PostalAddress" as const,
  streetAddress: siteConfig.doctor.address.street,
  addressLocality: siteConfig.doctor.address.city,
  addressRegion: siteConfig.doctor.address.state,
  postalCode: siteConfig.doctor.address.zip,
  addressCountry: "BR",
};

const clinicGeo = {
  "@type": "GeoCoordinates" as const,
  latitude: String(siteConfig.doctor.address.latitude),
  longitude: String(siteConfig.doctor.address.longitude),
};

// Schema.org - Physician
export const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": `${siteConfig.url}#physician`,
  name: siteConfig.doctor.name,
  url: siteConfig.url,
  image: `${siteConfig.url}/images/dr-pedro-felipe.png`,
  telephone: siteConfig.doctor.phone,
  email: siteConfig.doctor.email,
  medicalSpecialty: ["Cardiology", "Cardiac Electrophysiology"],
  // Ponte médico → clínica: o Google associa você à IDC
  worksFor: { "@id": clinicEntityId },
  affiliation: { "@id": clinicEntityId },
  sameAs: [
    "https://www.doctoralia.com.br/pedro-felipe-prates-silva/cardiologista/brasilia",
    clinicProfileUrl,
  ],
  availableService: [
    {
      "@type": "MedicalProcedure",
      name: "Consulta Cardiológica",
      description: "Consulta cardiológica completa com avaliação clínica detalhada",
    },
    {
      "@type": "MedicalProcedure",
      name: "Consulta Arritmológica",
      description: "Consulta especializada em arritmias cardíacas",
    },
    {
      "@type": "MedicalProcedure",
      name: "Ablação por Cateter",
      description: "Procedimento minimamente invasivo para tratamento de arritmias",
    },
  ],
  address: clinicPostalAddress,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: reviewStats.average.toFixed(1),
    reviewCount: String(reviewStats.total),
    bestRating: "5",
    worstRating: "1",
  },
  priceRange: "R$ 200",
  knowsAbout: [
    "Arritmias Cardíacas",
    "Fibrilação Atrial",
    "Flutter Atrial",
    "Eletrofisiologia",
    "Ablação por Cateter",
    "Marca-passo",
    "Cardiologia Geral",
  ],
};

// Schema.org - Medical Clinic (entidade IDC, não o site do médico)
export const medicalClinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": clinicEntityId,
  name: siteConfig.doctor.address.clinic,
  url: clinicUrl,
  telephone: siteConfig.doctor.phone,
  sameAs: [clinicUrl, clinicProfileUrl],
  address: clinicPostalAddress,
  geo: clinicGeo,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  medicalSpecialty: ["Cardiology", "Cardiac Electrophysiology"],
  availableService: {
    "@type": "MedicalProcedure",
    name: "Consulta Cardiológica e Arritmológica",
  },
  employee: { "@id": `${siteConfig.url}#physician` },
};

// Schema.org - Local Business (prática do médico no endereço da IDC)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}#business`,
  name: siteConfig.name,
  image: `${siteConfig.url}/images/dr-pedro-felipe.png`,
  url: siteConfig.url,
  telephone: siteConfig.doctor.phone,
  priceRange: "R$ 200",
  address: clinicPostalAddress,
  geo: clinicGeo,
  parentOrganization: { "@id": clinicEntityId },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: reviewStats.average.toFixed(1),
    reviewCount: String(reviewStats.total),
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [
    "https://www.doctoralia.com.br/pedro-felipe-prates-silva/cardiologista/brasilia",
    clinicProfileUrl,
  ],
};

// Schema.org combinado para a página principal
export const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [physicianSchema, medicalClinicSchema, localBusinessSchema],
};

/**
 * Schema FAQPage — usado em /faq para rich results e citação em AI Overview.
 * Analogia: um “fichário” de perguntas e respostas que o Google consegue ler.
 */
export function buildFaqPageSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/faq#faq`,
    url: `${siteConfig.url}/faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
