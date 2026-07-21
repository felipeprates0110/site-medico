"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  MessageSquareText,
  Search,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type CommentStatus = "pending" | "approved" | "rejected";

interface BlogCommentAdmin {
  id: string;
  article_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  status: CommentStatus;
  doctor_reply: string | null;
  replied_at: string | null;
  created_at: string;
  article: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

const STATUS_LABEL: Record<CommentStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const STATUS_BADGE: Record<
  CommentStatus,
  "warning" | "success" | "destructive"
> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

export default function BlogCommentsAdminPage() {
  const [comments, setComments] = useState<BlogCommentAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CommentStatus>(
    "all"
  );
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/admin/blog/comments");
      if (!response.ok) throw new Error("Falha ao carregar comentários");
      const data = await response.json();
      setComments(data);
      const drafts: Record<string, string> = {};
      for (const comment of data as BlogCommentAdmin[]) {
        drafts[comment.id] = comment.doctor_reply || "";
      }
      setReplyDrafts(drafts);
    } catch {
      toast.error("Erro ao carregar comentários");
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (
    id: string,
    payload: { status?: CommentStatus; doctorReply?: string }
  ) => {
    setSavingId(id);
    try {
      const response = await fetch(`/api/admin/blog/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao atualizar");
      }

      const updated = await response.json();
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setReplyDrafts((prev) => ({
        ...prev,
        [id]: updated.doctor_reply || "",
      }));
      toast.success("Comentário atualizado");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar comentário"
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) return;

    try {
      const response = await fetch(`/api/admin/blog/comments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir");

      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comentário excluído");
    } catch {
      toast.error("Erro ao excluir comentário");
    }
  };

  const filteredComments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return comments.filter((c) => {
      const matchesStatus =
        statusFilter === "all" ? true : c.status === statusFilter;
      const matchesSearch =
        !term ||
        c.author_name.toLowerCase().includes(term) ||
        c.content.toLowerCase().includes(term) ||
        (c.article?.title || "").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [comments, searchTerm, statusFilter]);

  const pendingCount = comments.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Comentários do Blog
        </h1>
        <p className="text-gray-600">
          Modere dúvidas dos leitores e responda como médico.{" "}
          {pendingCount > 0 && (
            <span className="font-medium text-amber-700">
              {pendingCount} pendente{pendingCount > 1 ? "s" : ""}.
            </span>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary-600" />
              Lista de comentários
            </CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | CommentStatus)
                }
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por autor, texto ou artigo..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
            </div>
          ) : filteredComments.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Nenhum comentário encontrado.
            </p>
          ) : (
            <div className="space-y-6">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {comment.author_name}
                        </span>
                        <Badge variant={STATUS_BADGE[comment.status]}>
                          {STATUS_LABEL[comment.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString("pt-BR")}
                        {comment.author_email
                          ? ` · ${comment.author_email}`
                          : ""}
                      </p>
                      {comment.article && (
                        <Link
                          href={`/blog/${comment.article.slug}`}
                          target="_blank"
                          className="mt-1 inline-flex items-center gap-1 text-sm text-primary-700 hover:underline"
                        >
                          {comment.article.title}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {comment.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-700"
                          disabled={savingId === comment.id}
                          onClick={() =>
                            updateComment(comment.id, { status: "approved" })
                          }
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Aprovar
                        </Button>
                      )}
                      {comment.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-700"
                          disabled={savingId === comment.id}
                          onClick={() =>
                            updateComment(comment.id, { status: "rejected" })
                          }
                        >
                          <X className="mr-1 h-4 w-4" />
                          Rejeitar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="mb-4 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-800">
                    {comment.content}
                  </p>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Sua resposta (visível no artigo)
                    </label>
                    <Textarea
                      rows={3}
                      value={replyDrafts[comment.id] ?? ""}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      placeholder="Escreva a resposta educativa ao leitor..."
                      className="mb-2"
                    />
                    <Button
                      size="sm"
                      disabled={savingId === comment.id}
                      onClick={() =>
                        updateComment(comment.id, {
                          doctorReply: replyDrafts[comment.id] ?? "",
                        })
                      }
                    >
                      {savingId === comment.id
                        ? "Salvando..."
                        : "Salvar resposta"}
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">
                      Ao salvar uma resposta, o comentário é aprovado
                      automaticamente e aparece no artigo.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
