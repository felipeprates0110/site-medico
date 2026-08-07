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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("affiliate_offers")
      .select(
        `
        *,
        category:blog_categories(id, name, slug)
      `
      )
      .eq("id", resolvedParams.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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
      .update({
        category_id,
        title: String(title).trim(),
        description: String(description).trim(),
        products,
        button_text: first.label,
        url: first.url,
        weight: parsedWeight,
        is_active: is_active !== false,
        sort_order: parseSortOrder(sort_order ?? 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", resolvedParams.id)
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("affiliate_offers")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) throw error;

    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
