import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
  coverImageUrl?: string;
  authorPhotoUrl?: string;
  categoryColor?: string;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  category,
  authorName,
  coverImageUrl,
  authorPhotoUrl,
  categoryColor = "text-primary-600",
}: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-primary-50 text-sm font-medium text-gray-400">
            RitmoBlog
          </div>
        )}
      </div>
      <div className="flex flex-grow flex-col p-7">
        <span
          className={`mb-3 block text-xs font-bold uppercase tracking-widest ${categoryColor}`}
        >
          {category}
        </span>
        <h3 className="relative mb-3 text-xl font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-primary-700">
          <Link href={`/blog/${slug}`} className="before:absolute before:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-5">
          {authorPhotoUrl ? (
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
              <Image
                src={authorPhotoUrl}
                alt={authorName}
                fill
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
              {authorName.charAt(0)}
            </div>
          )}
          <span className="text-sm font-medium text-gray-600">{authorName}</span>
        </div>
      </div>
    </article>
  );
}
