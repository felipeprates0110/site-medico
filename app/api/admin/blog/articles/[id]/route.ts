import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .select("*")
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
    const { title, slug, content, excerpt, cover_image_url, category_id, status, seo_title, seo_description } = body;

    // Check if status changed to published to set published_at
    const { data: currentArticle } = await supabaseAdmin
      .from("blog_articles")
      .select("status, published_at")
      .eq("id", resolvedParams.id)
      .single();

    let published_at = currentArticle?.published_at;
    if (status === 'published' && currentArticle?.status !== 'published') {
      published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .update({
        title,
        slug,
        content,
        excerpt,
        cover_image_url,
        category_id: category_id || null,
        status,
        published_at,
        seo_title,
        seo_description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", resolvedParams.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePublicSite();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("blog_articles")
      .delete()
      .eq("id", resolvedParams.id);

    if (error) throw error;

    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
