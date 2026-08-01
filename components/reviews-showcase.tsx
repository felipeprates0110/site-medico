"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard, type ReviewCardData } from "@/components/review-card";
import { cn } from "@/lib/utils";

interface ReviewsShowcaseProps {
  reviews: ReviewCardData[];
}

export function ReviewsShowcase({ reviews }: ReviewsShowcaseProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredReview = [...reviews].sort(
    (a, b) => b.comment.length - a.comment.length
  )[0];

  // Ordem: destaque primeiro, depois os demais (uma só lista no HTML = SEO ok)
  const orderedReviews = featuredReview
    ? [
        featuredReview,
        ...reviews.filter((review) => review.id !== featuredReview.id),
      ].slice(0, 6)
    : reviews.slice(0, 6);

  const goTo = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slide = scroller.children[index] as HTMLElement | undefined;
    if (!slide) return;
    scroller.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const goPrev = () => goTo(Math.max(0, activeIndex - 1));
  const goNext = () =>
    goTo(Math.min(orderedReviews.length - 1, activeIndex + 1));

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      // No desktop o overflow some — não precisa sincronizar dots
      if (window.matchMedia("(min-width: 1024px)").matches) return;

      const slides = Array.from(scroller.children) as HTMLElement[];
      if (slides.length === 0) return;

      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(center - slideCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  if (orderedReviews.length === 0) return null;

  return (
    <div className="mb-10">
      <div
        ref={scrollerRef}
        className={cn(
          // Mobile: carrossel com snap
          "-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [&::-webkit-scrollbar]:hidden",
          // Desktop: grade com destaque
          "lg:mx-0 lg:grid lg:snap-none lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Avaliações de pacientes"
      >
        {orderedReviews.map((review, index) => (
          <div
            key={review.id}
            className={cn(
              "w-[85%] max-w-sm shrink-0 snap-center sm:w-[70%]",
              "lg:w-auto lg:max-w-none lg:shrink lg:snap-align-none",
              index === 0 && "lg:col-span-2 lg:row-span-2",
              // No desktop, só os 3 primeiros ficam na grade
              index > 2 && "lg:hidden"
            )}
          >
            <ReviewCard review={review} featured={index === 0} />
          </div>
        ))}
      </div>

      {/* Controles só no mobile */}
      <div className="mt-5 flex items-center justify-center gap-4 lg:hidden">
        <button
          type="button"
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Depoimento anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Indicadores do carrossel"
        >
          {orderedReviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Ir para depoimento ${index + 1}`}
              onClick={() => goTo(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === activeIndex
                  ? "w-6 bg-primary-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={activeIndex === orderedReviews.length - 1}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Próximo depoimento"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500 lg:hidden">
        Deslize para o lado para ver mais avaliações
      </p>
    </div>
  );
}
