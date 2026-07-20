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
    .from("insurance_plans")
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
    .from("insurance_plans")
    .insert([
      {
        name: body.name,
        category: body.category,
        is_active: body.is_active ?? true,
        display_order: body.display_order || 0,
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
      table_name: "insurance_plans",
      record_id: data.id,
      new_data: data,
    },
  ]);

  revalidatePublicSite();

  return NextResponse.json(data);
}
