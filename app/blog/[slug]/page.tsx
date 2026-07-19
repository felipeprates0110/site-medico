import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedArticleBySlug, getSiteConfig } from "@/lib/data";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { AdSenseUnit } from "@/components/blog/AdSenseUnit";
import { AffiliateBox } from "@/components/blog/AffiliateBox";

export const revalidate = 3600;

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
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full py-12 md:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center md:text-left">
            {article.category && (
              <span className="inline-block px-3 py-1 bg-rose-50 text-[#be123c] text-xs font-bold tracking-widest uppercase rounded-full mb-6">
                {article.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 font-medium">
              <time dateTime={article.published_at || article.created_at}>
                Atualizado em{" "}
                {new Date(
                  article.updated_at ||
                    article.published_at ||
                    article.created_at
                ).toLocaleDateString("pt-BR")}
              </time>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1.5 text-[#0284c7]">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Conteúdo Verificado por Especialista
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
            photoUrl={siteConfig?.profile_photo_url || undefined}
          />

          <div
            className="text-lg text-slate-700 leading-loose space-y-8 prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-[#0f172a] prose-headings:tracking-tight prose-a:text-[#0284c7] prose-a:no-underline hover:prose-a:underline"
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

      <section id="agendamento" className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] rounded-[2.5rem] p-10 md:p-16 text-center shadow-[0_20px_50px_rgb(2,132,199,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight relative z-10">
            Sente palpitações ou o coração acelerado?
          </h2>
          <p className="text-sky-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
            Não deixe sua saúde para depois. Agende uma avaliação cardiológica
            completa presencialmente ou via Telemedicina para todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
            <Link
              href="/agendar"
              className="w-full sm:w-auto bg-white text-[#0369a1] hover:bg-slate-50 px-8 py-4 rounded-full font-extrabold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              className="w-full sm:w-auto bg-transparent border-2 border-sky-300 text-white hover:bg-sky-800/50 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
