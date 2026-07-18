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
    .from("specialties")
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
    .from("specialties")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabaseAdmin
    .from("specialties")
    .update({
      title: body.title,
      slug: body.slug,
      short_description: body.short_description,
      description: body.description,
      icon: body.icon,
      benefits: body.benefits,
      common_conditions: body.common_conditions,
      display_order: body.display_order,
      is_active: body.is_active,
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
      table_name: "specialties",
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
    .from("specialties")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("specialties").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from("audit_logs").insert([
    {
      user_id: (session.user as any).id,
      action: "DELETE",
      table_name: "specialties",
      record_id: id,
      old_data: oldData,
    },
  ]);

  return NextResponse.json({ success: true });
}
