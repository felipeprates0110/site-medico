import { Star } from "lucide-react";
import { reviewStats } from "@/data/reviews";

/** Wordmark tipográfico nas cores da marca Google — só visual. */
function GoogleWordmark() {
  const letters = [
    { char: "G", color: "#4285F4" },
    { char: "o", color: "#EA4335" },
    { char: "o", color: "#FBBC05" },
    { char: "g", color: "#4285F4" },
    { char: "l", color: "#34A853" },
    { char: "e", color: "#EA4335" },
  ];

  return (
    <span
      className="select-none text-[15px] font-medium leading-none tracking-tight"
      aria-hidden="true"
    >
      {letters.map((letter, i) => (
        <span key={`${letter.char}-${i}`} style={{ color: letter.color }}>
          {letter.char}
        </span>
      ))}
    </span>
  );
}

/**
 * Selo visual de avaliações (inspirado no Google) — decorativo, sem link.
 * Números vêm de reviewStats para ficar alinhados com a faixa.
 */
export function GoogleReviewsBadge() {
  const rating = reviewStats.average.toFixed(1);
  const total = reviewStats.total;

  return (
    <div
      className="inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm"
      role="img"
      aria-label={`Avaliação ${rating} com base em ${total} avaliações`}
    >
      <GoogleWordmark />
      <div className="flex items-center gap-0.5 text-amber-400" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
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
