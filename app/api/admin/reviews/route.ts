import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Rota pública para pacientes enviarem avaliações
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .insert([
      {
        author: body.author,
        date: new Date().toISOString().split("T")[0],
        rating: body.rating,
        comment: body.comment,
        service: body.service,
        approved: false, // Precisa de moderação
        source: "site",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
