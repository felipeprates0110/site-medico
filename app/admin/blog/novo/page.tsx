"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, ListOrdered, CalendarClock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AffiliateOfferControl } from "@/components/admin/affiliate-offer-control";
import type { AffiliateDisplayMode } from "@/lib/affiliate-offers";

export default function NovoArtigoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    status: "draft",
    seo_title: "",
    seo_description: "",
    affiliate_display: "auto" as AffiliateDisplayMode,
    affiliate_offer_id: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const saveWithStatus = async (
    status: string,
    extra?: { scheduled_at?: string }
  ) => {
    if (status === "ready" && !formData.category_id) {
      toast.error("Escolha uma categoria para colocar o artigo na fila.");
      return;
    }
    if (
      formData.affiliate_display === "offer" &&
      !formData.affiliate_offer_id
    ) {
      toast.error("Selecione a oferta específica ou mude para Automático.");
      return;
    }
    if (status === "scheduled" && !extra?.scheduled_at && !scheduledLocal) {
      toast.error("Escolha a data e hora do agendamento.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        affiliate_offer_id:
          formData.affiliate_display === "offer"
            ? formData.affiliate_offer_id
            : null,
        status,
        scheduled_at:
          status === "scheduled"
            ? extra?.scheduled_at || scheduledLocal
            : undefined,
      };

      const response = await fetch("/api/admin/blog/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar artigo");
      }

      const messages: Record<string, string> = {
        draft: "Rascunho salvo!",
        ready: "Artigo na fila do calendário!",
        scheduled: "Artigo agendado!",
        published: "Artigo publicado!",
      };
      toast.success(messages[status] || "Artigo salvo com sucesso!");
      router.push("/admin/blog");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar artigo";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
      status: "draft",
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
              Novo Artigo
            </h1>
            <p className="mt-1 text-gray-600">
              Escreva manualmente ou use o assistente (copiar/colar do chat Pro).
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
            onClick={() => saveWithStatus("draft")}
            disabled={loading}
            title="Salva o artigo como rascunho (ainda não entra na fila nem publica)"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            Salvar rascunho
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveWithStatus("ready")}
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
            onClick={() => saveWithStatus("published")}
            disabled={loading}
          >
            Publicar agora
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
                  placeholder="Ex: Palpitações no coração: Quando se preocupar?"
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
                  placeholder="Escreva o conteúdo do artigo aqui..."
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
                  Título SEO (Opcional - Padrão é o título do artigo)
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
                  placeholder="Título otimizado para o Google"
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
                  placeholder="Resumo de 150 caracteres para aparecer no Google"
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
                    // Trocar a prateleira invalida a oferta forçada antiga
                    affiliate_offer_id:
                      prev.category_id === categoryId
                        ? prev.affiliate_offer_id
                        : "",
                  }))
                }
                onCategoriesChange={setCategories}
              />

              <AffiliateOfferControl
                categoryId={formData.category_id}
                display={formData.affiliate_display}
                offerId={formData.affiliate_offer_id}
                onDisplayChange={(mode) =>
                  setFormData((prev) => ({
                    ...prev,
                    affiliate_display: mode,
                    affiliate_offer_id:
                      mode === "offer" ? prev.affiliate_offer_id : "",
                  }))
                }
                onOfferIdChange={(offerId) =>
                  setFormData((prev) => ({
                    ...prev,
                    affiliate_offer_id: offerId,
                  }))
                }
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-amber-300 bg-white"
                  onClick={() => {
                    if (!scheduledLocal) {
                      toast.error("Escolha a data e hora acima.");
                      return;
                    }
                    saveWithStatus("scheduled", {
                      scheduled_at: scheduledLocal,
                    });
                  }}
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
                  placeholder="Breve introdução do artigo..."
                />
              </div>

              <CoverImageField
                value={formData.cover_image_url}
                altText={formData.title || "Capa do artigo"}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, cover_image_url: url }))
                }
                saveHint="Capa pronta. Clique em Salvar rascunho (ou Na fila / Publicar) para gravar no artigo."
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
