import type { Metadata } from "next";
import { Shield, Building2, Users, Briefcase } from "lucide-react";
import { insurancePlans } from "@/data/insurance";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: "Convênios Médicos Aceitos",
  description:
    "Atendemos 52 convênios médicos em Brasília, incluindo Amil, Camed, Postal Saúde, Geap, Saúde Caixa, SulAmerica e muito mais. Também atendemos particulares.",
};

export default function ConveniosPage() {
  const privateInsurance = insurancePlans.filter((p) => p.category === "private");
  const publicInsurance = insurancePlans.filter((p) => p.category === "public");
  const corporateInsurance = insurancePlans.filter((p) => p.category === "corporate");
  const totalPlans = insurancePlans.length;

  const categoryInfo = {
    private: {
      icon: Building2,
      title: "Planos Privados",
      color: "blue",
    },
    public: {
      icon: Shield,
      title: "Planos Públicos e Estatais",
      color: "green",
    },
    corporate: {
      icon: Briefcase,
      title: "Planos Corporativos",
      color: "purple",
    },
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Convênios Aceitos
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Atendemos <strong>{totalPlans} planos de saúde</strong> diferentes
          </p>
          <p className="text-gray-600">
            Também atendemos pacientes particulares
          </p>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <p className="text-gray-700">
            <strong>Importante:</strong> A cobertura varia de acordo com o plano
            contratado. Confirme a cobertura durante o agendamento ou entre em contato
            com seu convênio.
          </p>
        </div>
      </section>

      {/* Private Insurance */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {categoryInfo.private.title}
              </h2>
              <p className="text-sm text-gray-600">
                {privateInsurance.length} planos
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {privateInsurance.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-lg border bg-white hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-gray-700 font-medium">{plan.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Insurance */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {categoryInfo.public.title}
              </h2>
              <p className="text-sm text-gray-600">
                {publicInsurance.length} planos
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {publicInsurance.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-lg border bg-white hover:border-green-300 hover:shadow-sm transition-all"
              >
                <span className="text-gray-700 font-medium">{plan.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Insurance */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {categoryInfo.corporate.title}
              </h2>
              <p className="text-sm text-gray-600">
                {corporateInsurance.length} planos
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {corporateInsurance.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-lg border bg-white hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <span className="text-gray-700 font-medium">{plan.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Particular */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Atendimento Particular</h2>
          <p className="text-xl text-blue-100 mb-2">
            Valor da consulta: <strong>R$ 200,00</strong>
          </p>
          <p className="text-blue-100 mb-8">
            Formas de pagamento: Dinheiro, Cartão de Crédito, Cartão de Débito ou
            Transferência Bancária
          </p>
          <WhatsAppButton
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            message="Olá! Gostaria de agendar uma consulta particular."
          />
        </div>
      </section>
    </div>
  );
}
