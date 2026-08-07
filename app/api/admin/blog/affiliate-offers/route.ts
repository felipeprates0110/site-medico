import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { normalizeAffiliateProducts } from "@/lib/affiliate-offers";

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
      products: rawProducts,
      weight,
      is_active,
      sort_order,
    } = body;

    if (!category_id || !title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Categoria, título e descrição são obrigatórios" },
        { status: 400 }
      );
    }

    const normalized = normalizeAffiliateProducts(rawProducts);
    if ("error" in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 });
    }

    const { products } = normalized;
    const first = products[0];

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
          products,
          // Campos legados sincronizados com o 1º produto (lista/admin antigo)
          button_text: first.label,
          url: first.url,
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
