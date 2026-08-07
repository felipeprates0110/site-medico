"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ExternalLink, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  STATUS_LABEL,
  type ArticleStatus,
  formatBrazilDateTimeLabel,
} from "@/lib/blog-calendar";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus | string;
  created_at: string;
  scheduled_at?: string | null;
  category: { name: string } | null;
}

function statusBadgeVariant(
  status: string
): "success" | "secondary" | "warning" | "default" {
  if (status === "published") return "success";
  if (status === "ready") return "default";
  if (status === "scheduled") return "warning";
  return "secondary";
}

function statusLabel(status: string) {
  return STATUS_LABEL[status as ArticleStatus] ?? status;
}

export default function BlogArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // credentials: "include" garante que o cookie da sessão (login) vá junto na API
      const response = await fetch("/api/admin/blog/articles", {
        credentials: "include",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : `Falha ao carregar artigos (${response.status})`;
        throw new Error(apiError);
      }

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API de artigos");
      }

      setArticles(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar artigos";
      // 401 = sessão expirada (como um crachá vencido no prédio)
      if (message.toLowerCase().includes("não autorizado") || message.includes("401")) {
        toast.error("Sessão expirada. Faça login novamente.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;

    try {
      const response = await fetch(`/api/admin/blog/articles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir");

      setArticles(articles.filter((a) => a.id !== id));
      toast.success("Artigo excluído com sucesso");
    } catch {
      toast.error("Erro ao excluir artigo");
    }
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artigos do Blog</h1>
          <p className="text-gray-600">
            Gerencie as publicações do RitmoBlog. Use &quot;Na fila&quot; para o
            calendário automático.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/blog/calendario">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendário
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/blog/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Artigo
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>Lista de Artigos</CardTitle>
            <div className="relative w-72 max-w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar artigo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                      Nenhum artigo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell className="text-gray-600">
                        {article.category?.name || "Sem categoria"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {article.status === "scheduled" && article.scheduled_at ? (
                          <span title="Agendado para">
                            {formatBrazilDateTimeLabel(article.scheduled_at)}
                          </span>
                        ) : (
                          new Date(article.created_at).toLocaleDateString("pt-BR")
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(article.status)}>
                          {statusLabel(article.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {article.status === "published" && (
                            <Button variant="ghost" size="icon" asChild title="Ver no site">
                              <Link href={`/blog/${article.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild title="Editar">
                            <Link href={`/admin/blog/${article.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(article.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
