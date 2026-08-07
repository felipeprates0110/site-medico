"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CategoryOption {
  id: string;
  name: string;
}

export default function NovaOfertaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    button_text: "",
    url: "",
    weight: "1",
    sort_order: "0",
    is_active: true,
  });

  useEffect(() => {
    fetch("/api/admin/blog/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar categorias");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch(() => toast.error("Erro ao carregar categorias"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/blog/affiliate-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          weight: Number(formData.weight),
          sort_order: Number(formData.sort_order),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar oferta");
      }

      toast.success("Oferta criada com sucesso!");
      router.push("/admin/blog/ofertas");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar oferta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog/ofertas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Oferta</h1>
          <p className="text-gray-600">
            Vincule um produto/link a uma categoria do blog.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Oferta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category_id" className="text-sm font-medium">
                Categoria *
              </label>
              <select
                id="category_id"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
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
              <label htmlFor="title" className="text-sm font-medium">
                Título *
              </label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Monitoramento Residencial Recomendado"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição *
              </label>
              <Textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Texto educativo explicando por que o produto pode ajudar..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="button_text" className="text-sm font-medium">
                Texto do botão *
              </label>
              <Input
                id="button_text"
                required
                value={formData.button_text}
                onChange={(e) =>
                  setFormData({ ...formData, button_text: e.target.value })
                }
                placeholder="Ex: Ver Monitores Aprovados na Amazon"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL do afiliado *
              </label>
              <Input
                id="url"
                type="url"
                required
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500">
                Amazon, Hotmart ou outro link completo com https://
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium">
                  Peso *
                </label>
                <Input
                  id="weight"
                  type="number"
                  min={1}
                  required
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Maior peso = aparece em mais artigos da categoria
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="sort_order" className="text-sm font-medium">
                  Ordem na lista
                </label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: e.target.value })
                  }
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Oferta ativa (visível no site)
            </label>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Oferta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
