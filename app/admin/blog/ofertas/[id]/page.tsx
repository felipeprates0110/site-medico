"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AffiliateProductsFields,
  ProductFormRow,
  productsFromApi,
  productsToPayload,
} from "@/components/admin/affiliate-products-fields";

interface CategoryOption {
  id: string;
  name: string;
}

export default function EditarOfertaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    weight: "1",
    sort_order: "0",
    is_active: true,
  });
  const [products, setProducts] = useState<ProductFormRow[]>([
    { label: "", url: "", image_url: "", sort_order: "0" },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const [catsRes, offerRes] = await Promise.all([
          fetch("/api/admin/blog/categories"),
          fetch(`/api/admin/blog/affiliate-offers/${resolvedParams.id}`),
        ]);

        if (!catsRes.ok) throw new Error("Falha ao carregar categorias");
        if (!offerRes.ok) throw new Error("Falha ao carregar oferta");

        const cats = await catsRes.json();
        const offer = await offerRes.json();

        setCategories(cats);
        setFormData({
          category_id: offer.category_id || "",
          title: offer.title || "",
          description: offer.description || "",
          weight: String(offer.weight ?? 1),
          sort_order: String(offer.sort_order ?? 0),
          is_active: offer.is_active !== false,
        });
        setProducts(
          productsFromApi(offer.products, {
            label: offer.button_text,
            url: offer.url,
          })
        );
      } catch {
        toast.error("Erro ao carregar dados da oferta");
        router.push("/admin/blog/ofertas");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [resolvedParams.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/blog/affiliate-offers/${resolvedParams.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            weight: Number(formData.weight),
            sort_order: Number(formData.sort_order),
            products: productsToPayload(products),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao atualizar oferta");
      }

      toast.success("Oferta atualizada com sucesso!");
      router.push("/admin/blog/ofertas");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar oferta");
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/blog/ofertas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Oferta</h1>
          <p className="text-gray-600">
            Ajuste produtos, fotos (URL do fabricante) e links afiliados.
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
              />
            </div>

            <AffiliateProductsFields products={products} onChange={setProducts} />

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
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
