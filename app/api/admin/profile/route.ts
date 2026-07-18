import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Buscar configurações do perfil
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("site_config")
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar configurações do perfil
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("site_config")
      .update({
        doctor_name: body.doctor_name,
        doctor_crm: body.doctor_crm,
        doctor_rqe: body.doctor_rqe,
        specialty: body.specialty,
        subspecialty: body.subspecialty,
        bio: body.bio,
        profile_photo_url: body.profile_photo_url,
        updated_by: session.user.id,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log de auditoria
    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "UPDATE",
      table_name: "site_config",
      record_id: data.id,
      new_data: data,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
