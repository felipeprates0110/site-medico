import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import {
  brazilLocalToIso,
  isValidArticleStatus,
} from "@/lib/blog-calendar";
import { isAffiliateDisplayMode } from "@/lib/affiliate-offers";

/** Extrai mensagem útil de Error ou do erro do Supabase (objeto com .message). */
function errorMessage(error: unknown, fallback = "Erro interno"): string {
  if (error instanceof Error && error.message) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Lista do admin: só metadados (sem content/HTML).
    // Analogia: o índice da biblioteca, não o livro inteiro — evita resposta
    // gigante que estoura o limite do serverless na Vercel.
    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .select(
        `
        id,
        title,
        slug,
        status,
        created_at,
        updated_at,
        published_at,
        scheduled_at,
        category_id,
        category:blog_categories!category_id(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error: unknown) {
    console.error("[admin/blog/articles GET]", errorMessage(error));
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      cover_image_url,
      category_id,
      status,
      seo_title,
      seo_description,
      scheduled_at,
      affiliate_display,
      affiliate_offer_id,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Título, slug e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const displayMode = isAffiliateDisplayMode(affiliate_display)
      ? affiliate_display
      : "auto";

    if (displayMode === "offer" && !affiliate_offer_id) {
      return NextResponse.json(
        { error: "Selecione a oferta específica para este artigo." },
        { status: 400 }
      );
    }

    const nextStatus = status && isValidArticleStatus(status) ? status : "draft";

    if (nextStatus === "ready" && !category_id) {
      return NextResponse.json(
        {
          error:
            "Para colocar na fila, escolha uma categoria (o calendário precisa saber a prateleira).",
        },
        { status: 400 }
      );
    }

    if (nextStatus === "scheduled" && !scheduled_at) {
      return NextResponse.json(
        { error: "Informe a data/hora de agendamento." },
        { status: 400 }
      );
    }

    let scheduledAtIso: string | null = null;
    if (nextStatus === "scheduled") {
      scheduledAtIso =
        typeof scheduled_at === "string" && scheduled_at.includes("T") && !scheduled_at.endsWith("Z") && !scheduled_at.includes("+")
          ? brazilLocalToIso(scheduled_at)
          : scheduled_at
            ? new Date(scheduled_at).toISOString()
            : null;

      if (!scheduledAtIso) {
        return NextResponse.json(
          { error: "Data de agendamento inválida." },
          { status: 400 }
        );
      }
    }

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user?.email)
      .single();

    // Import dinâmico: DOMPurify só entra no ar ao criar artigo (não na listagem).
    const { sanitizeArticleHtml } = await import("@/lib/sanitize-html");
    const safeContent = sanitizeArticleHtml(String(content));

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .insert([
        {
          title,
          slug,
          content: safeContent,
          excerpt,
          cover_image_url,
          category_id: category_id || null,
          author_id: userData?.id || null,
          status: nextStatus,
          published_at:
            nextStatus === "published" ? new Date().toISOString() : null,
          scheduled_at: nextStatus === "scheduled" ? scheduledAtIso : null,
          seo_title,
          seo_description,
          affiliate_display: displayMode,
          affiliate_offer_id:
            displayMode === "offer" && affiliate_offer_id
              ? affiliate_offer_id
              : null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    if (nextStatus === "published") {
      revalidatePublicSite();
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[admin/blog/articles POST]", errorMessage(error));
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}
