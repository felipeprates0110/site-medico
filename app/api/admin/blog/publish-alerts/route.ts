import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unresolvedOnly = searchParams.get("unresolved") !== "0";

    let query = supabaseAdmin
      .from("blog_publish_alerts")
      .select(`
        *,
        rule:blog_publish_rules(
          id,
          weekday,
          publish_time,
          label,
          category:blog_categories(name)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (unresolvedOnly) {
      query = query.is("resolved_at", null);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Marca alerta como resolvido. Body: { id: string } ou { resolveAll: true } */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const now = new Date().toISOString();

    if (body.resolveAll) {
      const { error } = await supabaseAdmin
        .from("blog_publish_alerts")
        .update({ resolved_at: now })
        .is("resolved_at", null);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (!body.id) {
      return NextResponse.json(
        { error: "Informe o id do alerta." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("blog_publish_alerts")
      .update({ resolved_at: now })
      .eq("id", body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
