"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ExternalLink } from "lucide-react";
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

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  category: { name: string } | null;
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
      const response = await fetch("/api/admin/blog/articles");
      if (!response.ok) throw new Error("Falha ao carregar artigos");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      toast.error("Erro ao carregar artigos");
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
    } catch (error) {
      toast.error("Erro ao excluir artigo");
    }
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artigos do Blog</h1>
          <p className="text-gray-600">Gerencie as publicações do RitmoBlog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Artigo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Artigos</CardTitle>
            <div className="relative w-72">
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
                        {new Date(article.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={article.status === "published" ? "success" : "secondary"}>
                          {article.status === "published" ? "Publicado" : "Rascunho"}
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
