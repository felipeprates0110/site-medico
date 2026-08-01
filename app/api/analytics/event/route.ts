import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAnalyticsEventName } from "@/lib/analytics";

/**
 * Endpoint público: o navegador do visitante "bate o ponto" aqui.
 * Não exige login — mas só aceita nomes de evento conhecidos.
 */
export async function POST(request: Request) {
  try {
    let body: unknown;

    // sendBeacon pode enviar como Blob/text
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = text ? JSON.parse(text) : null;
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const {
      event_name: eventName,
      path,
      session_id: sessionId,
      referrer,
      meta,
    } = body as Record<string, unknown>;

    if (typeof eventName !== "string" || !isAnalyticsEventName(eventName)) {
      return NextResponse.json({ error: "Evento não permitido" }, { status: 400 });
    }

    const safePath =
      typeof path === "string" && path.startsWith("/")
        ? path.slice(0, 500)
        : "/";

    // Não registra painel admin / login (defesa em profundidade)
    if (
      safePath.startsWith("/admin") ||
      safePath.startsWith("/login") ||
      safePath.startsWith("/api")
    ) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const safeSession =
      typeof sessionId === "string" ? sessionId.slice(0, 80) : null;
    const safeReferrer =
      typeof referrer === "string" && referrer.length > 0
        ? referrer.slice(0, 500)
        : null;

    const safeMeta =
      meta && typeof meta === "object" && !Array.isArray(meta)
        ? Object.fromEntries(
            Object.entries(meta as Record<string, unknown>)
              .filter(([, v]) => typeof v === "string")
              .slice(0, 8)
              .map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 120)])
          )
        : {};

    const { error } = await supabaseAdmin.from("site_events").insert({
      event_name: eventName,
      path: safePath,
      session_id: safeSession,
      referrer: safeReferrer,
      meta: safeMeta,
    });

    if (error) {
      console.error("Erro ao salvar site_event:", error.message);
      return NextResponse.json({ error: "Falha ao registrar" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro na rota de analytics:", error);
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }
}
