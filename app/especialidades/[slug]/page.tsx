import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Heart,
  Activity,
  Zap,
  CheckCircle,
  ArrowLeft,
  Stethoscope,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
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
  const hasConditionDetails =
    specialty.conditionDetails && specialty.conditionDetails.length > 0;
  const hasApproach = Boolean(specialty.approach?.trim());
  const hasWhenToSeek = specialty.whenToSeek && specialty.whenToSeek.length > 0;
  const hasExams = specialty.exams && specialty.exams.length > 0;
  const hasPreventionNote = Boolean(specialty.preventionNote?.trim());

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <section className="border-b bg-gray-50 py-4">
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
      <section className="bg-gradient-to-br from-primary-50/80 via-white to-white py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Icon className="h-7 w-7" />
          </div>
          <p className="section-eyebrow mb-3">Especialidade</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {specialty.title}
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-gray-700">
            {specialty.description}
          </p>
          <WhatsAppButton
            message={`Olá! Gostaria de agendar uma consulta de ${specialty.title}.`}
          />
        </div>
      </section>

      {/* Como funciona a consulta */}
      {hasApproach && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Como funciona a consulta
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              {specialty.approach}
            </p>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className={hasApproach ? "bg-gray-50 py-16" : "bg-white py-16"}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            O que inclui o atendimento
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {specialty.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-100"
              >
                <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condições */}
      <section className={hasApproach ? "bg-white py-16" : "bg-gray-50 py-16"}>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            Principais condições tratadas
          </h2>
          <p className="mb-8 max-w-2xl text-gray-600">
            Abaixo, as situações mais comuns avaliadas nesta especialidade — com
            uma explicação breve para orientar a conversa na consulta.
          </p>

          {hasConditionDetails ? (
            <div className="grid gap-5 md:grid-cols-2">
              {specialty.conditionDetails!.map((condition) => {
                const isArrhythmia =
                  specialty.slug === "cardiologia" &&
                  condition.title.toLowerCase().includes("arritmia");

                return (
                  <div
                    key={condition.title}
                    className="rounded-2xl border border-gray-100 bg-gray-50/80 p-6"
                  >
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {condition.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600">
                      {condition.summary}
                    </p>
                    {isArrhythmia && (
                      <Link
                        href="/especialidades/arritmologia"
                        className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Conheça a Arritmologia
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {specialty.commonConditions.map((condition) => (
                <div
                  key={condition}
                  className="rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-primary-200 hover:shadow-sm"
                >
                  <span className="font-medium text-gray-700">{condition}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quando procurar */}
      {hasWhenToSeek && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Quando procurar um cardiologista
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-gray-600">
              Doenças do coração podem ser silenciosas. Vale investigar se você
              notar estes sinais — sobretudo quando aparecem juntos — ou se há
              fatores de risco importantes.
            </p>
            <ul className="grid gap-3 md:grid-cols-2">
              {specialty.whenToSeek!.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-gray-100"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-500">
              Esses sintomas também podem ter outras causas. Em dor intensa no
              peito, falta de ar grave ou desmaio, procure atendimento de
              emergência. Nos demais casos, uma avaliação cardiológica ajuda a
              esclarecer o quadro com segurança.
            </p>
          </div>
        </section>
      )}

      {/* Exames */}
      {hasExams && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Exames frequentemente solicitados
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-gray-600">
              Nem todo paciente precisa de todos os exames. A indicação depende
              da história clínica, do exame físico e dos objetivos do
              acompanhamento.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {specialty.exams!.map((exam) => (
                <div
                  key={exam}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3"
                >
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary-600" />
                  <span className="text-gray-700">{exam}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prevenção */}
      {hasPreventionNote && (
        <section className="border-y border-primary-100 bg-primary-50/50 py-14">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Prevenção e acompanhamento
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              {specialty.preventionNote}
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">
            Agende sua consulta de {specialty.title}
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            Atendimento especializado, com escuta atenta e conduta baseada em
            evidências.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <WhatsAppButton
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              message={`Olá! Gostaria de agendar uma consulta de ${specialty.title}.`}
            />
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/contato">Outras formas de contato</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
