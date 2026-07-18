import type { Metadata } from "next";
import { SpecialtyCard } from "@/components/specialty-card";
import { specialties } from "@/data/specialties";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: "Especialidades Médicas",
  description:
    "Cardiologia geral, arritmologia e eletrofisiologia clínica e invasiva. Conheça as áreas de especialização do Dr. Pedro Felipe Prates Silva em Brasília.",
};

export default function EspecialidadesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Áreas de Especialização
          </h1>
          <p className="text-xl text-gray-600">
            Atendimento especializado em cardiologia com foco em arritmias cardíacas e
            procedimentos de eletrofisiologia
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de atendimento especializado?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Agende sua consulta e receba o melhor tratamento para sua saúde cardíaca
          </p>
          <WhatsAppButton size="lg" className="bg-green-600 hover:bg-green-700" />
        </div>
      </section>
    </div>
  );
}
