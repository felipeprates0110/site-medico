import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST público: leitor envia dúvida/comentário.
 * Entra como "pending" e só aparece no artigo depois da moderação.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: se bots preencherem este campo oculto, ignoramos o envio
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const articleId = typeof body.articleId === "string" ? body.articleId.trim() : "";
    const authorName =
      typeof body.authorName === "string" ? body.authorName.trim() : "";
    const authorEmail =
      typeof body.authorEmail === "string" ? body.authorEmail.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!articleId) {
      return NextResponse.json(
        { error: "Artigo inválido." },
        { status: 400 }
      );
    }

    if (authorName.length < 2 || authorName.length > 80) {
      return NextResponse.json(
        { error: "Informe um nome válido (2 a 80 caracteres)." },
        { status: 400 }
      );
    }

    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        { error: "A mensagem deve ter entre 10 e 2000 caracteres." },
        { status: 400 }
      );
    }

    if (authorEmail && !EMAIL_REGEX.test(authorEmail)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      );
    }

    // Garante que o artigo existe e está publicado
    const { data: article, error: articleError } = await supabaseAdmin
      .from("blog_articles")
      .select("id")
      .eq("id", articleId)
      .eq("status", "published")
      .maybeSingle();

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 });
    }

    if (!article) {
      return NextResponse.json(
        { error: "Artigo não encontrado." },
        { status: 404 }
      );
    }

    const { error } = await supabaseAdmin.from("blog_comments").insert([
      {
        article_id: articleId,
        author_name: authorName,
        author_email: authorEmail || null,
        content,
        status: "pending",
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message:
        "Recebemos sua mensagem! Ela será publicada após revisão.",
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível enviar o comentário." },
      { status: 500 }
    );
  }
}
