import Link from "next/link";
import {
  ArrowRight,
  Award,
  Users,
  Clock,
  Star,
  Activity,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SpecialtyCard } from "@/components/specialty-card";
import { ReviewCard } from "@/components/review-card";
import { BlogCard } from "@/components/blog/BlogCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  getSpecialties,
  getApprovedReviews,
  getSiteConfig,
  getInsurancePlans,
  getFAQItems,
  getPublishedArticles,
} from "@/lib/data";

// Rede de segurança: se a revalidação on-demand falhar, a home refaz no máximo em 60s
export const revalidate = 60;

const careerHighlights = [
  "Especialista em Eletrofisiologia Clínica e Invasiva pela UNIFESP/EPM",
  "Atuação em cardiologia, arritmologia e prevenção cardiovascular",
  "Abordagem integrada entre saúde do coração e performance",
  "Atendimento humanizado com diagnóstico preciso e plano individualizado",
];

export default async function Home() {
  const [specialties, reviews, siteConfig, insurance, faq, articles] =
    await Promise.all([
      getSpecialties(),
      getApprovedReviews(),
      getSiteConfig(),
      getInsurancePlans(),
      getFAQItems(),
      getPublishedArticles(),
    ]);

  const featuredReviews = reviews.slice(0, 3);
  const featuredArticles = articles.slice(0, 3);
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  const authorityStats = [
    { value: `${reviews.length}+`, label: "Avaliações de pacientes" },
    { value: averageRating, label: "Nota média" },
    { value: `${insurance.length}+`, label: "Convênios aceitos" },
    { value: "UNIFESP", label: "Formação de excelência" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gray-50 lg:block" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-xl">
              <p className="section-eyebrow mb-5">
                {siteConfig.specialty} · Brasília
              </p>

              <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem]">
                Cuidado cardiológico de precisão, com foco em ritmo, prevenção e
                performance.
              </h1>

              <p className="mb-9 text-lg leading-relaxed text-gray-600">
                {siteConfig.bio ||
                  "Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva pela UNIFESP/EPM."}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <WhatsAppButton
                  size="xl"
                  className="rounded-xl shadow-lg shadow-primary-900/10"
                />
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
                >
                  <Link href="/especialidades">
                    Ver especialidades
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-xl ring-1 ring-gray-200/80 sm:aspect-[5/6]">
                <img
                  src={siteConfig.profile_photo_url || "/images/dr-pedro-felipe.png"}
                  alt={siteConfig.doctor_name || "Dr. Pedro Felipe"}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/45 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-lg font-bold">{siteConfig.doctor_name || "Dr. Pedro Felipe"}</p>
                  <p className="mt-1 text-sm text-white/80">
                    {siteConfig.doctor_crm}
                    {siteConfig.doctor_rqe?.length
                      ? ` · ${siteConfig.doctor_rqe.join(" · ")}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autoridade */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
            {authorityStats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-3xl font-bold tracking-tight text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-eyebrow mb-3">Áreas de atuação</p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Especialidades com foco em excelência
            </h2>
            <p className="text-lg text-gray-600">
              Diagnóstico preciso e tratamentos avançados, com abordagem humana e
              individualizada.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <SpecialtyCard key={specialty.id} specialty={specialty} />
            ))}
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-200/80 lg:order-1">
              <img
                src={siteConfig.profile_photo_url || "/images/dr-pedro-felipe.png"}
                alt={siteConfig.doctor_name || "Dr. Pedro Felipe"}
                className="aspect-[4/5] w-full object-cover object-top sm:aspect-[4/3]"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="section-eyebrow mb-3">Sobre</p>
              <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                Trajetória, formação e visão integrada de saúde
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                Uma prática médica orientada por evidência científica, escuta ativa e
                compromisso com a qualidade de vida — do diagnóstico ao acompanhamento
                contínuo.
              </p>
              <ul className="space-y-4">
                {careerHighlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                    <span className="leading-relaxed text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: Award, label: "Formação de excelência" },
                  { icon: Activity, label: "Tecnologia e precisão" },
                  { icon: Users, label: "Foco no paciente" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700"
                  >
                    <item.icon className="h-4 w-4 text-primary-600" />
                    {item.label}
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-8 rounded-xl px-8">
                <Link href="/sobre">
                  Conheça a trajetória completa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* RitmoBlog */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="section-eyebrow mb-3">RitmoBlog</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Conhecimento que protege o seu ritmo
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Conteúdo médico de alto padrão sobre prevenção, arritmias e longevidade.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl transition-all duration-300"
            >
              <Link href="/blog">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver todos os artigos
              </Link>
            </Button>
          </div>

          {featuredArticles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => {
                const category = Array.isArray(article.category)
                  ? article.category[0]
                  : article.category;

                return (
                  <BlogCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt || ""}
                    category={category?.name || "Cardiologia"}
                    authorName={siteConfig.doctor_name || "Dr. Pedro Felipe"}
                    authorPhotoUrl={siteConfig.profile_photo_url}
                    coverImageUrl={article.cover_image_url}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-primary-600/40" />
              <p className="mt-4 text-lg font-medium text-gray-700">
                Em breve, novos artigos no RitmoBlog
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Informação clara e confiável sobre saúde cardiovascular.
              </p>
              <Button asChild className="mt-6 rounded-xl" variant="outline">
                <Link href="/blog">Visitar o blog</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="section-eyebrow mb-3">Prova social</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              O que dizem os pacientes
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Mais de {reviews.length} avaliações reais e verificadas.
            </p>
          </div>
          <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link href="/avaliacoes">
                Ver todas as avaliações
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="section-eyebrow mb-3">FAQ</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-3">
            {faq.slice(0, 6).map((item: { id: string; question: string; answer: string }) => (
              <Card
                key={item.id}
                className="overflow-hidden rounded-xl border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <h4 className="mb-2 font-bold text-gray-950">{item.question}</h4>
                  <p className="leading-relaxed text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <WhatsAppButton size="lg" className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gray-900 px-8 py-16 text-center text-white lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Pronto para cuidar da sua saúde cardiovascular?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
              Agende sua consulta e receba atendimento especializado em Brasília.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <WhatsAppButton
                size="xl"
                className="rounded-xl border-0 bg-white text-gray-900 shadow-xl hover:bg-primary-50"
              />
              <Button
                asChild
                variant="outline"
                size="xl"
                className="rounded-xl border-white/20 bg-white/5 text-white transition-all duration-300 hover:bg-white/10"
              >
                <Link href="/agendar">Formulário de agendamento</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary-400" />
                Dados protegidos
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-400" />
                Resposta rápida
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
