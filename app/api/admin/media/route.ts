import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("media")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar mídias" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Upload não configurado. Defina BLOB_READ_WRITE_TOKEN no ambiente.",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "other";
    const altText = (formData.get("alt_text") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo: 5MB." },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = await put(`media/${Date.now()}-${safeName}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const { data, error } = await supabaseAdmin
      .from("media")
      .insert([
        {
          type,
          url: blob.url,
          alt_text: altText || null,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "CREATE",
      table_name: "media",
      record_id: data.id,
      new_data: data,
    });

    // Se for foto de perfil, atualiza a configuração do site também
    if (type === "profile") {
      const { data: config } = await supabaseAdmin
        .from("site_config")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (config?.id) {
        await supabaseAdmin
          .from("site_config")
          .update({
            profile_photo_url: blob.url,
            updated_by: session.user.id,
          })
          .eq("id", config.id);
      }
    }

    revalidatePublicSite();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload da mídia" },
      { status: 500 }
    );
  }
}
