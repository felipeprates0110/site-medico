import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, Activity, Zap, CheckCircle, ArrowLeft } from "lucide-react";
import { specialties } from "@/data/specialties";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const iconMap = {
  heart: Heart,
  activity: Activity,
  zap: Zap,
};

export async function generateStaticParams() {
  return specialties.map((specialty) => ({
    slug: specialty.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const specialty = specialties.find((s) => s.slug === slug);

  if (!specialty) {
    return {
      title: "Especialidade não encontrada",
    };
  }

  return {
    title: specialty.title,
    description: specialty.description,
  };
}

export default async function EspecialidadePage({ params }: PageProps) {
  const { slug } = await params;
  const specialty = specialties.find((s) => s.slug === slug);

  if (!specialty) {
    notFound();
  }

  const Icon = iconMap[specialty.icon as keyof typeof iconMap] || Heart;

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="bg-gray-50 py-4 border-b">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/especialidades">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Especialidades
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white mb-6">
                <Icon className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                {specialty.title}
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {specialty.description}
              </p>
              <WhatsAppButton
                message={`Olá! Gostaria de agendar uma consulta de ${specialty.title}.`}
              />
            </div>

            {/* Icon placeholder */}
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden flex items-center justify-center">
              <Icon className="h-48 w-48 text-blue-600/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            O que inclui o atendimento
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {specialty.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-blue-50">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Conditions */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Principais condições tratadas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialty.commonConditions.map((condition, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white border hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="text-gray-700 font-medium">{condition}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Agende sua consulta de {specialty.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Receba atendimento especializado e personalizado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              message={`Olá! Gostaria de agendar uma consulta de ${specialty.title}.`}
            />
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
              <Link href="/contato">Outras formas de contato</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
