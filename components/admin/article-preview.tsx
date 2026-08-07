"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthorBox } from "@/components/blog/AuthorBox";
import {
  DEFAULT_DOCTOR_PHOTO,
  resolveDoctorPhoto,
} from "@/lib/doctor-photo";

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

/** Dados do perfil que o AuthorBox precisa mostrar (mesma fonte do blog público). */
interface AuthorProfile {
  doctor_name: string | null;
  doctor_crm: string | null;
  doctor_rqe: string[] | null;
  specialty: string | null;
  subspecialty: string | null;
  bio: string | null;
  bio_short: string | null;
  profile_photo_url: string | null;
}

const FALLBACK_BIO =
  "Especialista dedicado a traduzir a medicina complexa em prevenção prática para o dia a dia.";

function formatCrm(crm: string | null | undefined, rqe: string[] | null | undefined) {
  const raw = (crm || "").trim();
  // O perfil já pode salvar "CRM DF 18951" — evitamos "CRM CRM..."
  const crmLabel = !raw
    ? "CRM"
    : raw.toUpperCase().startsWith("CRM")
      ? raw
      : `CRM ${raw}`;

  if (rqe?.length) {
    return `${crmLabel} / RQE ${rqe[0]}`;
  }
  return crmLabel;
}

function formatRole(
  specialty: string | null | undefined,
  subspecialty: string | null | undefined
) {
  const main = (specialty || "Cardiologista").trim();
  const sub = (subspecialty || "").trim();
  return sub ? `${main} e ${sub}` : main;
}

/**
 * Mostra como o artigo deve aparecer no blog público.
 * Analogia: é o "provador" da loja — você vê a peça vestida antes de publicar.
 * Nome, CRM, bio e foto vêm do perfil do admin (Informações Pessoais).
 */
export function ArticlePreview({ open, onClose, article }: ArticlePreviewProps) {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/admin/profile");
        if (!response.ok) return;
        const data = (await response.json()) as AuthorProfile;
        if (!cancelled) setProfile(data);
      } catch (error) {
        console.error("Erro ao carregar perfil na prévia:", error);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const title = article.title.trim() || "Título do artigo";
  const hasContent = Boolean(article.content.trim());

  const doctorName = profile?.doctor_name?.trim() || "Dr. Pedro Felipe";
  const role = formatRole(profile?.specialty, profile?.subspecialty);
  const crm = formatCrm(profile?.doctor_crm, profile?.doctor_rqe);
  // Preferimos a bio curta do perfil; a bio longa (currículo) não cabe no card.
  const bio = profile?.bio_short?.trim() || FALLBACK_BIO;
  const photoUrl = resolveDoctorPhoto(
    profile?.profile_photo_url || DEFAULT_DOCTOR_PHOTO
  );

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
              name={doctorName}
              role={role}
              crm={crm}
              bio={bio}
              photoUrl={photoUrl}
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
