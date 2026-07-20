import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("specialties")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("specialties")
    .insert([
      {
        title: body.title,
        slug: body.slug,
        short_description: body.short_description,
        description: body.description,
        icon: body.icon || "heart",
        benefits: body.benefits || [],
        common_conditions: body.common_conditions || [],
        display_order: body.display_order || 0,
        is_active: body.is_active ?? true,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log de auditoria
  await supabaseAdmin.from("audit_logs").insert([
    {
      user_id: (session.user as any).id,
      action: "CREATE",
      table_name: "specialties",
      record_id: data.id,
      new_data: data,
    },
  ]);

  revalidatePublicSite();

  return NextResponse.json(data);
}
