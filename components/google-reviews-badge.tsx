import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { reviewStats } from "@/data/reviews";

/** Ícone + nome Doctoralia na cor teal da marca — só visual. */
function DoctoraliaWordmark() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" fill="#00C3A5" />
        <path
          d="M12 6.5c-1.8 0-3.2 1.2-3.2 3 0 2.2 3.2 5.5 3.2 5.5s3.2-3.3 3.2-5.5c0-1.8-1.4-3-3.2-3z"
          fill="white"
        />
        <circle cx="12" cy="9.3" r="1.15" fill="#00C3A5" />
      </svg>
      <span className="select-none text-[14px] font-semibold leading-none tracking-tight text-[#00C3A5]">
        Doctoralia
      </span>
    </span>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  );
}

type PlatformBadgeProps = {
  brand: ReactNode;
  rating: string;
  total: number;
  label: string;
};

/** Cartão branco arredondado no estilo da imagem de referência. */
function PlatformBadge({ brand, rating, total, label }: PlatformBadgeProps) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm"
      role="img"
      aria-label={`${label}: avaliação ${rating} com base em ${total} avaliações`}
    >
      {brand}
      <Stars />
      <span className="text-sm font-bold text-gray-900">{rating}</span>
      <span className="text-gray-300" aria-hidden="true">
        |
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-gray-800">
        {total} avaliações
      </span>
    </div>
  );
}

/**
 * Selo visual Doctoralia — decorativo, sem link.
 * Números oficiais vêm de reviewStats.
 */
export function ReviewsPlatformBadges() {
  const rating = reviewStats.average.toFixed(1);
  const total = reviewStats.total;

  return (
    <div className="flex justify-center lg:justify-start">
      <PlatformBadge
        brand={<DoctoraliaWordmark />}
        rating={rating}
        total={total}
        label="Doctoralia"
      />
    </div>
  );
}
