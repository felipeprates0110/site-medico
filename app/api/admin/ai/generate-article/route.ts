import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeArticleWithClaude } from "@/lib/ai/claude";
import {
  fetchReferenceSnippets,
  formatReferencesForPrompt,
} from "@/lib/ai/fetch-references";
import { buildOutlineWithGemini } from "@/lib/ai/gemini";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const keyword =
      typeof body.keyword === "string" ? body.keyword.trim() : undefined;
    const categoryHint =
      typeof body.categoryHint === "string"
        ? body.categoryHint.trim()
        : undefined;
    const referenceUrls = Array.isArray(body.referenceUrls)
      ? body.referenceUrls.filter((u: unknown) => typeof u === "string")
      : [];

    if (!topic) {
      return NextResponse.json(
        { error: "Informe o tema do artigo." },
        { status: 400 }
      );
    }

    const refs = await fetchReferenceSnippets(referenceUrls);
    const referencesText = formatReferencesForPrompt(refs);

    const outline = await buildOutlineWithGemini({
      topic,
      keyword,
      categoryHint,
      referencesText,
    });

    const article = await writeArticleWithClaude({
      topic,
      keyword,
      categoryHint,
      outline,
      referencesText,
    });

    return NextResponse.json({
      ...article,
      cover_hint: {
        description: article.cover_image_description,
        alt: article.cover_image_alt,
      },
      references_used: refs.map((r) => ({
        url: r.url,
        ok: Boolean(r.text) && !r.error,
      })),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao gerar artigo";
    console.error("[ai/generate-article]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
