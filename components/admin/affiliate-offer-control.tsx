"use client";

import { useEffect, useState } from "react";
import type { AffiliateDisplayMode } from "@/lib/affiliate-offers";

type OfferOption = {
  id: string;
  title: string;
  category_id: string;
  is_active: boolean;
  products?: unknown[];
};

type AffiliateOfferControlProps = {
  categoryId: string;
  display: AffiliateDisplayMode;
  offerId: string;
  onDisplayChange: (mode: AffiliateDisplayMode) => void;
  onOfferIdChange: (offerId: string) => void;
};

/**
 * Controle da caixa afiliada neste artigo:
 * automático (peso), oferta específica, ou não mostrar.
 */
export function AffiliateOfferControl({
  categoryId,
  display,
  offerId,
  onDisplayChange,
  onOfferIdChange,
}: AffiliateOfferControlProps) {
  const [offers, setOffers] = useState<OfferOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setOffers([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(
      `/api/admin/blog/affiliate-offers?category_id=${encodeURIComponent(categoryId)}`
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return;
        const active = (Array.isArray(data) ? data : []).filter(
          (o: OfferOption) => o.is_active !== false
        );
        setOffers(active);
      })
      .catch(() => {
        if (!cancelled) setOffers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  // Se a categoria mudou e a oferta escolhida não pertence mais a ela, limpa
  useEffect(() => {
    if (display !== "offer" || !offerId) return;
    if (!categoryId) {
      onOfferIdChange("");
      return;
    }
    if (loading || offers.length === 0) return;
    const stillValid = offers.some((o) => o.id === offerId);
    if (!stillValid) onOfferIdChange("");
    // onOfferIdChange é setState estável o suficiente; evitar loop por referência nova
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, display, offerId, offers, loading]);

  return (
    <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
      <div>
        <p className="text-sm font-medium text-emerald-950">Oferta afiliada</p>
        <p className="mt-1 text-xs text-emerald-900/80">
          Define se este artigo usa o automático da categoria, uma oferta fixa
          ou nenhuma caixa.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="radio"
            name="affiliate_display"
            className="mt-1"
            checked={display === "auto"}
            onChange={() => onDisplayChange("auto")}
          />
          <span>
            <span className="font-medium text-gray-900">Automático</span>
            <span className="block text-xs text-gray-600">
              Escolhe pela categoria e pelo peso (padrão)
            </span>
          </span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="radio"
            name="affiliate_display"
            className="mt-1"
            checked={display === "offer"}
            onChange={() => onDisplayChange("offer")}
            disabled={!categoryId}
          />
          <span>
            <span className="font-medium text-gray-900">Oferta específica</span>
            <span className="block text-xs text-gray-600">
              Força uma oferta desta categoria neste artigo
            </span>
          </span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="radio"
            name="affiliate_display"
            className="mt-1"
            checked={display === "hide"}
            onChange={() => onDisplayChange("hide")}
          />
          <span>
            <span className="font-medium text-gray-900">Não mostrar</span>
            <span className="block text-xs text-gray-600">
              Esconde a caixa só neste artigo
            </span>
          </span>
        </label>
      </div>

      {display === "offer" && (
        <div className="space-y-2 pt-1">
          {!categoryId ? (
            <p className="text-xs text-amber-800">
              Escolha uma categoria acima para listar as ofertas.
            </p>
          ) : loading ? (
            <p className="text-xs text-gray-500">Carregando ofertas…</p>
          ) : offers.length === 0 ? (
            <p className="text-xs text-amber-800">
              Nenhuma oferta ativa nesta categoria. Cadastre em RitmoBlog →
              Ofertas.
            </p>
          ) : (
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={offerId}
              onChange={(e) => onOfferIdChange(e.target.value)}
              required={display === "offer"}
              aria-label="Oferta específica"
            >
              <option value="">Selecione a oferta…</option>
              {offers.map((offer) => {
                const count = Array.isArray(offer.products)
                  ? offer.products.length
                  : 0;
                return (
                  <option key={offer.id} value={offer.id}>
                    {offer.title}
                    {count > 0 ? ` (${count} produto${count > 1 ? "s" : ""})` : ""}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
