"use client";

import { useEffect } from "react";

/**
 * Erro que quebra o root layout: precisa de <html> e <body> próprios.
 * Nunca mostra stack trace ou variáveis de ambiente na tela.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          color: "#111",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Algo deu errado</h1>
          <p style={{ color: "#555", marginBottom: 20 }}>
            Ocorreu um erro inesperado. Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#0f4c81",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
