"use client";

import { useState } from "react";
import { Sparkles, Lightbulb, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export type AiGeneratedFields = {
  title: string;
  slug: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  content: string;
  category_hint: string;
  cover_image_description?: string;
  cover_image_alt?: string;
};

type TopicItem = {
  title: string;
  keyword: string;
  angle: string;
  categoryHint?: string;
};

type AiArticlePanelProps = {
  categories: { id: string; name: string }[];
  onApply: (fields: AiGeneratedFields, categoryId?: string) => void;
};

function matchCategoryId(
  hint: string | undefined,
  categories: { id: string; name: string }[]
): string | undefined {
  if (!hint) return undefined;
  const normalized = hint.toLowerCase().trim();
  const exact = categories.find((c) => c.name.toLowerCase() === normalized);
  if (exact) return exact.id;
  const partial = categories.find(
    (c) =>
      c.name.toLowerCase().includes(normalized) ||
      normalized.includes(c.name.toLowerCase())
  );
  return partial?.id;
}

export function AiArticlePanel({ categories, onApply }: AiArticlePanelProps) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [categoryHint, setCategoryHint] = useState("");
  const [referenceUrlsText, setReferenceUrlsText] = useState("");
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [coverHint, setCoverHint] = useState<{
    description: string;
    alt: string;
  } | null>(null);

  const busy = suggesting || generating;

  const parseReferenceUrls = () =>
    referenceUrlsText
      .split(/\n|,/)
      .map((u) => u.trim())
      .filter(Boolean);

  const handleSuggestTopics = async () => {
    setSuggesting(true);
    setTopics([]);
    try {
      const res = await fetch("/api/admin/ai/suggest-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seed: topic || keyword || undefined,
          category: categoryHint || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao sugerir temas");
      setTopics(data.topics || []);
      toast.success("Temas sugeridos! Clique em um para usar.");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao sugerir temas";
      toast.error(message);
    } finally {
      setSuggesting(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Informe o tema do artigo (ou escolha uma sugestão).");
      return;
    }

    setGenerating(true);
    setCoverHint(null);
    try {
      const res = await fetch("/api/admin/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keyword: keyword.trim() || undefined,
          categoryHint: categoryHint.trim() || undefined,
          referenceUrls: parseReferenceUrls(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao gerar artigo");

      const categoryId = matchCategoryId(
        data.category_hint || categoryHint,
        categories
      );

      onApply(
        {
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
          content: data.content || "",
          category_hint: data.category_hint || "",
          cover_image_description: data.cover_image_description,
          cover_image_alt: data.cover_image_alt,
        },
        categoryId
      );

      if (data.cover_hint?.description || data.cover_image_description) {
        setCoverHint({
          description:
            data.cover_hint?.description || data.cover_image_description || "",
          alt: data.cover_hint?.alt || data.cover_image_alt || "",
        });
      }

      toast.success(
        "Artigo gerado! Revise o texto e salve como rascunho quando quiser."
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao gerar artigo";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary-200 bg-primary-50/40 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary-900">
            Máquina de artigos (IA)
          </p>
          <p className="text-xs text-gray-600">
            Opcional — a escrita manual abaixo continua igual.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="border-primary-200 text-primary-800 hover:bg-white"
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          Gerar com IA
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary-200 bg-primary-50/40">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary-700" />
            Máquina de artigos (IA)
          </CardTitle>
          <p className="mt-1 text-sm text-gray-600">
            Opcional: sugere temas e preenche o formulário. Você revisa e
            publica. A escrita manual continua disponível abaixo.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          disabled={busy}
          aria-label="Fechar painel de IA"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="ai-topic">
              Tema
            </label>
            <Input
              id="ai-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Fibrilação atrial — o que é e quando procurar"
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="ai-keyword">
              Palavra-chave
            </label>
            <Input
              id="ai-keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ex: fibrilação atrial"
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="ai-category">
              Categoria sugerida
            </label>
            <Input
              id="ai-category"
              value={categoryHint}
              onChange={(e) => setCategoryHint(e.target.value)}
              placeholder="Ex: Arritmias"
              list="ai-category-hints"
              disabled={busy}
            />
            <datalist id="ai-category-hints">
              {categories.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
              <option value="Arritmias" />
              <option value="Cardiologia" />
              <option value="Prevenção" />
              <option value="Hipertensão" />
            </datalist>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="ai-refs">
              Links de referência (1 por linha)
            </label>
            <Textarea
              id="ai-refs"
              rows={3}
              value={referenceUrlsText}
              onChange={(e) => setReferenceUrlsText(e.target.value)}
              placeholder="https://..."
              disabled={busy}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSuggestTopics}
            disabled={busy}
          >
            {suggesting ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4 mr-1.5" />
            )}
            Sugerir temas
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleGenerate}
            disabled={busy}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1.5" />
            )}
            {generating ? "Gerando artigo…" : "Gerar artigo"}
          </Button>
        </div>

        {generating && (
          <p className="text-xs text-gray-600">
            A IA está escrevendo o artigo (~1–2 min). Não feche a página.
          </p>
        )}

        {topics.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Sugestões — clique para usar</p>
            <ul className="space-y-2">
              {topics.map((t) => (
                <li key={`${t.title}-${t.keyword}`}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setTopic(t.title);
                      setKeyword(t.keyword);
                      if (t.categoryHint) setCategoryHint(t.categoryHint);
                    }}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-left text-sm hover:border-primary-300 hover:bg-primary-50/50 disabled:opacity-50"
                  >
                    <span className="font-medium text-gray-900">{t.title}</span>
                    <span className="mt-0.5 block text-xs text-gray-600">
                      {t.angle}
                      {t.keyword ? ` · keyword: ${t.keyword}` : ""}
                      {t.categoryHint ? ` · ${t.categoryHint}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {coverHint && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            <p className="font-medium">Sugestão de imagem de capa</p>
            <p className="mt-1">{coverHint.description}</p>
            {coverHint.alt && (
              <p className="mt-1 text-xs text-amber-900">
                Alt sugerido: {coverHint.alt}
              </p>
            )}
            <p className="mt-1 text-xs">
              Busque a imagem e cole a URL no campo de capa — a IA não inventa
              URL.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
