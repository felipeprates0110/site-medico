"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { AffiliateProduct } from "@/lib/affiliate-offers";

interface AffiliateBoxProps {
  title: string;
  description: string;
  products: AffiliateProduct[];
}

function ProductImage({
  imageUrl,
  label,
}: {
  imageUrl: string;
  label: string;
}) {
  const [failed, setFailed] = useState(false);

  // Sem URL ou URL que falhou → ícone amigável (evita o “X” quebrado do navegador)
  if (!imageUrl || failed) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
        <ShoppingCart className="h-8 w-8 text-emerald-600" aria-hidden />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    // URL externa do fabricante — <img> evita configurar cada domínio no next/image
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={label}
      className="max-h-full max-w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Caixa de oferta no artigo.
 * Pode ter vários produtos (ex.: Apple Watch + Galaxy Watch), cada um com foto e link.
 */
export function AffiliateBox({ title, description, products }: AffiliateBoxProps) {
  if (!products.length) return null;

  return (
    <div className="my-14 bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />

      <div className="mb-8">
        <h4 className="text-xl font-extrabold text-[#0f172a] mb-3">{title}</h4>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div
        className={`grid gap-6 ${
          products.length === 1
            ? "grid-cols-1 max-w-md"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {products.map((product, index) => (
          <a
            key={`${product.url}-${index}`}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group flex flex-col rounded-2xl border border-slate-100 bg-slate-50/80 p-5 transition-all hover:border-emerald-200 hover:bg-white hover:shadow-md"
          >
            <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-white border border-slate-100 overflow-hidden">
              <ProductImage imageUrl={product.image_url} label={product.label} />
            </div>

            <span className="mt-auto inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-bold text-white transition-colors group-hover:bg-emerald-700">
              {product.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
