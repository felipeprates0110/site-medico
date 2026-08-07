"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { DEFAULT_DOCTOR_PHOTO } from "@/lib/doctor-photo";

export interface ArticlePreviewData {
  title: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  categoryName?: string;
}

interface ArticlePreviewProps {
  open: boolean;
  onClose: () => void;
  article: ArticlePreviewData;
}

/**
 * Mostra como o artigo deve aparecer no blog público.
 * Analogia: é o "provador" da loja — você vê a peça vestida antes de publicar.
 */
export function ArticlePreview({ open, onClose, article }: ArticlePreviewProps) {
  if (!open) return null;

  const title = article.title.trim() || "Título do artigo";
  const hasContent = Boolean(article.content.trim());

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/50">
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Pré-visualização do artigo
          </p>
          <p className="text-xs text-gray-500">
            Visualização aproximada da página pública do blog
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          <X className="mr-2 h-4 w-4" />
          Fechar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <main className="w-full py-10 md:py-14">
          <article className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mb-10 text-center md:text-left">
              {article.categoryName && (
                <span className="mb-6 inline-block rounded-lg bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700">
                  {article.categoryName}
                </span>
              )}

              <h1 className="mb-6 text-4xl font-bold tracking-tight leading-tight text-gray-900 md:text-5xl">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-500 md:justify-start">
                <time>
                  Atualizado em {new Date().toLocaleDateString("pt-BR")}
                </time>
                <span className="hidden text-gray-300 sm:inline">|</span>
                <span className="flex items-center gap-1.5 text-primary-700">
                  Conteúdo verificado por especialista
                </span>
              </div>
            </div>

            {article.cover_image_url && (
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.cover_image_url}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <AuthorBox
              name="Dr. Pedro Felipe"
              role="Cardiologista e Arritmologista"
              crm="CRM DF 18951"
              bio="Especialista dedicado a traduzir a medicina complexa em prevenção prática para o dia a dia."
              photoUrl={DEFAULT_DOCTOR_PHOTO}
            />

            {hasContent ? (
              <div
                className="prose prose-lg prose-slate mt-10 max-w-none space-y-8 text-lg leading-loose text-gray-700 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 prose-a:text-primary-700 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p className="mt-10 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                Ainda não há conteúdo para pré-visualizar. Escreva o artigo e
                abra a prévia de novo.
              </p>
            )}

            {article.excerpt && (
              <p className="mt-10 rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Resumo (card): </span>
                {article.excerpt}
              </p>
            )}
          </article>
        </main>
      </div>
    </div>
  );
}
