import type { Metadata } from "next";

export const siteConfig = {
  name: "Dr. Pedro Felipe Prates Silva",
  title: "Dr. Pedro Felipe Prates Silva - Cardiologista e Arritmologista em Brasília",
  description:
    "Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva. Tratamento de arritmias cardíacas, fibrilação atrial e ablação por cateter em Brasília - DF. CRM DF 18951.",
  url: "https://drpedrofelipe.com.br",
  ogImage: "https://drpedrofelipe.com.br/images/dr-pedro-felipe.png",
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
    // Telefone da IDC Brasília (idcbrasilia.com.br)
    phone: "(61) 3346-0202",
    // Formato internacional sem + (usado no link wa.me)
    whatsapp: "5561996270787",
    email: "pedrofelipe@ritmocardio.com.br",
    address: {
      street: "SHLS 716, Conjunto B, Bloco C — Centro Médico de Brasília",
      neighborhood: "Asa Sul",
      city: "Brasília",
      state: "DF",
      zip: "70390-700",
      clinic: "IDC - Instituto de Doenças Cardiovasculares",
      // Coordenadas do SHLS 716 / Centro Médico de Brasília
      latitude: -15.8278852,
      longitude: -47.9284578,
      mapsUrl: "https://maps.app.goo.gl/UP3nskobzLyg1uAh9",
      wazeUrl: "https://waze.com/ul/h6vjvvqemt",
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
