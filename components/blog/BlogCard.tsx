import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
  coverImageUrl?: string;
  categoryColor?: string; // e.g., "text-[#be123c]"
}

export function BlogCard({
  title,
  slug,
  excerpt,
  category,
  authorName,
  coverImageUrl,
  categoryColor = "text-[#be123c]",
}: BlogCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group h-full">
      <div className="h-56 bg-slate-100 w-full relative overflow-hidden">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <span>[Imagem]</span>
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <span
          className={`text-xs font-bold tracking-widest uppercase mb-3 block ${categoryColor}`}
        >
          {category}
        </span>
        <h3 className="text-xl font-extrabold text-[#0f172a] mb-4 leading-snug group-hover:text-[#0284c7] transition-colors relative">
          <Link href={`/blog/${slug}`} className="before:absolute before:inset-0">
            {title}
          </Link>
        </h3>
        <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
            {authorName.charAt(0)}
          </div>
          <span className="text-sm text-slate-600 font-medium">{authorName}</span>
        </div>
      </div>
    </article>
  );
}
