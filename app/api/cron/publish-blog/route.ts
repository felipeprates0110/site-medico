import { NextResponse } from "next/server";
import { runBlogPublishCron } from "@/lib/publish-blog";

/**
 * Robô de publicação do calendário editorial.
 * Chamado pelo Vercel Cron (ou manualmente com o header Authorization).
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Em desenvolvimento, permite sem secret para testes locais
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  // Vercel Cron também pode enviar o header `x-vercel-cron` em alguns planos;
  // ainda assim exigimos o secret quando configurado.
  return false;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const result = await runBlogPublishCron();
    return NextResponse.json({
      ok: true,
      at: new Date().toISOString(),
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    console.error("[cron/publish-blog]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
