"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ProductFormRow = {
  label: string;
  url: string;
  image_url: string;
  sort_order: string;
};

type AffiliateProductsFieldsProps = {
  products: ProductFormRow[];
  onChange: (products: ProductFormRow[]) => void;
};

const emptyProduct = (index: number): ProductFormRow => ({
  label: "",
  url: "",
  image_url: "",
  sort_order: String(index),
});

/**
 * Lista dinâmica de produtos da oferta (nome, link afiliado, foto do fabricante).
 */
export function AffiliateProductsFields({
  products,
  onChange,
}: AffiliateProductsFieldsProps) {
  const updateProduct = (index: number, patch: Partial<ProductFormRow>) => {
    onChange(
      products.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  };

  const addProduct = () => {
    onChange([...products, emptyProduct(products.length)]);
  };

  const removeProduct = (index: number) => {
    if (products.length <= 1) return;
    onChange(products.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Produtos *</p>
          <p className="text-xs text-gray-500">
            Ex.: Apple Watch (iPhone) + Galaxy Watch (Android). Cole a foto do site do fabricante.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addProduct}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {products.map((product, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Produto {index + 1}
            </p>
            {products.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => removeProduct(index)}
                title="Remover produto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nome / texto do botão *
            </label>
            <Input
              required
              value={product.label}
              onChange={(e) => updateProduct(index, { label: e.target.value })}
              placeholder="Ex: Conferir Apple Watch (iPhone)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL afiliada *</label>
            <Input
              type="url"
              required
              value={product.url}
              onChange={(e) => updateProduct(index, { url: e.target.value })}
              placeholder="https://www.amazon.com.br/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              URL da foto (fabricante)
            </label>
            <Input
              type="url"
              value={product.image_url}
              onChange={(e) =>
                updateProduct(index, { image_url: e.target.value })
              }
              placeholder="https://www.apple.com/.../image.png"
            />
            <p className="text-xs text-gray-500">
              Cole o link direto da imagem (termine em .png, .jpg, .webp quando possível).
            </p>
            {product.image_url ? (
              <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-lg border bg-white overflow-hidden">
                {/* Preview no admin */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt={`Preview ${index + 1}`}
                  className="max-h-full max-w-full object-contain p-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2 max-w-[140px]">
            <label className="text-sm font-medium">Ordem</label>
            <Input
              type="number"
              value={product.sort_order}
              onChange={(e) =>
                updateProduct(index, { sort_order: e.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function productsToPayload(products: ProductFormRow[]) {
  return products.map((p, i) => ({
    label: p.label,
    url: p.url,
    image_url: p.image_url,
    sort_order: Number(p.sort_order) || i,
  }));
}

export function productsFromApi(
  products: unknown,
  fallback?: { label?: string; url?: string }
): ProductFormRow[] {
  if (Array.isArray(products) && products.length > 0) {
    return products.map((p: any, i: number) => ({
      label: String(p?.label ?? ""),
      url: String(p?.url ?? ""),
      image_url: String(p?.image_url ?? ""),
      sort_order: String(p?.sort_order ?? i),
    }));
  }

  if (fallback?.label || fallback?.url) {
    return [
      {
        label: fallback.label || "",
        url: fallback.url || "",
        image_url: "",
        sort_order: "0",
      },
    ];
  }

  return [emptyProduct(0)];
}
