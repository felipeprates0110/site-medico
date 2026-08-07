import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

/**
 * GET/PUT do interruptor mestre das ofertas afiliadas.
 * Fica em site_config — não altera o is_active de cada oferta.
 */

async function getSiteConfigRow() {
  const { data, error } = await supabaseAdmin
    .from("site_config")
    .select("id, affiliate_offers_enabled")
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

    const config = await getSiteConfigRow();

    if (!config) {
      return NextResponse.json(
        { error: "Configuração do site não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      affiliate_offers_enabled: config.affiliate_offers_enabled === true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar o interruptor de ofertas.",
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
    const enabled = body.affiliate_offers_enabled === true;

    const config = await getSiteConfigRow();

    if (!config) {
      return NextResponse.json(
        { error: "Configuração do site não encontrada." },
        { status: 404 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("site_config")
      .update({
        affiliate_offers_enabled: enabled,
        updated_by: session.user.id,
      })
      .eq("id", config.id)
      .select("id, affiliate_offers_enabled")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "UPDATE",
      table_name: "site_config",
      record_id: data.id,
      new_data: { affiliate_offers_enabled: data.affiliate_offers_enabled },
    });

    // Atualiza a vitrine: páginas públicas precisam refletir o interruptor
    revalidatePublicSite();

    return NextResponse.json({
      affiliate_offers_enabled: data.affiliate_offers_enabled === true,
      message: enabled
        ? "Ofertas ligadas no site."
        : "Ofertas desligadas no site (cadastro intacto).",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao salvar o interruptor de ofertas.",
      },
      { status: 500 }
    );
  }
}
