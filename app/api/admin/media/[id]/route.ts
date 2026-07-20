import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePublicSite } from "@/lib/revalidate-public";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: oldData, error: fetchError } = await supabaseAdmin
      .from("media")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !oldData) {
      return NextResponse.json(
        { error: "Mídia não encontrada" },
        { status: 404 }
      );
    }

    // Tenta apagar do Blob (não bloqueia se falhar)
    if (process.env.BLOB_READ_WRITE_TOKEN && oldData.url) {
      try {
        await del(oldData.url, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (blobError) {
        console.error("Erro ao apagar blob:", blobError);
      }
    }

    const { error } = await supabaseAdmin.from("media").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "DELETE",
      table_name: "media",
      record_id: id,
      old_data: oldData,
    });

    revalidatePublicSite();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir mídia" },
      { status: 500 }
    );
  }
}
