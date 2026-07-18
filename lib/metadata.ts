import type { Metadata } from "next";

export const siteConfig = {
  name: "Dr. Pedro Felipe Prates Silva",
  title: "Dr. Pedro Felipe Prates Silva - Cardiologista e Arritmologista em Brasília",
  description:
    "Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva. Tratamento de arritmias cardíacas, fibrilação atrial e ablação por cateter em Brasília - DF. CRM DF 18951.",
  url: "https://drpedrofelipe.com.br",
  ogImage: "https://drpedrofelipe.com.br/og-image.jpg",
  keywords: [
    "cardiologista brasília",
    "cardiologista gama df",
    "arritmologista brasília",
    "tratamento fibrilação atrial",
    "ablação por cateter brasília",
    "eletrofisiologia brasília",
    "arritmia cardíaca tratamento",
    "cardiologista convenio brasília",
  ],
  doctor: {
    name: "Dr. Pedro Felipe Prates Silva",
    crm: "CRM DF 18951",
    rqe: ["RQE 16475", "RQE 16476"],
    specialty: "Cardiologia e Arritmologia",
    subspecialty: "Eletrofisiologia Clínica e Invasiva",
    phone: "61999999999", // Atualizar com telefone real
    whatsapp: "5561999999999", // Atualizar
    email: "contato@drpedrofelipe.com.br", // Atualizar
    address: {
      street: "Q EQ 47-49 PROJEÇÃO 4, SALAS 701, 702 E 708",
      neighborhood: "Gama",
      city: "Brasília",
      state: "DF",
      zip: "72405-498",
      clinic: "Life Centro Cardiológico",
    },
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.doctor.name,
    },
  ],
  creator: siteConfig.doctor.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Atualizar após criar Google Search Console
  },
};
