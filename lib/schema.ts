import { siteConfig } from "./metadata";

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
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.doctor.address.street,
    addressLocality: siteConfig.doctor.address.city,
    addressRegion: siteConfig.doctor.address.state,
    postalCode: siteConfig.doctor.address.zip,
    addressCountry: "BR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "230",
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

// Schema.org - Medical Clinic
export const medicalClinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": `${siteConfig.url}#clinic`,
  name: siteConfig.doctor.address.clinic,
  url: siteConfig.url,
  telephone: siteConfig.doctor.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.doctor.address.street,
    addressLocality: siteConfig.doctor.address.city,
    addressRegion: siteConfig.doctor.address.state,
    postalCode: siteConfig.doctor.address.zip,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: String(siteConfig.doctor.address.latitude),
    longitude: String(siteConfig.doctor.address.longitude),
  },
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
};

// Schema.org - Local Business
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}#business`,
  name: siteConfig.name,
  image: `${siteConfig.url}/images/dr-pedro-felipe.png`,
  url: siteConfig.url,
  telephone: siteConfig.doctor.phone,
  priceRange: "R$ 200",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.doctor.address.street,
    addressLocality: siteConfig.doctor.address.city,
    addressRegion: siteConfig.doctor.address.state,
    postalCode: siteConfig.doctor.address.zip,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: String(siteConfig.doctor.address.latitude),
    longitude: String(siteConfig.doctor.address.longitude),
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "230",
  },
  sameAs: [
    // Adicionar links de redes sociais quando disponível
    "https://www.doctoralia.com.br/pedro-felipe-prates-silva/cardiologista/brasilia",
  ],
};

// Schema.org combinado para a página principal
export const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [physicianSchema, medicalClinicSchema, localBusinessSchema],
};
