import type { Metadata } from "next";
import {
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { SegundaOpiniaoForm } from "@/components/segunda-opiniao-form";
import { getContactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Segunda Opinião em Arritmias | Brasília",
  description:
    "Solicite segunda opinião em arritmologia e eletrofisiologia com o Dr. Pedro Felipe. Avaliação de fibrilação atrial, indicação de ablação, anticoagulação e dispositivos — presencial ou telemedicina.",
};

export const revalidate = 60;

const whenItMakesSense = [
  "Já recebeu diagnóstico de arritmia (como fibrilação atrial ou flutter) e quer validar o plano",
  "Foi indicada ablação por cateter e deseja discutir alternativas e expectativas",
  "Há dúvida sobre anticoagulação, risco de AVC ou necessidade de procedimento",
  "Usa marca-passo ou CDI e busca revisão especializada da conduta",
  "Quer uma avaliação independente antes de decidir o próximo passo",
];

const reviewItems = [
  "Histórico clínico e sintomas",
  "ECG, Holter e outros registros do ritmo",
  "Indicação (ou não) de ablação por cateter",
  "Estratégia de anticoagulação, quando aplicável",
  "Indicação e acompanhamento de marca-passo ou CDI",
];

const steps = [
  {
    title: "Entre em contato",
    description:
      "Pelo formulário ou WhatsApp, diga que busca segunda opinião e compartilhe o contexto do caso.",
  },
  {
    title: "Agende a consulta",
    description:
      "A equipe confirma horário presencial em Brasília ou telemedicina, conforme sua preferência.",
  },
  {
    title: "Revise exames e opções",
    description:
      "Na consulta, os exames são discutidos com clareza e as alternativas são individualizadas.",
  },
];

const faqs = [
  {
    q: "Segunda opinião é a mesma coisa que uma consulta comum?",
    a: "Sim: é uma consulta médica completa, com foco em revisar o que já foi proposto ou diagnosticado. O WhatsApp serve para agendar e organizar informações — a conduta é definida na avaliação.",
  },
  {
    q: "Preciso enviar meus exames pelo site?",
    a: "Não. Por segurança e privacidade, não pedimos upload aqui. Liste o que você já tem e leve os exames na consulta, ou envie depois por um canal seguro indicado pela equipe.",
  },
  {
    q: "Posso fazer a segunda opinião por telemedicina?",
    a: "Em muitos casos, sim. A viabilidade depende do tipo de dúvida e dos exames disponíveis. Indique sua preferência no formulário e alinhamos o melhor formato.",
  },
];

export default async function SegundaOpiniaoPage() {
  const contact = await getContactInfo();

  return (
    <div className="flex flex-col">
      {/* Hero — um job: acolher quem busca segunda opinião */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/40 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
            Dr. Pedro Felipe · Arritmologia
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Segunda opinião em arritmias
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-600">
            É comum buscar outra avaliação antes de decidir sobre ablação,
            medicação ou dispositivo. Seu caso merece uma escuta atenta e uma
            conduta baseada em evidências.
          </p>
        </div>
      </section>

      {/* Quando faz sentido */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            Quando a segunda opinião faz sentido
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Buscar outra opinião não é desconfiança — é cuidado com uma decisão
            importante para a sua saúde.
          </p>
          <ul className="space-y-3">
            {whenItMakesSense.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg bg-gray-50 p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            Como funciona
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
            Três passos simples até a avaliação especializada.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que pode ser revisado */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                O que pode ser revisado
              </h2>
              <p className="text-gray-600">
                Exemplos do que costuma ser discutido na consulta.
              </p>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {reviewItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-gray-100 p-4"
              >
                <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Aviso ético */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:flex-row sm:items-start lg:px-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck className="h-6 w-6 text-primary-300" />
          </div>
          <div>
            <h2 className="mb-3 text-2xl font-bold tracking-tight">
              Transparência no atendimento
            </h2>
            <p className="text-lg leading-relaxed text-slate-300">
              O WhatsApp é destinado a agendamento e informações. Orientações
              médicas e a segunda opinião propriamente dita dependem de avaliação
              adequada — presencial na IDC Brasília ou por telemedicina, quando
              indicada. Em emergência, procure pronto-socorro.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 open:bg-white open:shadow-sm"
              >
                <summary className="cursor-pointer list-none text-left text-base font-semibold text-gray-900 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    {item.q}
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 opacity-60 group-open:opacity-100" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="solicitar" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
              Solicitar segunda opinião
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Preencha o formulário para abrir o WhatsApp com os dados
              organizados, ou fale direto com a equipe.
            </p>
          </div>
          <SegundaOpiniaoForm
            phone={contact.phone}
            whatsapp={contact.whatsapp}
          />
        </div>
      </section>
    </div>
  );
}
