"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface CategoryOption {
  id: string;
  name: string;
}

interface AffiliateProductRow {
  label: string;
  url: string;
  image_url?: string;
  sort_order?: number;
}

interface AffiliateOfferRow {
  id: string;
  category_id: string;
  title: string;
  description: string;
  button_text: string;
  url: string;
  products?: AffiliateProductRow[];
  weight: number;
  is_active: boolean;
  sort_order: number;
  category?: { id: string; name: string; slug?: string } | null;
}

export default function BlogOfertasPage() {
  const [offers, setOffers] = useState<AffiliateOfferRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog/categories");
      if (!response.ok) throw new Error("Falha ao carregar categorias");
      const data = await response.json();
      setCategories(data);
    } catch {
      toast.error("Erro ao carregar categorias");
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const qs = categoryFilter
        ? `?category_id=${encodeURIComponent(categoryFilter)}`
        : "";
      const response = await fetch(`/api/admin/blog/affiliate-offers${qs}`);
      if (!response.ok) throw new Error("Falha ao carregar ofertas");
      const data = await response.json();
      setOffers(data);
    } catch {
      toast.error("Erro ao carregar ofertas");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta oferta?")) return;

    try {
      const response = await fetch(`/api/admin/blog/affiliate-offers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir");

      setOffers(offers.filter((o) => o.id !== id));
      toast.success("Oferta excluída com sucesso");
    } catch {
      toast.error("Erro ao excluir oferta");
    }
  };

  const handleToggleActive = async (offer: AffiliateOfferRow) => {
    setTogglingId(offer.id);
    try {
      const products =
        Array.isArray(offer.products) && offer.products.length > 0
          ? offer.products
          : [
              {
                label: offer.button_text,
                url: offer.url,
                image_url: "",
                sort_order: 0,
              },
            ];

      const response = await fetch(`/api/admin/blog/affiliate-offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: offer.category_id,
          title: offer.title,
          description: offer.description,
          products,
          weight: offer.weight,
          sort_order: offer.sort_order,
          is_active: !offer.is_active,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao atualizar");
      }

      const updated = await response.json();
      setOffers((prev) =>
        prev.map((o) => (o.id === offer.id ? { ...o, ...updated } : o))
      );
      toast.success(
        updated.is_active ? "Oferta ativada" : "Oferta desativada (não aparece no site)"
      );
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar status");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredOffers = offers.filter((o) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      o.title.toLowerCase().includes(term) ||
      o.category?.name?.toLowerCase().includes(term) ||
      o.url.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-7 w-7 text-emerald-600" />
            Ofertas Afiliadas
          </h1>
          <p className="text-gray-600">
            Cadastre produtos por categoria. O site escolhe uma oferta com base no peso —
            estável por artigo.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/ofertas/novo">
            <Plus className="mr-2 h-4 w-4" />
            Nova Oferta
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Lista de Ofertas</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filtrar por categoria"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar oferta..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                      Nenhuma oferta encontrada. Crie a primeira para a categoria desejada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div className="font-medium">{offer.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {Array.isArray(offer.products) && offer.products.length > 0
                            ? `${offer.products.length} produto${offer.products.length > 1 ? "s" : ""}: ${offer.products.map((p) => p.label).join(" · ")}`
                            : offer.button_text}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {offer.category?.name || "—"}
                      </TableCell>
                      <TableCell className="text-gray-600">{offer.weight}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          disabled={togglingId === offer.id}
                          onClick={() => handleToggleActive(offer)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                            offer.is_active
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                          title="Clique para ativar/desativar"
                        >
                          {offer.is_active ? "Ativa" : "Inativa"}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild title="Editar">
                            <Link href={`/admin/blog/ofertas/${offer.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(offer.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
