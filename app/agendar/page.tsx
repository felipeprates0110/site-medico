import type { Metadata } from "next";
import { AgendarForm } from "@/components/agendar-form";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { getContactInfo } from "@/lib/data";
import { insurancePlans } from "@/data/insurance";

export const metadata: Metadata = {
  title: "Agendar Consulta",
  description:
    "Agende sua consulta com o Dr. Pedro Felipe Prates Silva. Formulário online, WhatsApp ou telefone da IDC Brasília.",
};

export const revalidate = 60;

export default async function AgendarPage() {
  const contact = await getContactInfo();

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Agende sua Consulta
          </h1>
          <p className="text-xl text-gray-600">
            Preencha o formulário abaixo ou utilize o WhatsApp para agendamento
            rápido
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Já tem diagnóstico ou indicação e quer outra avaliação?{" "}
            <TrackedLink
              event="segunda_opiniao_click"
              href="/segunda-opiniao"
              className="font-semibold text-primary-700 underline-offset-2 hover:underline"
            >
              Busco segunda opinião
            </TrackedLink>
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <AgendarForm
            phone={contact.phone}
            whatsapp={contact.whatsapp}
            insurancePlans={insurancePlans.map((plan) => ({
              id: plan.id,
              name: plan.name,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
