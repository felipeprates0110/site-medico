import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SegundaOpiniaoForm } from "@/components/segunda-opiniao-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getContactInfo, getPrimaryAddress } from "@/lib/data";

export const metadata: Metadata = {
  title: "Segunda Opinião em Arritmias | Brasília",
  description:
    "Solicite segunda opinião presencial em arritmologia e eletrofisiologia com o Dr. Pedro Felipe na IDC Brasília. Avaliação de fibrilação atrial, indicação de ablação, anticoagulação e dispositivos.",
};

export const revalidate = 60;

const WHATSAPP_QUICK_MESSAGE =
  "Olá! Gostaria de solicitar uma segunda opinião em arritmologia. Já tenho diagnóstico/indicação e gostaria de agendar uma avaliação presencial na IDC.";

export default async function SegundaOpiniaoPage() {
  const [contact, address] = await Promise.all([
    getContactInfo(),
    getPrimaryAddress(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero full-bleed: confiança visual + ação imediata */}
      <section className="relative isolate min-h-[70vh] overflow-hidden sm:min-h-[62vh]">
        <Image
          src="/images/segunda-opiniao-hero.jpg"
          alt="Médico acolhendo paciente durante consulta — gesto de confiança na segunda opinião"
          fill
          priority
          className="object-cover object-[center_45%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-16 sm:min-h-[62vh] sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-200">
              Dr. Pedro Felipe · Arritmologia
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Segunda opinião em arritmias
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-white/85">
              Quer revisar um diagnóstico ou indicação de procedimento? Agende
              sua consulta presencial na IDC Brasília.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Preencher formulário
              </Link>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
              O WhatsApp é para agendamento. A segunda opinião é uma consulta
              médica presencial — em emergência, procure pronto-socorro.
            </p>
          </div>
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
            clinicName={address.clinic_name}
            clinicStreet={address.street}
            clinicNeighborhood={address.neighborhood}
            clinicCity={address.city}
            clinicState={address.state}
          />
        </div>
      </section>
    </div>
  );
}
