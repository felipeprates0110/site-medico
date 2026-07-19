"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SimpleEditor } from "@/components/admin/simple-editor";
import { use } from "react";

export default function EditarArtigoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image_url: "",
    category_id: "",
    status: "draft",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchArticle();
  }, [resolvedParams.id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  };

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/blog/articles/${resolvedParams.id}`);
      if (!response.ok) throw new Error("Falha ao carregar artigo");
      const data = await response.json();
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        content: data.content || "",
        excerpt: data.excerpt || "",
        cover_image_url: data.cover_image_url || "",
        category_id: data.category_id || "",
        status: data.status || "draft",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
      });
    } catch (error) {
      toast.error("Erro ao carregar dados do artigo");
      router.push("/admin/blog");
    } finally {
      setFetching(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title });
  };

  const handleSubmit = async (e: React.FormEvent, newStatus?: string) => {
    e.preventDefault();
    setLoading(true);

    const submitData = { ...formData };
    if (newStatus) {
      submitData.status = newStatus;
      setFormData(submitData);
    }

    try {
      const response = await fetch(`/api/admin/blog/articles/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao atualizar artigo");
      }

      toast.success("Artigo atualizado com sucesso!");
      router.push("/admin/blog");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar artigo");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Artigo</h1>
            <p className="text-gray-600">Altere o conteúdo da publicação.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {formData.status === 'draft' && (
            <Button 
              variant="outline" 
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
            >
              Salvar Rascunho
            </Button>
          )}
          <Button 
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={loading}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {formData.status === 'published' ? 'Atualizar Publicação' : 'Publicar Artigo'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título do Artigo *
                </label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Conteúdo *
                </label>
                <SimpleEditor 
                  value={formData.content}
                  onChange={(val) => setFormData({...formData, content: val})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO e Metadados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="seo_title" className="text-sm font-medium">
                  Título SEO
                </label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="seo_description" className="text-sm font-medium">
                  Descrição SEO (Meta Description)
                </label>
                <Textarea
                  id="seo_description"
                  rows={2}
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Configurações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  URL Amigável (Slug) *
                </label>
                <Input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Categoria
                </label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="excerpt" className="text-sm font-medium">
                  Resumo (Exibido nos cards)
                </label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cover_image" className="text-sm font-medium">
                  URL da Imagem de Capa
                </label>
                <div className="flex gap-2">
                  <Input
                    id="cover_image"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  />
                </div>
                {formData.cover_image_url && (
                  <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-slate-100 border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={formData.cover_image_url} 
                      alt="Preview da capa" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
