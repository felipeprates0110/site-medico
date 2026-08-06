"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, User } from "lucide-react";

type CommentRow = {
  status?: string;
};

export function AdminHeader() {
  const { data: session } = useSession();
  const [pendingComments, setPendingComments] = useState(0);

  // Busca quantos comentários do blog ainda estão pendentes (como uma
  // “caixa de entrada” esperando o médico revisar).
  const fetchPendingComments = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/blog/comments");
      if (!response.ok) return;

      const data = (await response.json()) as CommentRow[];
      if (!Array.isArray(data)) return;

      const pending = data.filter((comment) => comment.status === "pending").length;
      setPendingComments(pending);
    } catch {
      // Silencioso: o sino só some se a API falhar; o restante do painel segue normalmente.
    }
  }, []);

  useEffect(() => {
    fetchPendingComments();

    // Atualiza de tempos em tempos e quando a aba volta ao foco
    // (útil se um leitor comentou enquanto o admin estava aberto).
    const intervalId = window.setInterval(fetchPendingComments, 60_000);
    const onFocus = () => fetchPendingComments();
    // A página de comentários dispara este evento após aprovar/rejeitar/excluir.
    const onCommentsChanged = () => fetchPendingComments();

    window.addEventListener("focus", onFocus);
    window.addEventListener("admin:blog-comments-changed", onCommentsChanged);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(
        "admin:blog-comments-changed",
        onCommentsChanged
      );
    };
  }, [fetchPendingComments]);

  const hasPending = pendingComments > 0;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b bg-white px-8">
      <Link
        href="/admin/blog/comentarios"
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        title={
          hasPending
            ? `${pendingComments} comentário${pendingComments > 1 ? "s" : ""} pendente${pendingComments > 1 ? "s" : ""}`
            : "Comentários do blog"
        }
        aria-label={
          hasPending
            ? `Comentários do blog: ${pendingComments} pendente${pendingComments > 1 ? "s" : ""}`
            : "Comentários do blog"
        }
      >
        <Bell className="h-5 w-5" />
        {hasPending && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {pendingComments > 9 ? "9+" : pendingComments}
          </span>
        )}
      </Link>

      <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User className="h-4 w-4" />
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-900">{session?.user?.name}</p>
          <p className="text-xs text-gray-600 capitalize">
            {session?.user?.role}
          </p>
        </div>
      </div>
    </header>
  );
}
