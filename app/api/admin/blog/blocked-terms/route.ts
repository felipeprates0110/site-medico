import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { parseBlockedTerms } from "@/lib/blog/blocked-terms";

/**
 * GET/PUT da lista de termos proibidos dos comentários.
 * Fica em site_config para o médico editar sem precisar de deploy.
 */

async function getSiteConfigId() {
  const { data, error } = await supabaseAdmin
    .from("site_config")
    .select("id, blocked_comment_terms")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const config = await getSiteConfigId();

    if (!config) {
      return NextResponse.json(
        { error: "Configuração do site não encontrada." },
        { status: 404 }
      );
    }

    const termsText = config.blocked_comment_terms ?? "";

    return NextResponse.json({
      blocked_comment_terms: termsText,
      terms: parseBlockedTerms(termsText),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar termos proibidos.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const raw =
      typeof body.blocked_comment_terms === "string"
        ? body.blocked_comment_terms
        : "";

    if (raw.length > 20000) {
      return NextResponse.json(
        { error: "A lista de termos é grande demais (máx. 20.000 caracteres)." },
        { status: 400 }
      );
    }

    // Normaliza: uma por linha, sem vazios/duplicatas
    const terms = parseBlockedTerms(raw);
    const normalizedText = terms.join("\n");

    const config = await getSiteConfigId();

    if (!config) {
      return NextResponse.json(
        { error: "Configuração do site não encontrada." },
        { status: 404 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("site_config")
      .update({
        blocked_comment_terms: normalizedText,
        updated_by: session.user.id,
      })
      .eq("id", config.id)
      .select("id, blocked_comment_terms")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "UPDATE",
      table_name: "site_config",
      record_id: data.id,
      new_data: { blocked_comment_terms: data.blocked_comment_terms },
    });

    return NextResponse.json({
      blocked_comment_terms: data.blocked_comment_terms ?? "",
      terms: parseBlockedTerms(data.blocked_comment_terms),
      message: "Lista de termos proibidos salva.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao salvar termos proibidos.",
      },
      { status: 500 }
    );
  }
}
