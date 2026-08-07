"use client";

import { useState } from "react";
import { ClipboardCopy, ClipboardPaste, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { buildBlogArticlePrompt } from "@/lib/ai/prompt-template";
import { parseAiPasteResponse } from "@/lib/ai/parse-paste";

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
  const [pasteText, setPasteText] = useState("");
  const [coverHint, setCoverHint] = useState<{
    description: string;
    alt: string;
  } | null>(null);

  const referenceUrls = referenceUrlsText
    .split(/\n|,/)
    .map((u) => u.trim())
    .filter(Boolean);

  const handleCopyPrompt = async () => {
    if (!topic.trim()) {
      toast.error("Informe o tema antes de copiar o prompt.");
      return;
    }

    const prompt = buildBlogArticlePrompt({
      topic: topic.trim(),
      keyword: keyword.trim() || undefined,
      categoryHint: categoryHint.trim() || undefined,
      referenceUrls,
    });

    try {
      await navigator.clipboard.writeText(prompt);
      toast.success(
        "Prompt copiado! Cole no Claude ou Gemini Pro, gere o artigo e volte aqui."
      );
    } catch {
      toast.error(
        "Não foi possível copiar automaticamente. Selecione o texto e copie manualmente."
      );
    }
  };

  const handleApplyPaste = () => {
    if (!pasteText.trim()) {
      toast.error("Cole a resposta da IA no campo abaixo.");
      return;
    }

    try {
      const article = parseAiPasteResponse(pasteText);
      const categoryId = matchCategoryId(
        article.category_hint || categoryHint,
        categories
      );

      onApply(
        {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          seo_title: article.seo_title,
          seo_description: article.seo_description,
          content: article.content,
          category_hint: article.category_hint,
          cover_image_description: article.cover_image_description,
          cover_image_alt: article.cover_image_alt,
        },
        categoryId
      );

      if (article.cover_image_description || article.cover_image_alt) {
        setCoverHint({
          description: article.cover_image_description,
          alt: article.cover_image_alt,
        });
      } else {
        setCoverHint(null);
      }

      toast.success(
        "Campos preenchidos! Revise o texto e salve como rascunho quando quiser."
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Não consegui ler a resposta";
      toast.error(message);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary-200 bg-primary-50/40 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-primary-900">
            Assistente de artigo (copiar / colar)
          </p>
          <p className="text-xs text-gray-600">
            Use Claude ou Gemini Pro no chat — sem API paga. A escrita manual
            abaixo continua igual.
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
          Abrir assistente
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
            Assistente de artigo (copiar / colar)
          </CardTitle>
          <p className="mt-1 text-sm text-gray-600">
            1) Copie o prompt → 2) Cole no chat Pro → 3) Cole a resposta aqui →
            4) Revise e publique. Sem API.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          aria-label="Fechar assistente"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="list-decimal space-y-1 pl-5 text-xs text-gray-600">
          <li>Preencha tema (e opcionalmente keyword, categoria, links).</li>
          <li>
            Clique em <b>Copiar prompt</b> e cole no Claude ou Gemini Pro.
          </li>
          <li>
            Copie a resposta completa (com TÍTULO:, SLUG:, CONTEÚDO HTML:…) e
            cole abaixo.
          </li>
          <li>
            Clique em <b>Preencher formulário</b> e revise antes de publicar.
          </li>
        </ol>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="ai-topic">
              Tema *
            </label>
            <Input
              id="ai-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Fibrilação atrial — o que é e quando procurar"
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
              Links de referência (1 por linha, opcional)
            </label>
            <Textarea
              id="ai-refs"
              rows={2}
              value={referenceUrlsText}
              onChange={(e) => setReferenceUrlsText(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleCopyPrompt}
          className="w-full sm:w-auto"
        >
          <ClipboardCopy className="h-4 w-4 mr-1.5" />
          Copiar prompt para o chat
        </Button>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="ai-paste">
            Resposta da IA (cole aqui)
          </label>
          <Textarea
            id="ai-paste"
            rows={10}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`Cole a resposta completa, começando por:\n\nTÍTULO:\n...\n\nSLUG:\n...\n\n... até CONTEÚDO HTML:`}
            className="font-mono text-xs"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleApplyPaste}
          className="w-full sm:w-auto"
        >
          <ClipboardPaste className="h-4 w-4 mr-1.5" />
          Preencher formulário
        </Button>

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
              Busque a imagem e cole a URL no campo de capa.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
