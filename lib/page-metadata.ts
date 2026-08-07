import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

type PageMetadataInput = {
  /** Title da aba / SERP (sem o sufixo do template do layout) */
  title: string;
  /** Meta description (~150–160 caracteres) */
  description: string;
  /** Caminho absoluto a partir da raiz, ex.: "/faq" ou "/especialidades/arritmologia" */
  path: string;
};

/**
 * Monta metadata com canonical e Open Graph.
 * Analogia: o "cartão de visita" que o Google e o WhatsApp mostram ao compartilhar a página.
 */
export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteConfig.url}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "pt_BR",
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
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
