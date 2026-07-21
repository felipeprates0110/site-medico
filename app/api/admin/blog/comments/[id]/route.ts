import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

type RouteParams = { params: Promise<{ id: string }> };

const ALLOWED_STATUS = new Set(["pending", "approved", "rejected"]);

/**
 * PUT admin: aprovar/rejeitar e/ou responder o comentário.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.status !== undefined) {
    if (!ALLOWED_STATUS.has(body.status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (body.doctorReply !== undefined) {
    const reply =
      typeof body.doctorReply === "string" ? body.doctorReply.trim() : "";

    if (reply.length > 5000) {
      return NextResponse.json(
        { error: "Resposta muito longa (máx. 5000 caracteres)." },
        { status: 400 }
      );
    }

    updates.doctor_reply = reply || null;
    updates.replied_at = reply ? new Date().toISOString() : null;

    // Se o médico responde, aprovamos automaticamente (fica visível no artigo)
    if (reply && body.status === undefined) {
      updates.status = "approved";
    }
  }

  const { data, error } = await supabaseAdmin
    .from("blog_comments")
    .update(updates)
    .eq("id", id)
    .select(
      `
      *,
      article:blog_articles(id, title, slug)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePublicSite();

  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("blog_comments")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePublicSite();

  return NextResponse.json({ success: true });
}
