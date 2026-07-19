import { Metadata } from "next";
import { getPublishedArticles, getSiteConfig } from "@/lib/data";
import { AdSenseUnit } from "@/components/blog/AdSenseUnit";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "RitmoBlog - Excelência em Cardiologia e Arritmologia",
  description:
    "Informação médica de alto padrão sobre prevenção, arritmias e longevidade, produzida por especialistas de referência.",
};

export const revalidate = 3600;

export default async function BlogFeedPage() {
  const [articles, siteConfig] = await Promise.all([
    getPublishedArticles(),
    getSiteConfig(),
  ]);

  const authorName = siteConfig?.doctor_name || "Dr. Pedro Felipe";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto mt-24 w-full max-w-6xl px-4 lg:mt-28">
        <AdSenseUnit slot="superior_banner" />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
        <p className="section-eyebrow mb-4 inline-block">RitmoBlog</p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          A ciência de cuidar do{" "}
          <span className="text-primary-600">ritmo</span> da sua vida.
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
          Informação médica de alto padrão sobre prevenção, arritmias e
          longevidade, produzida por especialistas de referência.
        </p>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Publicações recentes
          </h2>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
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
                  authorName={authorName}
                  coverImageUrl={article.cover_image_url}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <p className="text-lg text-gray-500">
              Nenhum artigo publicado ainda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
