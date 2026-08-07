import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { FAQAccordion } from "@/components/faq-accordion";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { faqItems } from "@/data/faq";
import { toJsonLdScript } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/page-metadata";
import { buildFaqPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Perguntas Frequentes | Arritmologista em Brasília",
  description:
    "Tire dúvidas: diferença entre cardiologista e arritmologista, quando procurar, ablação, fibrilação atrial, marca-passo e agendamento em Brasília.",
  path: "/faq",
});

export default function FaqPage() {
  const jsonLd = buildFaqPageSchema(faqItems);

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdScript(jsonLd) }}
      />

      {/* Hero — mesmo padrão visual das outras páginas internas */}
      <section className="bg-gradient-to-br from-blue-50 to-white pt-28 pb-16 lg:pt-32">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
            <HelpCircle className="h-8 w-8" aria-hidden />
          </div>
          <p className="section-eyebrow mb-3">FAQ</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-gray-600">
            Respostas claras sobre arritmias, tratamentos e como agendar sua
            consulta com o Dr. Pedro Felipe.
          </p>
        </div>
      </section>

      {/* Accordion com todas as perguntas (não só as 6 da home) */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA — se a dúvida não estiver na lista */}
      <section className="bg-slate-800 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Ainda tem dúvidas?</h2>
          <p className="mb-8 text-xl text-slate-300">
            Fale conosco pelo WhatsApp ou agende uma consulta. Estamos prontos
            para ajudar.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WhatsAppButton
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              message="Olá! Tenho uma dúvida e gostaria de mais informações."
            />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <TrackedLink event="agendar_click" href="/agendar">
                Agendar consulta
              </TrackedLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
