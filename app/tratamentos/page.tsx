import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { treatments } from "@/data/treatments";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tratamentos e Doenças Cardíacas",
  description:
    "Conheça os principais tratamentos oferecidos: fibrilação atrial, ablação por cateter, flutter atrial, bloqueio cardíaco, hipertensão e mais.",
};

export default function TratamentosPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Tratamentos e Doenças
          </h1>
          <p className="text-xl text-gray-600">
            Informações detalhadas sobre as principais condições cardíacas tratadas
          </p>
        </div>
      </section>

      {/* Treatments List */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6">
            {treatments.map((treatment) => (
              <div
                key={treatment.id}
                className="group rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {treatment.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {treatment.shortDescription}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tratamentos/${treatment.slug}`}>
                        Saiba mais
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
