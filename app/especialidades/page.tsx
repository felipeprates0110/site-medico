import type { Metadata } from "next";
import { SpecialtyCard } from "@/components/specialty-card";
import { specialties } from "@/data/specialties";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Especialidades | Cardiologia e Arritmologia em Brasília",
  description:
    "Cardiologia, arritmologia e eletrofisiologia em Brasília. Palpitações, arritmias e acompanhamento especializado com o Dr. Pedro Felipe na IDC.",
  path: "/especialidades",
});

export default function EspecialidadesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <p className="section-eyebrow mb-3">Áreas de Atuação</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Áreas de Atuação Especializada
          </h1>
          <p className="text-xl text-gray-600">
            Da avaliação de palpitações e tonturas ao acompanhamento especializado
            de arritmias cardíacas.
          </p>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de atendimento especializado?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Agende sua consulta e receba atendimento especializado para sua saúde cardíaca
          </p>
          <WhatsAppButton size="lg" className="bg-green-600 hover:bg-green-700" />
        </div>
      </section>
    </div>
  );
}
