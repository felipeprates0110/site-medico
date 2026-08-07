import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingWhatsAppButton } from "@/components/whatsapp-button";
import { SiteShell } from "@/components/site-shell";
import { SiteAnalyticsProvider } from "@/components/analytics/site-analytics-provider";
import { defaultMetadata } from "@/lib/metadata";
import { combinedSchema } from "@/lib/schema";
import { toJsonLdScript } from "@/lib/json-ld";
import { getContactInfo } from "@/lib/data";
import { Providers } from "./providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getContactInfo();

  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLdScript(combinedSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans">
        <Providers>
          <SiteShell
            header={<Header />}
            footer={<Footer />}
            floatingWhatsApp={
              <FloatingWhatsAppButton whatsapp={contact.whatsapp} />
            }
          >
            {children}
          </SiteShell>
          <SiteAnalyticsProvider />
        </Providers>
      </body>
    </html>
  );
}
