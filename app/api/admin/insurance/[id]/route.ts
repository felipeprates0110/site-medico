import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("insurance_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();

  const { data: oldData } = await supabaseAdmin
    .from("insurance_plans")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabaseAdmin
    .from("insurance_plans")
    .update({
      name: body.name,
      category: body.category,
      is_active: body.is_active,
      display_order: body.display_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from("audit_logs").insert([
    {
      user_id: (session.user as any).id,
      action: "UPDATE",
      table_name: "insurance_plans",
      record_id: id,
      old_data: oldData,
      new_data: data,
    },
  ]);

  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: oldData } = await supabaseAdmin
    .from("insurance_plans")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin
    .from("insurance_plans")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from("audit_logs").insert([
    {
      user_id: (session.user as any).id,
      action: "DELETE",
      table_name: "insurance_plans",
      record_id: id,
      old_data: oldData,
    },
  ]);

  return NextResponse.json({ success: true });
}
