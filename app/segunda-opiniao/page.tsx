import type { Metadata } from "next";
import { SegundaOpiniaoForm } from "@/components/segunda-opiniao-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getContactInfo } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Segunda Opinião em Arritmias | Brasília",
  description:
    "Solicite segunda opinião em arritmologia e eletrofisiologia com o Dr. Pedro Felipe. Avaliação de fibrilação atrial, indicação de ablação, anticoagulação e dispositivos — presencial ou telemedicina.",
};

export const revalidate = 60;

const WHATSAPP_QUICK_MESSAGE =
  "Olá! Gostaria de solicitar uma segunda opinião em arritmologia. Já tenho diagnóstico/indicação e gostaria de agendar uma avaliação.";

export default async function SegundaOpiniaoPage() {
  const contact = await getContactInfo();

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/40 py-14 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
            Dr. Pedro Felipe · Arritmologia
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Segunda opinião em arritmias
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-gray-600">
            Quer revisar um diagnóstico ou indicação de procedimento? Agende a
            avaliação — presencial em Brasília ou telemedicina.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton
              whatsapp={contact.whatsapp}
              message={WHATSAPP_QUICK_MESSAGE}
              analyticsEvent="segunda_opiniao_click"
              analyticsMeta={{ source: "hero_whatsapp" }}
              size="lg"
            >
              Solicitar pelo WhatsApp
            </WhatsAppButton>
            <Link
              href="#solicitar"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
            >
              Preencher formulário
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-gray-500">
            O WhatsApp é para agendamento. A segunda opinião é uma consulta
            médica — em emergência, procure pronto-socorro.
          </p>
        </div>
      </section>

      <section id="solicitar" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Solicitar segunda opinião
            </h2>
            <p className="text-gray-600">
              Preencha e abra o WhatsApp com os dados organizados.
            </p>
          </div>
          <SegundaOpiniaoForm
            phone={contact.phone}
            whatsapp={contact.whatsapp}
          />
        </div>
      </section>
    </div>
  );
}
