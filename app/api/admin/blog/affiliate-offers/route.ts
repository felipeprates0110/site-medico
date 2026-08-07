import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

function parseWeight(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return null;
  return Math.floor(n);
}

function parseSortOrder(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.floor(n);
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");

    let query = supabaseAdmin
      .from("affiliate_offers")
      .select(
        `
        *,
        category:blog_categories(id, name, slug)
      `
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      category_id,
      title,
      description,
      button_text,
      url,
      weight,
      is_active,
      sort_order,
    } = body;

    if (!category_id || !title?.trim() || !description?.trim() || !button_text?.trim() || !url?.trim()) {
      return NextResponse.json(
        { error: "Categoria, título, descrição, texto do botão e URL são obrigatórios" },
        { status: 400 }
      );
    }

    if (!isValidUrl(String(url).trim())) {
      return NextResponse.json(
        { error: "URL inválida. Use um link começando com http:// ou https://" },
        { status: 400 }
      );
    }

    const parsedWeight = parseWeight(weight ?? 1);
    if (parsedWeight === null) {
      return NextResponse.json(
        { error: "Peso deve ser um número inteiro maior ou igual a 1" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("affiliate_offers")
      .insert([
        {
          category_id,
          title: String(title).trim(),
          description: String(description).trim(),
          button_text: String(button_text).trim(),
          url: String(url).trim(),
          weight: parsedWeight,
          is_active: is_active !== false,
          sort_order: parseSortOrder(sort_order ?? 0),
        },
      ])
      .select(
        `
        *,
        category:blog_categories(id, name, slug)
      `
      )
      .single();

    if (error) throw error;

    revalidatePublicSite();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
