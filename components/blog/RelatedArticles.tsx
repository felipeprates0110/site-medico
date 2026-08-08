import { BlogCard } from "@/components/blog/BlogCard";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { getReadingMinutes } from "@/lib/reading-time";

type RelatedArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category:
    | { name: string }
    | { name: string }[]
    | null;
};

type RelatedArticlesProps = {
  nextArticle: RelatedArticle | null;
  relatedArticles: RelatedArticle[];
  authorName: string;
  authorPhotoUrl?: string;
};

function categoryName(
  category: RelatedArticle["category"]
): string {
  if (!category) return "Cardiologia";
  if (Array.isArray(category)) return category[0]?.name || "Cardiologia";
  return category.name || "Cardiologia";
}

/**
 * Continuidade de leitura no fim do artigo:
 * faixa "Próximo" + grade "Leia também" (sem repetir o próximo).
 */
export function RelatedArticles({
  nextArticle,
  relatedArticles,
  authorName,
  authorPhotoUrl,
}: RelatedArticlesProps) {
  if (!nextArticle && relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 border-t border-gray-200 pt-12" aria-label="Artigos relacionados">
      {nextArticle && (
        <TrackedLink
          event="related_article_click"
          href={`/blog/${nextArticle.slug}`}
          className="group mb-12 flex items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-5 transition-colors hover:border-primary-200 hover:bg-primary-50 sm:px-7"
        >
          <div className="min-w-0 text-left">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary-700">
              Próximo artigo
            </p>
            <p className="truncate text-lg font-bold text-gray-900 transition-colors group-hover:text-primary-800 sm:text-xl">
              {nextArticle.title}
            </p>
          </div>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-transform group-hover:translate-x-0.5"
            aria-hidden
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </TrackedLink>
      )}

      {relatedArticles.length > 0 && (
        <div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Leia também
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((article) => (
              <BlogCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt || ""}
                category={categoryName(article.category)}
                authorName={authorName}
                authorPhotoUrl={authorPhotoUrl}
                coverImageUrl={article.cover_image_url || undefined}
                readingMinutes={getReadingMinutes(article.content || "")}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
