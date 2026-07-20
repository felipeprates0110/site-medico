import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedArticleBySlug, getSiteConfig } from "@/lib/data";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { AdSenseUnit } from "@/components/blog/AdSenseUnit";
import { AffiliateBox } from "@/components/blog/AffiliateBox";
import { DEFAULT_DOCTOR_PHOTO } from "@/lib/doctor-photo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getPublishedArticleBySlug(resolvedParams.slug);

  if (!article) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: article.seo_title || `${article.title} - RitmoBlog`,
    description: article.seo_description || "Leia este artigo no RitmoBlog.",
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description,
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const [article, siteConfig] = await Promise.all([
    getPublishedArticleBySlug(resolvedParams.slug),
    getSiteConfig(),
  ]);

  if (!article) {
    notFound();
  }

  const doctorName = siteConfig?.doctor_name || "Dr. Pedro Felipe";
  const specialty = siteConfig?.specialty || "Cardiologista";
  const subspecialty = siteConfig?.subspecialty
    ? `e ${siteConfig.subspecialty}`
    : "";
  const crm = `CRM ${siteConfig?.doctor_crm || ""} ${
    siteConfig?.doctor_rqe?.length ? `/ RQE ${siteConfig.doctor_rqe[0]}` : ""
  }`.trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: article.title,
    description: article.seo_description || article.excerpt,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Physician",
      name: doctorName,
      medicalSpecialty: siteConfig?.specialty || "Cardiology",
    },
    publisher: {
      "@type": "MedicalOrganization",
      name: "RitmoBlog",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full pt-28 pb-12 md:pt-32 md:pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center md:text-left">
            {article.category && (
              <span className="mb-6 inline-block rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700">
                {article.category.name}
              </span>
            )}
            <h1 className="mb-6 text-4xl font-bold tracking-tight leading-tight text-gray-900 md:text-5xl">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-500 md:justify-start">
              <time dateTime={article.published_at || article.created_at}>
                Atualizado em{" "}
                {new Date(
                  article.updated_at ||
                    article.published_at ||
                    article.created_at
                ).toLocaleDateString("pt-BR")}
              </time>
              <span className="hidden text-gray-300 sm:inline">|</span>
              <span className="flex items-center gap-1.5 text-primary-700">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Conteúdo verificado por especialista
              </span>
            </div>
          </div>

          <AuthorBox
            name={doctorName}
            role={`${specialty} ${subspecialty}`.trim()}
            crm={crm}
            bio={
              siteConfig?.bio ||
              "Especialista dedicado a traduzir a medicina complexa em prevenção prática para o dia a dia."
            }
            photoUrl={siteConfig?.profile_photo_url || DEFAULT_DOCTOR_PHOTO}
          />

          <div
            className="prose prose-lg prose-slate mt-10 max-w-none space-y-8 text-lg leading-loose text-gray-700 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-a:text-primary-700 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <AdSenseUnit slot="middle_article" />

          <AffiliateBox
            title="Monitoramento Residencial Recomendado"
            description="Para pacientes que precisam monitorar a pressão arterial em casa, recomendamos exclusivamente aparelhos digitais de braço validados clinicamente. Eles garantem a precisão necessária para a avaliação do seu cardiologista."
            buttonText="Ver Monitores Aprovados na Amazon"
            url="https://amazon.com.br"
          />
        </article>
      </main>

      <section id="agendamento" className="mx-auto mb-20 max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/25 via-transparent to-transparent" />

          <h2 className="relative z-10 mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Sente palpitações ou o coração acelerado?
          </h2>
          <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
            Não deixe sua saúde para depois. Agende uma avaliação cardiológica
            completa presencialmente ou via Telemedicina para todo o Brasil.
          </p>
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/agendar"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-primary-50 sm:w-auto"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              Agendar Consulta
            </Link>
            <a
              href="https://wa.me/5561999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white/10 sm:w-auto"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                ></path>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
