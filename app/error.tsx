"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Página de erro do App Router.
 * Mostra mensagem amigável — sem stack trace nem detalhes internos
 * (evita o finding "App crash may disclose error info").
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log só no servidor/console do browser em dev; nada sensível na UI
    console.error("App error:", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Algo deu errado</h1>
      <p className="max-w-md text-gray-600">
        Não foi possível carregar esta página. Tente novamente ou volte ao
        início.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
        >
          Tentar de novo
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Ir para o início
        </Link>
      </div>
    </div>
  );
}
