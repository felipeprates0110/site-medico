import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import {
  brazilLocalToIso,
  isValidArticleStatus,
} from "@/lib/blog-calendar";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .select("*")
      .eq("id", resolvedParams.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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
    } = body;

    if (status && !isValidArticleStatus(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    if (status === "ready" && !category_id) {
      return NextResponse.json(
        {
          error:
            "Para colocar na fila, escolha uma categoria (o calendário precisa saber a prateleira).",
        },
        { status: 400 }
      );
    }

    if (status === "scheduled" && !scheduled_at) {
      return NextResponse.json(
        { error: "Informe a data/hora de agendamento." },
        { status: 400 }
      );
    }

    const { data: currentArticle } = await supabaseAdmin
      .from("blog_articles")
      .select("status, published_at")
      .eq("id", resolvedParams.id)
      .single();

    let published_at = currentArticle?.published_at ?? null;
    if (status === "published" && currentArticle?.status !== "published") {
      published_at = new Date().toISOString();
    }
    if (status && status !== "published") {
      // Ao voltar para rascunho/fila/agendado, não apaga published_at se já existia —
      // só limpa se nunca foi publicado ou se for rebaixado antes da 1ª publicação.
      if (currentArticle?.status !== "published") {
        published_at = null;
      }
    }

    let scheduledAtIso: string | null = null;
    if (status === "scheduled") {
      const raw = scheduled_at as string;
      scheduledAtIso =
        raw.includes("T") && !raw.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(raw)
          ? brazilLocalToIso(raw)
          : new Date(raw).toISOString();

      if (!scheduledAtIso || Number.isNaN(new Date(scheduledAtIso).getTime())) {
        return NextResponse.json(
          { error: "Data de agendamento inválida." },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .update({
        title,
        slug,
        content,
        excerpt,
        cover_image_url,
        category_id: category_id || null,
        status,
        published_at,
        scheduled_at: status === "scheduled" ? scheduledAtIso : null,
        seo_title,
        seo_description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    if (status === "published") {
      revalidatePublicSite();
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("blog_articles")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) throw error;

    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
