"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  MessageSquare,
  Plus,
  FolderTree,
  Eye,
  Users,
  MousePointerClick,
  ExternalLink,
  ListOrdered,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AnalyticsSummary = {
  days: number;
  pageViews: number;
  uniqueVisitors: number;
  whatsappClicks: number;
  agendarClicks: number;
  segundaOpiniaoClicks: number;
  phoneClicks: number;
  emailClicks: number;
  topPages: { path: string; views: number }[];
  daily: { date: string; views: number; visitors: number }[];
};

type BlogArticleRow = {
  status?: string;
};

type BlogCommentRow = {
  status?: string;
};

type PublishAlertRow = {
  id: string;
  message: string;
  slot_date: string;
  created_at: string;
};

const emptyAnalytics: AnalyticsSummary = {
  days: 7,
  pageViews: 0,
  uniqueVisitors: 0,
  whatsappClicks: 0,
  agendarClicks: 0,
  segundaOpiniaoClicks: 0,
  phoneClicks: 0,
  emailClicks: 0,
  topPages: [],
  daily: [],
};

type DailyPoint = { date: string; views: number; visitors: number };

const MONTH_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

function formatDayLabel(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

/** Label curto no eixo X: "6 ago" (mais legível que 30x "06/08"). */
function formatAxisLabel(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  const m = Number(month);
  const d = Number(day);
  return `${d} ${MONTH_SHORT[m - 1] ?? month}`;
}

/**
 * Em 7 dias: mostra todos os rótulos.
 * Em 30 dias: só ~6 pontos (primeiro, último e espaçados) — evita "sopa" de datas.
 */
function shouldShowAxisLabel(index: number, total: number) {
  if (total <= 10) return true;
  if (index === 0 || index === total - 1) return true;
  const step = Math.max(1, Math.round((total - 1) / 5));
  return index % step === 0;
}

function buildDailyInsights(daily: DailyPoint[]) {
  const totalViews = daily.reduce((sum, d) => sum + d.views, 0);
  const days = daily.length || 1;
  const avg = totalViews / days;
  const peak = daily.reduce(
    (best, d) => (d.views > best.views ? d : best),
    daily[0] ?? { date: "", views: 0, visitors: 0 }
  );
  const last7 = daily.slice(-7);
  const last7Views = last7.reduce((sum, d) => sum + d.views, 0);
  const last7Share =
    totalViews > 0 ? Math.round((last7Views / totalViews) * 100) : 0;

  return {
    avg: Math.round(avg * 10) / 10,
    peak,
    last7Share,
  };
}

function DailyViewsChart({
  daily,
  periodDays,
}: {
  daily: DailyPoint[];
  periodDays: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxViews = Math.max(1, ...daily.map((d) => d.views));
  const chartHeight = periodDays > 10 ? 180 : 144;
  const insights = buildDailyInsights(daily);
  const yTicks = [maxViews, Math.round(maxViews / 2), 0];
  const isDense = daily.length > 10;
  const gapClass = isDense ? "gap-px sm:gap-0.5" : "gap-1.5";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        <span>
          <span className="font-medium text-gray-800">Média:</span>{" "}
          {insights.avg.toLocaleString("pt-BR")} / dia
        </span>
        <span className="text-gray-300" aria-hidden>
          ·
        </span>
        <span>
          <span className="font-medium text-gray-800">Pico:</span>{" "}
          {insights.peak.views.toLocaleString("pt-BR")} em{" "}
          {formatDayLabel(insights.peak.date)}
        </span>
        {periodDays > 7 && (
          <>
            <span className="text-gray-300" aria-hidden>
              ·
            </span>
            <span>
              <span className="font-medium text-gray-800">Últimos 7 dias:</span>{" "}
              {insights.last7Share}% do total
            </span>
          </>
        )}
      </div>

      <div className="flex gap-3">
        {/* Escala Y — ajuda a ler se o pico é “alto de verdade” */}
        <div
          className="flex w-8 shrink-0 flex-col justify-between pb-6 text-right text-[10px] tabular-nums text-gray-400"
          style={{ height: chartHeight + 24 }}
          aria-hidden
        >
          {yTicks.map((tick) => (
            <span key={`y-${tick}`}>{tick}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="relative"
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Linhas guia horizontais */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-gray-100"
              style={{ height: chartHeight }}
              aria-hidden
            >
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-100" />
              <div className="absolute inset-x-0 bottom-0 border-t border-gray-100" />
            </div>

            <div
              className={cn("relative flex items-end", gapClass)}
              style={{ height: chartHeight }}
              role="img"
              aria-label="Gráfico de visualizações por dia"
            >
              {daily.map((day, index) => {
                const barPx =
                  day.views <= 0
                    ? 1
                    : Math.max(4, Math.round((day.views / maxViews) * (chartHeight - 8)));
                const isActive = activeIndex === index;

                return (
                  <button
                    key={day.date}
                    type="button"
                    className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() =>
                      setActiveIndex((prev) => (prev === index ? null : index))
                    }
                    aria-label={`${formatDayLabel(day.date)}: ${day.views} visualizações, ${day.visitors} visitantes`}
                  >
                    <div
                      className={cn(
                        "w-full max-w-[28px] rounded-t transition-colors",
                        isActive
                          ? "bg-teal-600"
                          : day.views > 0
                            ? "bg-teal-500/85 group-hover:bg-teal-600"
                            : "bg-gray-200/80"
                      )}
                      style={{ height: `${barPx}px` }}
                    />

                    {isActive && (
                      <div
                        className={cn(
                          "pointer-events-none absolute bottom-full z-20 mb-2 w-max max-w-[170px] rounded-md bg-gray-900 px-2.5 py-1.5 text-left text-[11px] leading-snug text-white shadow-lg",
                          index < 3
                            ? "left-0"
                            : index > daily.length - 4
                              ? "right-0"
                              : "left-1/2 -translate-x-1/2"
                        )}
                      >
                        <p className="font-semibold">{formatDayLabel(day.date)}</p>
                        <p>
                          {day.views.toLocaleString("pt-BR")} views ·{" "}
                          {day.visitors.toLocaleString("pt-BR")} visitantes
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={cn("mt-2 flex", gapClass)}>
            {daily.map((day, index) => (
              <span
                key={`${day.date}-label`}
                className="min-w-0 flex-1 text-center text-[10px] tabular-nums text-gray-400"
              >
                {shouldShowAxisLabel(index, daily.length)
                  ? formatAxisLabel(day.date)
                  : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400">
        Passe o mouse ou toque numa barra para ver o detalhe do dia.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    published: 0,
    drafts: 0,
    ready: 0,
    scheduled: 0,
    pendingComments: 0,
  });
  const [alerts, setAlerts] = useState<PublishAlertRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(emptyAnalytics);
  const [analyticsDays, setAnalyticsDays] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [articlesRes, commentsRes, alertsRes] = await Promise.all([
        fetch("/api/admin/blog/articles"),
        fetch("/api/admin/blog/comments"),
        fetch("/api/admin/blog/publish-alerts?unresolved=1"),
      ]);

      const articles = (await articlesRes.json()) as BlogArticleRow[];
      const comments = (await commentsRes.json()) as BlogCommentRow[];
      const alertList = (await alertsRes.json()) as PublishAlertRow[];

      const articleList = Array.isArray(articles) ? articles : [];
      const commentList = Array.isArray(comments) ? comments : [];

      setStats({
        articles: articleList.length,
        published: articleList.filter((a) => a.status === "published").length,
        drafts: articleList.filter((a) => a.status === "draft").length,
        ready: articleList.filter((a) => a.status === "ready").length,
        scheduled: articleList.filter((a) => a.status === "scheduled").length,
        pendingComments: commentList.filter((c) => c.status === "pending")
          .length,
      });
      setAlerts(Array.isArray(alertList) ? alertList : []);
    } catch (error) {
      console.error("Erro ao carregar estatísticas do blog", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const resolveAlert = async (id: string) => {
    try {
      const res = await fetch("/api/admin/blog/publish-alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Falha ao resolver alerta");
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Alerta marcado como resolvido");
    } catch {
      toast.error("Não foi possível resolver o alerta");
    }
  };

  const resolveAllAlerts = async () => {
    try {
      const res = await fetch("/api/admin/blog/publish-alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolveAll: true }),
      });
      if (!res.ok) throw new Error("Falha ao resolver alertas");
      setAlerts([]);
      toast.success("Todos os alertas foram resolvidos");
    } catch {
      toast.error("Não foi possível resolver os alertas");
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?days=${analyticsDays}`);
        if (!response.ok) throw new Error("Falha ao carregar analytics");
        const data = (await response.json()) as AnalyticsSummary;
        setAnalytics(data);
      } catch (error) {
        console.error("Erro ao carregar acessos", error);
        setAnalytics({ ...emptyAnalytics, days: analyticsDays });
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [analyticsDays]);

  const cards = [
    {
      title: "Artigos",
      value: stats.articles,
      icon: FileText,
      description: "Total de posts no RitmoBlog",
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/blog",
    },
    {
      title: "Publicados",
      value: stats.published,
      icon: CheckCircle2,
      description: "Visíveis no site público",
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/blog",
    },
    {
      title: "Na fila",
      value: stats.ready,
      icon: ListOrdered,
      description: "Prontos para o calendário",
      color: "text-primary-600",
      bg: "bg-primary-50",
      href: "/admin/blog/calendario",
    },
    {
      title: "Rascunhos",
      value: stats.drafts,
      icon: FileEdit,
      description:
        stats.scheduled > 0
          ? `${stats.scheduled} também agendado(s) pontualmente`
          : "Ainda em edição",
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/blog",
    },
    {
      title: "Comentários",
      value: stats.pendingComments,
      icon: MessageSquare,
      description: "Aguardando moderação",
      color: stats.pendingComments > 0 ? "text-red-600" : "text-green-600",
      bg: stats.pendingComments > 0 ? "bg-red-50" : "bg-green-50",
      href: "/admin/blog/comentarios",
    },
  ];

  const accessCards = [
    {
      title: "Visitantes",
      value: analytics.uniqueVisitors,
      icon: Users,
      description: `Pessoas diferentes (últimos ${analytics.days} dias)`,
      color: "text-teal-700",
      bg: "bg-teal-50",
    },
    {
      title: "Visualizações",
      value: analytics.pageViews,
      icon: Eye,
      description: "Páginas abertas no período",
      color: "text-sky-700",
      bg: "bg-sky-50",
    },
    {
      title: "WhatsApp",
      value: analytics.whatsappClicks,
      icon: MousePointerClick,
      description: "Cliques no botão WhatsApp",
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      title: "Agendar",
      value: analytics.agendarClicks,
      icon: MousePointerClick,
      description: "Cliques em Agendar consulta",
      color: "text-indigo-700",
      bg: "bg-indigo-50",
    },
    {
      title: "2ª opinião",
      value: analytics.segundaOpiniaoClicks,
      icon: MousePointerClick,
      description: "Cliques / solicitações de segunda opinião",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, Dr. Pedro Felipe</h1>
        <p className="text-gray-600">
          Painel do RitmoBlog — publique artigos, modere comentários e acompanhe o
          acesso ao site.
        </p>
      </div>

      {/* Métricas do blog */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="cursor-pointer transition-all hover:scale-[1.02] h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={cn("rounded-lg p-2", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : card.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alertas do calendário editorial */}
      {alerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                Slots vazios no calendário
              </CardTitle>
              <CardDescription className="text-amber-800/80">
                Chegou o dia da categoria, mas não havia artigo &quot;Na fila&quot;.
                Escreva ou marque um artigo pronto para a próxima vez.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={resolveAllAlerts}
            >
              Resolver todos
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-gray-800">{alert.message}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Ok, entendi
                </Button>
              </div>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/blog/calendario">
                <CalendarDays className="mr-2 h-4 w-4" />
                Abrir calendário editorial
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Acesso ao site */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Acesso ao site</h2>
            <p className="text-sm text-gray-600">
              Visitas e cliques importantes — sem dados pessoais do visitante.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={analyticsDays === 7 ? "default" : "outline"}
              onClick={() => setAnalyticsDays(7)}
            >
              7 dias
            </Button>
            <Button
              type="button"
              size="sm"
              variant={analyticsDays === 30 ? "default" : "outline"}
              onClick={() => setAnalyticsDays(30)}
            >
              30 dias
            </Button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {accessCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={cn("rounded-lg p-2", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsLoading ? "..." : card.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Gráfico ocupa 2/3 da largura — em 30 dias precisa de espaço para ler tendência */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Visualizações por dia</CardTitle>
              <CardDescription>
                Tendência do período · passe o mouse (ou toque) para inspecionar um dia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <p className="text-sm text-gray-500">Carregando gráfico...</p>
              ) : analytics.daily.length === 0 ||
                analytics.daily.every((d) => d.views === 0) ? (
                <p className="text-sm text-gray-500">
                  Ainda não há visitas registradas neste período. Abra o site público e
                  navegue um pouco — os números aparecem aqui.
                </p>
              ) : (
                <DailyViewsChart
                  daily={analytics.daily}
                  periodDays={analytics.days}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Páginas mais vistas</CardTitle>
              <CardDescription>Top 5 caminhos no período selecionado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyticsLoading ? (
                <p className="text-sm text-gray-500">Carregando...</p>
              ) : analytics.topPages.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma página registrada ainda.</p>
              ) : (
                analytics.topPages.map((page, index) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {index + 1}. {page.path}
                      </p>
                    </div>
                    <Badge variant="secondary">{page.views}</Badge>
                  </div>
                ))
              )}

              <div className="pt-2 text-xs text-gray-500">
                Também: {analyticsLoading ? "…" : analytics.phoneClicks} cliques em
                telefone · {analyticsLoading ? "…" : analytics.emailClicks} em
                e-mail ·{" "}
                {analyticsLoading ? "…" : analytics.segundaOpiniaoClicks} em 2ª
                opinião
              </div>

              <a
                href="https://vercel.com/docs/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:underline"
              >
                Ver Analytics completo na Vercel
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>O que você deseja fazer agora?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/blog/novo">
              <Plus className="mr-2 h-4 w-4" />
              Escrever novo artigo
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/blog/calendario">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendário editorial
              {stats.ready > 0 && !loading ? ` (${stats.ready} na fila)` : ""}
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/blog/categorias">
              <FolderTree className="mr-2 h-4 w-4" />
              Gerenciar categorias
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/blog/comentarios">
              <MessageSquare className="mr-2 h-4 w-4" />
              Moderar comentários
              {stats.pendingComments > 0 && !loading
                ? ` (${stats.pendingComments})`
                : ""}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
