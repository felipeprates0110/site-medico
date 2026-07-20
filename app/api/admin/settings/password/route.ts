import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { compare, hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Preencha a senha atual e a nova senha" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve ter pelo menos 8 caracteres" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, password_hash")
      .eq("id", session.user.id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const passwordMatch = await compare(currentPassword, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(newPassword, 12);

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", session.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    await supabaseAdmin.from("audit_logs").insert({
      user_id: session.user.id,
      action: "UPDATE",
      table_name: "users",
      record_id: session.user.id,
      new_data: { password_changed: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao alterar senha" },
      { status: 500 }
    );
  }
}
