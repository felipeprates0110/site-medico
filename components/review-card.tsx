import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";

export type ReviewCardData = Review & {
  source?: string;
};

interface ReviewCardProps {
  review: ReviewCardData;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="h-full rounded-3xl border-gray-200 bg-white shadow-md ring-1 ring-gray-100 transition-all hover:border-primary-200 hover:shadow-lg">
      <CardContent className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-0.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
              />
            ))}
          </div>
          <Quote className="h-8 w-8 text-primary-200" />
        </div>

        <p className="mb-8 line-clamp-4 text-base italic leading-relaxed text-gray-800">
          &ldquo;{review.comment}&rdquo;
        </p>

        <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
            {review.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-950">{review.author}</h4>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">{review.date}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
                {review.source ?? "Verificado"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
