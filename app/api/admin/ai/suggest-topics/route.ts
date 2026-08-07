import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { suggestTopicsWithClaude } from "@/lib/ai/claude";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const seed =
      typeof body.seed === "string" ? body.seed.trim() : undefined;
    const category =
      typeof body.category === "string" ? body.category.trim() : undefined;

    const topics = await suggestTopicsWithClaude({ seed, category });

    return NextResponse.json({ topics });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao sugerir temas";
    console.error("[ai/suggest-topics]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
