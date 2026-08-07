"use client";

import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type BlogCategoryOption = {
  id: string;
  name: string;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type CategorySelectProps = {
  id?: string;
  value: string;
  categories: BlogCategoryOption[];
  onChange: (categoryId: string) => void;
  onCategoriesChange: (categories: BlogCategoryOption[]) => void;
  hint?: string;
};

/**
 * Select de categoria + criação rápida sem sair do formulário do artigo.
 * Analogia: como escolher uma prateleira na estante e, se não existir,
 * colar uma etiqueta nova na hora.
 */
export function CategorySelect({
  id = "category",
  value,
  categories,
  onChange,
  onCategoriesChange,
  hint = "Obrigatória para entrar na fila do calendário (ex.: Cardiologia na terça).",
}: CategorySelectProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const resetCreateForm = () => {
    setName("");
    setSlug("");
    setShowCreate(false);
  };

  const handleNameChange = (nextName: string) => {
    setName(nextName);
    setSlug(slugify(nextName));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName || !trimmedSlug) {
      toast.error("Informe o nome da categoria.");
      return;
    }

    const alreadyExists = categories.some(
      (cat) =>
        cat.name.toLowerCase() === trimmedName.toLowerCase() ||
        slugify(cat.name) === trimmedSlug
    );
    if (alreadyExists) {
      toast.error("Já existe uma categoria com esse nome (ou slug parecido).");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          slug: trimmedSlug,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar categoria");
      }

      const created = (await response.json()) as BlogCategoryOption;
      const nextCategories = [...categories, created].sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR")
      );

      onCategoriesChange(nextCategories);
      onChange(created.id);
      toast.success(`Categoria "${created.name}" criada!`);
      resetCreateForm();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao criar categoria";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        Categoria *
      </label>

      <div className="flex gap-2">
        <select
          id={id}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecione uma categoria...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          title="Criar nova categoria"
          aria-label="Criar nova categoria"
          onClick={() => setShowCreate((open) => !open)}
        >
          {showCreate ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3"
        >
          <p className="text-sm font-medium text-gray-900">Nova categoria</p>
          <div className="space-y-2">
            <label htmlFor={`${id}-new-name`} className="text-xs font-medium">
              Nome *
            </label>
            <Input
              id={`${id}-new-name`}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Prevenção"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor={`${id}-new-slug`} className="text-xs font-medium">
              Slug (URL amigável) *
            </label>
            <Input
              id={`${id}-new-slug`}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: prevencao"
              required
            />
            <p className="text-xs text-gray-500">
              Gerado automaticamente a partir do nome — você pode ajustar.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetCreateForm}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? (
                <div className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" />
              )}
              Criar e selecionar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
