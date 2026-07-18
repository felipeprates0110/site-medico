import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertCircle, Stethoscope, Pill, Shield } from "lucide-react";
import { treatments } from "@/data/treatments";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return treatments.map((treatment) => ({
    slug: treatment.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    return {
      title: "Tratamento não encontrado",
    };
  }

  return {
    title: treatment.title,
    description: treatment.description,
  };
}

export default async function TratamentoPage({ params }: PageProps) {
  const { slug } = await params;
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 border-b">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/tratamentos">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Tratamentos
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            {treatment.title}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            {treatment.description}
          </p>
          <WhatsAppButton
            message={`Olá! Gostaria de saber mais sobre ${treatment.title}.`}
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 space-y-12">
          {/* Symptoms */}
          {treatment.symptoms.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sintomas</h2>
              </div>
              <ul className="space-y-3">
                {treatment.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-red-600 flex-shrink-0" />
                    <span className="text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagnosis */}
          {treatment.diagnosis.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Diagnóstico</h2>
              </div>
              <ul className="space-y-3">
                {treatment.diagnosis.map((diag, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{diag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Treatment */}
          {treatment.treatment.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <Pill className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tratamento</h2>
              </div>
              <ul className="space-y-3">
                {treatment.treatment.map((treat, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{treat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preventive Care */}
          {treatment.preventiveCare && treatment.preventiveCare.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Prevenção</h2>
              </div>
              <ul className="space-y-3">
                {treatment.preventiveCare.map((prev, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{prev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de atendimento?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Agende uma consulta para avaliação e tratamento adequado
          </p>
          <WhatsAppButton
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            message={`Olá! Gostaria de agendar uma consulta sobre ${treatment.title}.`}
          />
        </div>
      </section>
    </div>
  );
}
