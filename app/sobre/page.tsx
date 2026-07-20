import type { Metadata } from "next";
import { Award, GraduationCap, Briefcase, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DEFAULT_DOCTOR_PHOTO } from "@/lib/doctor-photo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre o Dr. Pedro Felipe Prates Silva",
  description:
    "Conheça a formação, experiência e trajetória do Dr. Pedro Felipe Prates Silva, cardiologista e arritmologista especialista em eletrofisiologia clínica e invasiva pela UNIFESP.",
};

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
                Cardiologista e Arritmologista com formação em Eletrofisiologia Clínica e
                Invasiva pela UNIFESP/EPM, dedicado ao diagnóstico e tratamento de
                arritmias cardíacas com excelência e humanização.
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
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre mim</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              A arritmologia é uma subespecialidade da cardiologia em que o médico
              arritmologista é aquele que se dedica ao diagnóstico e tratamento dos
              distúrbios do ritmo do coração (arritmias cardíacas).
            </p>
            <p>
              Graduado em medicina pela Universidade de Cuiabá-MT, possuo formação em
              Cardiologia, com título de especialista emitido pela Sociedade Brasileira
              de Cardiologia, atuando em Brasília com ênfase na área de Eletrofisiologia
              Clínica e Invasiva (Unifesp/EPM).
            </p>
            <p>
              Também atendo consultas cardiológicas em geral, realizando check-ups e risco
              pré-operatório, sempre com foco no cuidado integral e personalizado de cada
              paciente.
            </p>
          </div>
        </div>
      </section>

      {/* Formação */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Formação Acadêmica
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Graduação em Medicina
              </h3>
              <p className="text-gray-600">Universidade de Cuiabá-MT</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Especialização em Cardiologia
              </h3>
              <p className="text-gray-600">
                Título de especialista pela Sociedade Brasileira de Cardiologia (SBC)
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Eletrofisiologia Clínica e Invasiva
              </h3>
              <p className="text-gray-600">UNIFESP/EPM - Centro de Referência Nacional</p>
            </div>
          </div>
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
              "Implante de marca-passo",
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
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Agende sua consulta</h2>
          <p className="text-xl text-blue-100 mb-8">
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
