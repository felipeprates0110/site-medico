import type { Metadata } from "next";
import { Award, GraduationCap, Briefcase, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DEFAULT_DOCTOR_PHOTO } from "@/lib/doctor-photo";
import { siteConfig } from "@/lib/metadata";
import { buildPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Sobre | Cardiologista e Arritmologista em Brasília",
  description:
    "Dr. Pedro Felipe Prates Silva — cardiologista e arritmologista (CRM DF 18951). Formação, trajetória e atendimento presencial na IDC Brasília — Asa Sul.",
  path: "/sobre",
});

export default function SobrePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gray-50 pt-28 pb-16 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-xl ring-1 ring-gray-200/80">
              <img
                src={DEFAULT_DOCTOR_PHOTO}
                alt="Dr. Pedro Felipe Prates Silva"
                className="h-full w-full object-cover object-top"
              />
              {/* Selo SBC — canto inferior direito, ~18% da foto */}
              <div className="pointer-events-none absolute bottom-3 right-3 w-[18%] min-w-[64px] max-w-[110px] sm:bottom-4 sm:right-4">
                <div className="rounded-full bg-white/95 p-1.5 shadow-md ring-1 ring-black/5">
                  <img
                    src="/images/sbc-logo.png"
                    alt="Sociedade Brasileira de Cardiologia"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="section-eyebrow mb-4">Sobre</p>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Dr. Pedro Felipe Prates Silva
              </h1>
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                  <Award className="h-4 w-4" />
                  CRM DF 18951
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                  RQE 16475
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                  RQE 16476
                </span>
              </div>
              <p className="mb-8 text-xl leading-relaxed text-gray-700">
                Cardiologista e Arritmologista em Brasília com especialização em
                Eletrofisiologia Clínica e Invasiva pela UNIFESP/EPM. Atuação dedicada ao
                diagnóstico de palpitações, tonturas e desmaios, e ao tratamento de
                arritmias cardíacas complexas, como a Fibrilação Atrial, através de
                ablação por cateter e indicação de marcapasso e cardiodesfibriladores
                (CDI).
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <WhatsAppButton />
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/especialidades">Ver especialidades</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
            Sobre mim
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-gray-700">
            <p>
              Sempre acreditei que cuidar do coração vai muito além de interpretar exames
              ou escolher o tratamento mais adequado. É sobre ouvir, acolher e caminhar junto com
              cada paciente, entendendo suas histórias, seus medos e seus objetivos de
              vida.
            </p>
            <p>
              Sou médico formado pela Universidade de Cuiabá-MT e me especializei em
              Cardiologia. Mais tarde, encontrei na arritmologia minha verdadeira vocação —
              a área que se dedica aos distúrbios do ritmo cardíaco. Desde então,
              aprofundei minha formação em Eletrofisiologia Invasiva, trazendo para
              Brasília um cuidado técnico, atualizado e, acima de tudo, humano.
            </p>
            <p>
              Além do tratamento de arritmias complexas, também realizo consultas
              cardiológicas gerais, check-ups e avaliações pré-operatórias. Em cada
              consulta, meu foco é o mesmo: oferecer atenção genuína, explicar com clareza
              e construir, junto com o paciente, o melhor caminho para sua saúde e
              bem-estar.
            </p>
            <p>
              Atendo presencialmente na{" "}
              <a
                href={siteConfig.doctor.address.clinicProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary-700 underline-offset-2 hover:underline"
              >
                IDC — Instituto de Doenças Cardiovasculares
              </a>
              , no Centro Médico de Brasília (Asa Sul), onde faço parte do corpo
              clínico em cardiologia e eletrofisiologia.
            </p>
            <p>
              Acredito que confiança se constrói no detalhe — no olhar atento, na escuta
              cuidadosa e na sensação de que você não está enfrentando nada sozinho.
            </p>
          </div>
        </div>
      </section>

      {/* Currículo resumido */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <p className="section-eyebrow mb-3">Trajetória</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Currículo resumido
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Formação e atuação profissional em cardiologia e eletrofisiologia.
            </p>
          </div>

          <ol className="space-y-4">
            {[
              {
                icon: GraduationCap,
                title: "Graduação em Medicina",
                detail: "Universidade de Cuiabá — MT",
              },
              {
                icon: Heart,
                title: "Residência em Clínica Médica",
                detail: "Hospital Regional de Taguatinga",
              },
              {
                icon: Heart,
                title: "Residência em Cardiologia",
                detail: "Instituto Hospital de Base do Distrito Federal",
              },
              {
                icon: Award,
                title: "Especialista em Eletrofisiologia Clínica e Invasiva",
                detail: "Universidade Federal de São Paulo — Unifesp/EPM",
              },
              {
                icon: Award,
                title: "Título de Especialista",
                detail: "Sociedade Brasileira de Cardiologia (SBC)",
              },
              {
                icon: Briefcase,
                title: "Médico do Corpo Clínico — IDC Brasília",
                detail:
                  "IDC — Instituto de Doenças Cardiovasculares · Centro Médico de Brasília (Asa Sul)",
              },
              {
                icon: Briefcase,
                title: "Médico do Corpo Clínico — Hospital de Base",
                detail:
                  "Setor de Eletrofisiologia e Arritmias Cardíacas — Instituto Hospital de Base do Distrito Federal",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-gray-600">{item.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Experiência */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Áreas de Atuação</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Eletrofisiologia clínica e invasiva",
              "Arritmologia",
              "Diagnóstico e tratamento de arritmias",
              "Ablação por cateter",
              "Estudo eletrofisiológico",
              "Avaliação e indicação de marca-passo",
              "Cardiologia geral",
              "Check-up cardiológico",
              "Risco pré-operatório",
              "Tratamento de fibrilação atrial",
              "Tratamento de flutter atrial",
              "Acompanhamento de portadores de marca-passo",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Agende sua consulta</h2>
          <p className="text-xl text-slate-300 mb-8">
            Receba atendimento especializado e humanizado. Entre em contato para agendar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WhatsAppButton
              size="lg"
              className="bg-green-600 hover:bg-green-700"
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
