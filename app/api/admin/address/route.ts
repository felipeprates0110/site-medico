import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .order("is_primary", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar endereços" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Se este for o endereço principal, remove a flag dos demais
    if (body.is_primary) {
      await supabaseAdmin
        .from("addresses")
        .update({ is_primary: false })
        .eq("is_primary", true);
    }

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .insert([
        {
          clinic_name: body.clinic_name,
          street: body.street,
          neighborhood: body.neighborhood,
          city: body.city,
          state: body.state,
          zip: body.zip,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          is_primary: body.is_primary ?? false,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "CREATE",
      table_name: "addresses",
      record_id: data.id,
      new_data: data,
    });

    revalidatePublicSite();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar endereço" },
      { status: 500 }
    );
  }
}
