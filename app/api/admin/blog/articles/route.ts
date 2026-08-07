import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import {
  brazilLocalToIso,
  isValidArticleStatus,
} from "@/lib/blog-calendar";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .select(`
        *,
        category:blog_categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
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
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Título, slug e conteúdo são obrigatórios" },
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

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .insert([
        {
          title,
          slug,
          content,
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
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
