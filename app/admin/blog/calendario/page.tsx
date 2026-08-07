"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Trash2, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { WEEKDAY_LABELS, normalizePublishTime } from "@/lib/blog-calendar";

type Category = { id: string; name: string; slug?: string };

type PublishRule = {
  id?: string;
  weekday: number;
  category_id: string;
  publish_time: string;
  active: boolean;
  label: string | null;
  sort_order?: number;
  category?: Category | null;
};

type PreviewItem = {
  rule_id: string;
  date: string;
  weekday: number;
  publish_time: string;
  category: Category | null;
  label: string | null;
  article: { id: string; title: string } | null;
  empty: boolean;
};

type QueueByCategory = Record<string, { count: number; titles: string[] }>;

function formatBrDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

export default function CalendarioEditorialPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rules, setRules] = useState<PublishRule[]>([]);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [queueByCategory, setQueueByCategory] = useState<QueueByCategory>({});

  const load = async () => {
    try {
      const [rulesRes, catsRes] = await Promise.all([
        fetch("/api/admin/blog/publish-rules"),
        fetch("/api/admin/blog/categories"),
      ]);

      if (!rulesRes.ok) throw new Error("Falha ao carregar regras");
      if (!catsRes.ok) throw new Error("Falha ao carregar categorias");

      const rulesData = await rulesRes.json();
      const catsData = await catsRes.json();

      setCategories(Array.isArray(catsData) ? catsData : []);
      setRules(
        (rulesData.rules ?? []).map((r: PublishRule) => ({
          ...r,
          publish_time: normalizePublishTime(String(r.publish_time)),
          active: r.active !== false,
        }))
      );
      setPreview(rulesData.preview ?? []);
      setQueueByCategory(rulesData.queueByCategory ?? {});
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar calendário editorial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rulesByWeekday = useMemo(() => {
    const map: Record<number, PublishRule[]> = {};
    for (let d = 0; d < 7; d++) map[d] = [];
    for (const rule of rules) {
      map[rule.weekday]?.push(rule);
    }
    return map;
  }, [rules]);

  const addRule = (weekday: number) => {
    if (categories.length === 0) {
      toast.error("Crie uma categoria antes de montar o calendário.");
      return;
    }
    setRules((prev) => [
      ...prev,
      {
        weekday,
        category_id: categories[0].id,
        publish_time: "08:00",
        active: true,
        label: null,
      },
    ]);
  };

  const updateRule = (index: number, patch: Partial<PublishRule>) => {
    setRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, ...patch } : rule))
    );
  };

  const removeRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/blog/publish-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rules: rules.map((r, i) => ({
            id: r.id,
            weekday: r.weekday,
            category_id: r.category_id,
            publish_time: r.publish_time,
            active: r.active,
            label: r.label,
            sort_order: i,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao salvar");
      }

      toast.success("Calendário salvo! O robô vai seguir essas regras.");
      setLoading(true);
      await load();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar calendário";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-primary-600" />
            Calendário editorial
          </h1>
          <p className="text-gray-600 mt-1">
            Defina o ritmo: por exemplo, terça = Cardiologia e quinta = Arritmias.
            Artigos &quot;Na fila&quot; entram automaticamente.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/blog">Ver artigos</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar calendário
          </Button>
        </div>
      </div>

      {/* Fila por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Fila pronta por categoria</CardTitle>
          <CardDescription>
            Quantos artigos estão marcados como &quot;Na fila&quot; — o mais antigo
            sai primeiro no dia da categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma categoria ainda.{" "}
              <Link
                href="/admin/blog/categorias/novo"
                className="text-primary-600 underline"
              >
                Criar categoria
              </Link>
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                const q = queueByCategory[cat.id];
                return (
                  <div
                    key={cat.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900">{cat.name}</span>
                      <Badge variant={q?.count ? "success" : "warning"}>
                        {q?.count ?? 0} prontos
                      </Badge>
                    </div>
                    {q?.titles?.length ? (
                      <ul className="mt-2 space-y-1 text-xs text-gray-600">
                        {q.titles.map((t) => (
                          <li key={t} className="truncate">
                            • {t}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-amber-700">
                        Fila vazia — marque artigos desta categoria como &quot;Pronto
                        para fila&quot;.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade semanal */}
      <div className="grid gap-4 lg:grid-cols-2">
        {WEEKDAY_LABELS.map((dayLabel, weekday) => {
          const dayRules = rules
            .map((rule, index) => ({ rule, index }))
            .filter(({ rule }) => rule.weekday === weekday);

          return (
            <Card key={dayLabel}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{dayLabel}</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addRule(weekday)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayRules.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Sem publicação neste dia.
                  </p>
                ) : (
                  dayRules.map(({ rule, index }) => (
                    <div
                      key={rule.id ?? `new-${index}`}
                      className="rounded-lg border border-gray-200 p-3 space-y-3"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">
                            Categoria
                          </label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={rule.category_id}
                            onChange={(e) =>
                              updateRule(index, { category_id: e.target.value })
                            }
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">
                            Horário (Brasília)
                          </label>
                          <Input
                            type="time"
                            value={rule.publish_time}
                            onChange={(e) =>
                              updateRule(index, {
                                publish_time: e.target.value || "08:00",
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          Rótulo (opcional)
                        </label>
                        <Input
                          placeholder="Ex: Post de terça"
                          value={rule.label ?? ""}
                          onChange={(e) =>
                            updateRule(index, {
                              label: e.target.value || null,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={rule.active}
                            onChange={(e) =>
                              updateRule(index, { active: e.target.checked })
                            }
                          />
                          Ativa
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => removeRule(index)}
                          title="Remover slot"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                {rulesByWeekday[weekday]?.length === 0 && null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prévia */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia das próximas semanas</CardTitle>
          <CardDescription>
            Simulação: quem sairia da fila se nada mudar. Não publica ainda —
            só mostra o plano.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preview.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma regra ativa. Adicione slots acima e salve.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {preview.map((item) => (
                <li
                  key={`${item.rule_id}-${item.date}-${item.publish_time}`}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {WEEKDAY_LABELS[item.weekday]} · {formatBrDate(item.date)}{" "}
                      às {item.publish_time}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.category?.name ?? "Categoria"}
                      {item.label ? ` — ${item.label}` : ""}
                    </p>
                  </div>
                  {item.empty ? (
                    <Badge variant="warning" className="w-fit gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Sem artigo na fila
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-700 max-w-md truncate">
                      → {item.article?.title}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
