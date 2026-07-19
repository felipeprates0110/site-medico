import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .select(`
        *,
        category:blog_categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
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
    const { title, slug, content, excerpt, cover_image_url, category_id, status, seo_title, seo_description } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Título, slug e conteúdo são obrigatórios" }, { status: 400 });
    }

    // Get the user ID from session to set as author
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user?.email)
      .single();

    const { data, error } = await supabaseAdmin
      .from("blog_articles")
      .insert([
        {
          title,
          slug,
          content,
          excerpt,
          cover_image_url,
          category_id: category_id || null,
          author_id: userData?.id || null,
          status: status || 'draft',
          published_at: status === 'published' ? new Date().toISOString() : null,
          seo_title,
          seo_description,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
