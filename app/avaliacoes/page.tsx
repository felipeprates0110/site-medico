import type { Metadata } from "next";
import { Star } from "lucide-react";
import { ReviewCard } from "@/components/review-card";
import { reviewStats } from "@/data/reviews";
import { getApprovedReviews } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Avaliações de Pacientes",
  description: `Confira as ${reviewStats.total}+ avaliações reais de pacientes do Dr. Pedro Felipe Prates Silva. Nota média ${reviewStats.average.toFixed(1)}/5.0 baseada em avaliações verificadas.`,
};

export default async function AvaliacoesPage() {
  const reviews = await getApprovedReviews();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-8 w-8 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            {reviewStats.average.toFixed(1)} / 5.0
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Baseado em {reviewStats.total}+ avaliações verificadas
          </p>
          <p className="text-gray-600">
            Avaliações reais de pacientes atendidos pelo Dr. Pedro Felipe
          </p>
        </div>
      </section>

      {/* Distribuição de notas */}
      <section className="py-12 bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                  <div className="flex items-center gap-1 w-24">
                    <span className="text-sm font-medium text-gray-700">
                      {rating}
                    </span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            O que dizem os pacientes
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="mt-12 text-center p-6 bg-white rounded-lg border">
            <p className="text-gray-700">
              Mostrando {reviews.length} de {reviewStats.total}+ avaliações
              verificadas.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Todas as avaliações são reais e verificadas de pacientes
              atendidos.
            </p>
          </div>
        </div>
      </section>

      {/* Nota do Doctoralia */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <p className="text-gray-600">
            Avaliações importadas da plataforma{" "}
            <a
              href="https://www.doctoralia.com.br/pedro-felipe-prates-silva/cardiologista/brasilia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Doctoralia
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
