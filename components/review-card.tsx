"use client";

import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";
import { cn } from "@/lib/utils";

export type ReviewCardData = Review & {
  source?: string;
};

interface ReviewCardProps {
  review: ReviewCardData;
  /** Destaque maior na home (1 depoimento em evidência). */
  featured?: boolean;
}

const COLLAPSE_LENGTH = 160;

export function ReviewCard({ review, featured = false }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const canCollapse = review.comment.length > COLLAPSE_LENGTH;
  const sourceLabel = review.source ?? "Doctoralia";

  return (
    <Card
      className={cn(
        "h-full rounded-2xl border-gray-100 bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md",
        featured &&
          "border-primary-100 bg-gradient-to-br from-white via-white to-primary-50/40 shadow-md ring-primary-100/80 md:col-span-2 lg:col-span-1"
      )}
    >
      <CardContent className={cn("flex h-full flex-col p-6", featured && "p-8 md:p-10")}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex gap-0.5 text-amber-500" aria-label={`${review.rating} de 5 estrelas`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  featured ? "h-5 w-5" : "h-4 w-4",
                  i < review.rating ? "fill-current" : "text-gray-300"
                )}
              />
            ))}
          </div>
          <Quote
            className={cn(
              "shrink-0 text-primary-200",
              featured ? "h-9 w-9" : "h-7 w-7"
            )}
            aria-hidden
          />
        </div>

        {/* Texto completo no HTML (SEO); line-clamp só esconde visualmente */}
        <blockquote
          className={cn(
            "mb-3 flex-1 leading-relaxed text-gray-800",
            featured
              ? "text-base not-italic sm:text-lg lg:text-xl"
              : "text-base italic",
            canCollapse && !expanded && (featured ? "line-clamp-5 sm:line-clamp-6" : "line-clamp-4")
          )}
        >
          &ldquo;{review.comment}&rdquo;
        </blockquote>

        {canCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mb-5 self-start text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
          >
            {expanded ? "Mostrar menos" : "Ler depoimento completo"}
          </button>
        )}

        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-5">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-primary-600 font-bold text-white",
              featured ? "h-12 w-12 text-base" : "h-10 w-10 text-sm"
            )}
            aria-hidden
          >
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className={cn("font-bold text-gray-900", featured ? "text-base" : "text-sm")}>
              {review.author}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#00A88E]">
              {sourceLabel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
