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

function formatDayLabel(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
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

  const maxDailyViews = Math.max(1, ...analytics.daily.map((d) => d.views));

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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações por dia</CardTitle>
              <CardDescription>
                Quantas páginas foram abertas a cada dia do período
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
                <div className="space-y-2">
                  {/*
                    As barras ficam numa faixa com altura fixa (h-36).
                    Antes a altura era em % dentro de um pai sem altura —
                    no CSS isso vira 0px e o gráfico parece vazio.
                  */}
                  <div className="flex h-36 items-end gap-1.5">
                    {analytics.daily.map((day) => {
                      // Altura em pixels (não %), deixando espaço pro número no hover
                      const barPx =
                        day.views <= 0
                          ? 2
                          : Math.max(8, Math.round((day.views / maxDailyViews) * 120));
                      return (
                        <div
                          key={day.date}
                          className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                          title={`${formatDayLabel(day.date)}: ${day.views} views, ${day.visitors} visitantes`}
                        >
                          <span className="mb-1 text-[10px] font-medium text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">
                            {day.views}
                          </span>
                          <div
                            className="w-full rounded-t bg-teal-500/80 transition-all group-hover:bg-teal-600"
                            style={{ height: `${barPx}px` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-1.5">
                    {analytics.daily.map((day) => (
                      <span
                        key={`${day.date}-label`}
                        className="min-w-0 flex-1 truncate text-center text-[10px] text-gray-400"
                      >
                        {formatDayLabel(day.date)}
                      </span>
                    ))}
                  </div>
                </div>
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
