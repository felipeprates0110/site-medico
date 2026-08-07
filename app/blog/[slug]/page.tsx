import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getActiveAffiliateOfferById,
  getActiveAffiliateOffersByCategoryId,
  getApprovedCommentsByArticleId,
  getContactInfo,
  getPublishedArticleBySlug,
  getSiteConfig,
} from "@/lib/data";
import {
  resolveArticleAffiliateOffer,
  resolveOfferProducts,
} from "@/lib/affiliate-offers";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { resolveAuthorCardBio } from "@/lib/author-bio";
import { formatDoctorCrmBadge } from "@/lib/doctor-credentials";
import { AdSenseUnit } from "@/components/blog/AdSenseUnit";
import { AffiliateBox } from "@/components/blog/AffiliateBox";
import { BlogComments } from "@/components/blog/BlogComments";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { DEFAULT_DOCTOR_PHOTO } from "@/lib/doctor-photo";
import { siteConfig as metadataSiteConfig } from "@/lib/metadata";
import {
  formatReadingTime,
  getReadingMinutes,
  readingTimeIsoDuration,
  stripHtml,
} from "@/lib/reading-time";
import { ListenArticleButton } from "@/components/blog/ListenArticleButton";

export const revalidate = 60;

function toAbsoluteImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return metadataSiteConfig.ogImage;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${metadataSiteConfig.url}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

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

  const title =
    article.seo_title || `${article.title} | RitmoBlog`;
  const description =
    article.seo_description ||
    article.excerpt ||
    "Leia este artigo no RitmoBlog.";
  const url = `${metadataSiteConfig.url}/blog/${article.slug}`;
  const ogImage = toAbsoluteImageUrl(article.cover_image_url);

  return {
    title,
    description,
    keywords: [
      article.title,
      "cardiologia",
      "arritmologia",
      "RitmoBlog",
      "saúde do coração",
    ],
    authors: [{ name: metadataSiteConfig.doctor.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url,
      title,
      description,
      siteName: "RitmoBlog",
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
      authors: [metadataSiteConfig.doctor.name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const [article, siteConfig, contact] = await Promise.all([
    getPublishedArticleBySlug(resolvedParams.slug),
    getSiteConfig(),
    getContactInfo(),
  ]);

  if (!article) {
    notFound();
  }

  const category = Array.isArray(article.category)
    ? article.category[0]
    : article.category;
  const categoryId = category?.id as string | undefined;
  const affiliateDisplay = (article.affiliate_display as string) || "auto";
  const forcedOfferId =
    affiliateDisplay === "offer"
      ? (article.affiliate_offer_id as string | null)
      : null;

  const [comments, affiliateOffers, forcedOffer] = await Promise.all([
    getApprovedCommentsByArticleId(article.id),
    categoryId && affiliateDisplay !== "hide"
      ? getActiveAffiliateOffersByCategoryId(categoryId)
      : Promise.resolve([]),
    forcedOfferId
      ? getActiveAffiliateOfferById(forcedOfferId)
      : Promise.resolve(null),
  ]);

  const affiliateOffer = resolveArticleAffiliateOffer({
    display: affiliateDisplay,
    offerId: forcedOfferId,
    articleId: article.id,
    categoryId,
    forcedOffer,
    categoryOffers: affiliateOffers,
  });
  const affiliateProducts = affiliateOffer
    ? resolveOfferProducts(affiliateOffer)
    : [];

  const doctorName = siteConfig?.doctor_name || "Dr. Pedro Felipe";
  const specialty = siteConfig?.specialty || "Cardiologista";
  const subspecialty = siteConfig?.subspecialty
    ? `e ${siteConfig.subspecialty}`
    : "";
  const crm = formatDoctorCrmBadge(
    siteConfig?.doctor_crm,
    siteConfig?.doctor_rqe
  );

  const readingMinutes = getReadingMinutes(article.content || "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: article.title,
    description: article.seo_description || article.excerpt,
    image: toAbsoluteImageUrl(article.cover_image_url),
    datePublished: article.published_at,
    dateModified: article.updated_at,
    timeRequired: readingTimeIsoDuration(readingMinutes),
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
            {category?.name && (
              <span className="mb-6 inline-block rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700">
                {category.name}
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
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatReadingTime(readingMinutes)}
              </span>
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

            <ListenArticleButton
              className="mt-5"
              title={article.title}
              text={stripHtml(article.content || "")}
            />
          </div>

          {article.cover_image_url && (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={article.cover_image_url}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <AuthorBox
            name={doctorName}
            role={`${specialty} ${subspecialty}`.trim()}
            crm={crm}
            bio={resolveAuthorCardBio(
              siteConfig?.bio_short,
              siteConfig?.bio
            )}
            photoUrl={siteConfig?.profile_photo_url || DEFAULT_DOCTOR_PHOTO}
          />

          <div
            className="prose prose-lg prose-slate mt-10 max-w-none space-y-8 text-lg leading-loose text-gray-700 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-a:text-primary-700 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <AdSenseUnit slot="middle_article" />

          {affiliateOffer && affiliateProducts.length > 0 && (
            <AffiliateBox
              title={affiliateOffer.title}
              description={affiliateOffer.description}
              products={affiliateProducts}
            />
          )}

          <BlogComments
            articleId={article.id}
            doctorName={doctorName}
            initialComments={comments}
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
            <TrackedLink
              event="agendar_click"
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
            </TrackedLink>
            <WhatsAppButton
              whatsapp={contact.whatsapp}
              size="lg"
              className="w-full rounded-xl border border-white/20 bg-white/5 text-white shadow-none hover:bg-white/10 sm:w-auto"
            >
              Falar no WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </div>
  );
}
