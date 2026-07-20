import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const { data: oldData } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .eq("id", id)
      .single();

    if (body.is_primary) {
      await supabaseAdmin
        .from("addresses")
        .update({ is_primary: false })
        .neq("id", id);
    }

    const { data, error } = await supabaseAdmin
      .from("addresses")
      .update({
        clinic_name: body.clinic_name,
        street: body.street,
        neighborhood: body.neighborhood,
        city: body.city,
        state: body.state,
        zip: body.zip,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        is_primary: body.is_primary ?? false,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "UPDATE",
      table_name: "addresses",
      record_id: id,
      old_data: oldData,
      new_data: data,
    });

    revalidatePublicSite();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar endereço" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: oldData } = await supabaseAdmin
      .from("addresses")
      .select("*")
      .eq("id", id)
      .single();

    const { error } = await supabaseAdmin
      .from("addresses")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "DELETE",
      table_name: "addresses",
      record_id: id,
      old_data: oldData,
    });

    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir endereço" },
      { status: 500 }
    );
  }
}
