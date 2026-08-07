"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ListOrdered, CalendarClock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SimpleEditor } from "@/components/admin/simple-editor";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { ArticlePreview } from "@/components/admin/article-preview";
import { DateTimePicker } from "@/components/admin/datetime-picker";
import {
  AiArticlePanel,
  type AiGeneratedFields,
} from "@/components/admin/ai-article-panel";
import { CategorySelect } from "@/components/admin/category-select";
import {
  STATUS_LABEL,
  type ArticleStatus,
  isoToBrazilLocalInput,
} from "@/lib/blog-calendar";

function formatLocalInputLabel(local: string) {
  if (!local || !local.includes("T")) return local;
  const [datePart, timePart] = local.split("T");
  const [y, m, d] = datePart.split("-");
  return `${d}/${m}/${y} às ${timePart}`;
}

export default function EditarArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [scheduledLocal, setScheduledLocal] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image_url: "",
    category_id: "",
    status: "draft" as string,
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response = await fetch(
        `/api/admin/blog/articles/${resolvedParams.id}`
      );
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
      setScheduledLocal(isoToBrazilLocalInput(data.scheduled_at));
    } catch {
      toast.error("Erro ao carregar dados do artigo");
      router.push("/admin/blog");
    } finally {
      setFetching(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({ ...prev, title }));
  };

  const handleSubmit = async (
    e: React.FormEvent,
    options?: {
      status?: string;
      /** Se true, permanece na página (ex.: Salvar alterações) */
      stay?: boolean;
    }
  ) => {
    e.preventDefault();
    const status = options?.status ?? formData.status;
    const stay = options?.stay ?? false;

    if (
      status === "draft" &&
      formData.status !== "draft" &&
      !confirm(
        formData.status === "scheduled"
          ? "Isso cancela o agendamento e volta o artigo para rascunho. Continuar?"
          : "Isso tira o artigo da fila/publicação e volta para rascunho. Continuar?"
      )
    ) {
      return;
    }

    if (status === "ready" && !formData.category_id) {
      toast.error("Escolha uma categoria para colocar o artigo na fila.");
      return;
    }
    if (status === "scheduled" && !scheduledLocal) {
      toast.error("Escolha a data e hora do agendamento.");
      return;
    }

    setLoading(true);
    const submitData = {
      ...formData,
      status,
      scheduled_at: status === "scheduled" ? scheduledLocal : undefined,
    };
    setFormData((prev) => ({ ...prev, status }));

    try {
      const response = await fetch(
        `/api/admin/blog/articles/${resolvedParams.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao atualizar artigo");
      }

      const successMessages: Record<string, string> = {
        draft: "Salvo como rascunho.",
        ready: "Artigo na fila do calendário.",
        scheduled: "Agendamento salvo.",
        published: "Artigo publicado.",
      };

      toast.success(
        stay
          ? "Alterações salvas (status mantido)."
          : successMessages[status] || "Artigo atualizado com sucesso!"
      );

      if (stay) {
        router.refresh();
      } else {
        router.push("/admin/blog");
        router.refresh();
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar artigo";
      toast.error(message);
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

  const statusKey = formData.status as ArticleStatus;
  const selectedCategoryName = categories.find(
    (cat) => cat.id === formData.category_id
  )?.name;

  const applyAiFields = (
    fields: AiGeneratedFields,
    categoryId?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      seo_title: fields.seo_title,
      seo_description: fields.seo_description,
      content: fields.content,
      category_id: categoryId || prev.category_id,
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
              Editar Artigo
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-gray-600">
              <span>Status atual:</span>
              <Badge
                variant={
                  formData.status === "published"
                    ? "success"
                    : formData.status === "ready"
                      ? "default"
                      : formData.status === "scheduled"
                        ? "warning"
                        : "secondary"
                }
              >
                {STATUS_LABEL[statusKey] ?? formData.status}
              </Badge>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-white p-2.5 shadow-sm">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            Pré-visualizar
          </Button>
          <Button
            size="sm"
            onClick={(e) =>
              handleSubmit(e, { status: formData.status, stay: true })
            }
            disabled={loading}
            title="Grava título, texto, capa e SEO sem mudar o status"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            Salvar alterações
          </Button>
          {formData.status !== "draft" && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleSubmit(e, { status: "draft" })}
              disabled={loading}
              title="Cancela agendamento/fila e volta para rascunho"
            >
              Voltar a rascunho
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleSubmit(e, { status: "ready" })}
            disabled={loading}
            title="Entra no ritmo semanal do calendário editorial"
          >
            <ListOrdered className="h-4 w-4 mr-1.5" />
            Na fila
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="sm:ml-auto"
            onClick={(e) => handleSubmit(e, { status: "published" })}
            disabled={loading}
          >
            {formData.status === "published" ? "Publicar de novo" : "Publicar agora"}
          </Button>
        </div>
      </div>

      <AiArticlePanel categories={categories} onApply={applyAiFields} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, content: val }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo_title: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo_description: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>

              <CategorySelect
                value={formData.category_id}
                categories={categories}
                onChange={(categoryId) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: categoryId,
                  }))
                }
                onCategoriesChange={setCategories}
                hint=""
              />

              <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                <div>
                  <label
                    htmlFor="scheduled_at"
                    className="text-sm font-medium text-amber-950"
                  >
                    Agendar fora do calendário
                  </label>
                  <p className="mt-1 text-xs text-amber-900/80">
                    Use só para data/hora fixa neste post. Para o ritmo semanal
                    (terça/quinta…), use <strong>Na fila</strong> no topo.
                  </p>
                </div>
                <DateTimePicker
                  id="scheduled_at"
                  value={scheduledLocal}
                  onChange={setScheduledLocal}
                  placeholder="Escolher data e hora"
                />
                {formData.status === "scheduled" && scheduledLocal && (
                  <p className="text-xs font-medium text-amber-950">
                    Agendado para: {formatLocalInputLabel(scheduledLocal)}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-amber-300 bg-white"
                  onClick={(e) => handleSubmit(e, { status: "scheduled" })}
                  disabled={loading}
                >
                  <CalendarClock className="h-4 w-4 mr-1.5" />
                  Agendar este post
                </Button>
              </div>

              <div className="space-y-2">
                <label htmlFor="excerpt" className="text-sm font-medium">
                  Resumo (Exibido nos cards)
                </label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                />
              </div>

              <CoverImageField
                value={formData.cover_image_url}
                altText={formData.title || "Capa do artigo"}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, cover_image_url: url }))
                }
                saveHint="Capa pronta. Clique em Salvar alterações para gravar no artigo."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ArticlePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        article={{
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          cover_image_url: formData.cover_image_url,
          categoryName: selectedCategoryName,
        }}
      />
    </div>
  );
}
