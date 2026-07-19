import Link from "next/link";
import {
  ArrowRight,
  Award,
  Users,
  Clock,
  Star,
  Heart,
  Activity,
  ShieldCheck,
  ChevronRight,
  CalendarCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SpecialtyCard } from "@/components/specialty-card";
import { ReviewCard } from "@/components/review-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  getSpecialties,
  getApprovedReviews,
  getSiteConfig,
  getInsurancePlans,
  getFAQItems,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Agende sua consulta",
    desc: "Escolha o melhor horário via WhatsApp ou formulário online.",
    icon: CalendarCheck,
  },
  {
    step: "02",
    title: "Avaliação completa",
    desc: "Consulta detalhada com exames complementares quando necessário.",
    icon: Stethoscope,
  },
  {
    step: "03",
    title: "Plano personalizado",
    desc: "Tratamento individualizado com acompanhamento contínuo.",
    icon: Heart,
  },
];

export default async function Home() {
  const [specialties, reviews, siteConfig, insurance, faq] = await Promise.all([
    getSpecialties(),
    getApprovedReviews(),
    getSiteConfig(),
    getInsurancePlans(),
    getFAQItems(),
  ]);

  const featuredReviews = reviews.slice(0, 3);
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="flex flex-col">
      {/* Hero — Healthtech style */}
      <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-32">
        <div className="healthtech-grid absolute inset-0" />
        <div className="healthtech-blob absolute -left-32 top-20 h-96 w-96 bg-primary-200/60" />
        <div className="healthtech-blob absolute -right-20 top-40 h-80 w-80 bg-accent-100/80" />
        <div className="healthtech-blob absolute bottom-0 left-1/3 h-64 w-64 bg-primary-100/50" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-primary-800 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary-500" />
                {siteConfig.specialty} em Brasília
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Saúde do coração com{" "}
                <span className="healthtech-gradient-text">tecnologia e cuidado humano</span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-gray-600 lg:text-xl">
                {siteConfig.bio ||
                  "Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva pela UNIFESP/EPM."}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton
                  size="xl"
                  className="rounded-2xl shadow-xl shadow-primary-600/20"
                />
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="rounded-2xl border-gray-200 bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white"
                >
                  <Link href="/sobre">
                    Conheça o Dr. Pedro
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4">
                {[
                  { value: `${reviews.length}+`, label: "Pacientes" },
                  { value: averageRating, label: "Avaliação" },
                  { value: `${insurance.length}+`, label: "Convênios" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/80 bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm"
                  >
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary-100 to-accent-100 opacity-60" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-100 shadow-2xl ring-1 ring-white/60">
                {siteConfig.profile_photo_url ? (
                  <img
                    src={siteConfig.profile_photo_url}
                    alt={siteConfig.doctor_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
                    <Heart className="h-32 w-32 text-white/20" fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{siteConfig.doctor_crm}</p>
                    <p className="text-xs text-gray-500">{siteConfig.doctor_rqe.join(" · ")}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-8 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{averageRating}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Avaliações verificadas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-gray-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">
              Jornada do paciente
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Como funciona o atendimento
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="group relative rounded-3xl border border-gray-100 bg-gray-50/50 p-8 transition-all hover:border-primary-200 hover:bg-primary-50/30 hover:shadow-lg hover:shadow-primary-600/5"
              >
                <span className="text-5xl font-bold text-primary-100">{item.step}</span>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/20">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="bg-gradient-to-b from-primary-50/50 to-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">
              Especialidades
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Cuidado cardiovascular completo
            </h2>
            <p className="text-lg text-gray-600">
              Diagnóstico preciso e tratamentos avançados com abordagem humanizada.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
              <div className="healthtech-blob absolute -left-8 top-0 h-64 w-64 bg-primary-100" />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                  alt="Consultório médico"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">
                Diferenciais
              </p>
              <h2 className="mb-8 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Por que escolher o{" "}
                <span className="healthtech-gradient-text">Dr. Pedro Felipe?</span>
              </h2>
              <div className="space-y-5">
                {[
                  {
                    title: "Formação de excelência",
                    desc: "Especialista pela UNIFESP/EPM, referência nacional em cardiologia.",
                    icon: Award,
                    bg: "bg-primary-50",
                    color: "text-primary-600",
                  },
                  {
                    title: "Tecnologia de ponta",
                    desc: "Equipamentos modernos para diagnósticos precisos e tratamentos eficazes.",
                    icon: Activity,
                    bg: "bg-accent-50",
                    color: "text-accent-600",
                  },
                  {
                    title: "Foco no paciente",
                    desc: "Atendimento humanizado, com tempo para ouvir e explicar cada detalhe.",
                    icon: Users,
                    bg: "bg-emerald-50",
                    color: "text-emerald-600",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                        item.bg
                      )}
                    >
                      <item.icon className={cn("h-6 w-6", item.color)} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="mt-1 text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-8 rounded-2xl px-8">
                <Link href="/sobre">
                  Conheça minha trajetória
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="mb-4 flex justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <h2 className="text-3xl font-bold text-gray-950 sm:text-4xl">
              O que dizem nossos pacientes
            </h2>
            <p className="mt-3 text-base text-gray-700">
              Mais de {reviews.length} avaliações reais e verificadas.
            </p>
          </div>
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-2xl">
              <Link href="/avaliacoes">
                Ver todas as avaliações
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-600">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-3">
            {faq.slice(0, 6).map((item: { id: string; question: string; answer: string }) => (
              <Card
                key={item.id}
                className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <h4 className="mb-2 font-bold text-gray-950">{item.question}</h4>
                  <p className="leading-relaxed text-gray-700">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <WhatsAppButton size="lg" className="rounded-2xl" />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-8 py-16 text-center text-white shadow-2xl shadow-primary-900/20 lg:px-16 lg:py-20">
          <div className="healthtech-blob absolute -left-20 top-0 h-64 w-64 bg-white/10" />
          <div className="healthtech-blob absolute -right-10 bottom-0 h-48 w-48 bg-accent-500/20" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Pronto para cuidar da sua saúde cardiovascular?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
              Agende sua consulta e receba atendimento especializado em Brasília.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <WhatsAppButton
                size="xl"
                className="rounded-2xl border-0 bg-white text-primary-700 shadow-xl hover:bg-primary-50"
              />
              <Button
                asChild
                variant="outline"
                size="xl"
                className="rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/agendar">Formulário de agendamento</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-100">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Dados protegidos
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Resposta rápida
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
