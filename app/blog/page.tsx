import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { AdSenseUnit } from "@/components/blog/AdSenseUnit";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "RitmoBlog - Excelência em Cardiologia e Arritmologia",
  description: "Informação médica de alto padrão sobre prevenção, arritmias e longevidade, produzida por especialistas de referência.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogFeedPage() {
  const { data: articles } = await supabaseAdmin
    .from("blog_articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      created_at,
      category:blog_categories(name),
      author:users(name)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* AdSense Superior */}
      <div className="max-w-6xl mx-auto px-4 w-full mt-8">
        <AdSenseUnit slot="superior_banner" />
      </div>

      {/* Seção Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[#be123c] text-sm font-semibold tracking-wide">
          Centro de Excelência em Cardiologia
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight leading-tight mb-6">
          A ciência de cuidar do <span className="text-[#be123c]">ritmo</span> da sua vida.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Informação médica de alto padrão sobre prevenção, arritmias e longevidade, produzida por especialistas de referência.
        </p>
      </section>

      {/* Grid de Artigos */}
      <main className="max-w-6xl mx-auto px-4 pb-20 w-full">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Publicações Recentes</h2>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => {
              // Assign a color based on category name just for visual variety
              const colors = ["text-[#be123c]", "text-[#0284c7]", "text-emerald-600", "text-indigo-600", "text-amber-600"];
              const colorIndex = article.category?.name ? article.category.name.length % colors.length : 0;
              
              return (
                <BlogCard
                  key={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt || ""}
                  category={article.category?.name || "Geral"}
                  authorName={article.author?.name || "Dr. Pedro Felipe"}
                  coverImageUrl={article.cover_image_url}
                  categoryColor={colors[colorIndex]}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-lg">Nenhum artigo publicado ainda.</p>
          </div>
        )}
      </main>
    </div>
  );
}
