import type { Metadata } from "next";
import { ExternalLink, Star } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { reviewStats } from "@/data/reviews";
import { getApprovedReviews } from "@/lib/data";

export const revalidate = 60;

const DOCTORALIA_URL =
  "https://www.doctoralia.com.br/pedro-felipe-prates-silva/cardiologista/brasilia";

export const metadata: Metadata = {
  title: "Avaliações de Pacientes",
  description: `Confira as ${reviewStats.total}+ avaliações reais de pacientes do Dr. Pedro Felipe Prates Silva. Nota média ${reviewStats.average.toFixed(1)}/5.0 baseada em avaliações verificadas na Doctoralia.`,
};

export default async function AvaliacoesPage() {
  const reviews = await getApprovedReviews();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white pt-28 pb-16 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-8 w-8 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {reviewStats.average.toFixed(1)} / 5.0
          </h1>
          <p className="mb-2 text-xl text-gray-600">
            Baseado em {reviewStats.total}+ avaliações verificadas
          </p>
          <p className="mb-8 text-gray-600">
            Avaliações reais de pacientes atendidos pelo Dr. Pedro Felipe
          </p>
          <Button asChild size="lg" className="rounded-xl">
            <a href={DOCTORALIA_URL} target="_blank" rel="noopener noreferrer">
              Ver perfil na Doctoralia
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Distribuição de notas */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Distribuição de Avaliações
          </h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                reviewStats.distribution[
                  rating as keyof typeof reviewStats.distribution
                ];
              const percentage = (count / reviewStats.total) * 100;

              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex w-24 items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      {rating}
                    </span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm text-gray-600">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                O que dizem os pacientes
              </h2>
              <p className="mt-2 text-gray-600">
                Amostra de depoimentos públicos verificados na Doctoralia.
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Mostrando {reviews.length} de {reviewStats.total}+
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-700">
              Estas são avaliações reais publicadas na Doctoralia. Para ver o
              histórico completo, acesse o perfil oficial.
            </p>
            <Button asChild variant="outline" className="mt-5 rounded-xl">
              <a href={DOCTORALIA_URL} target="_blank" rel="noopener noreferrer">
                Abrir avaliações na Doctoralia
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
