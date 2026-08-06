"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  FileEdit,
  MessageSquare,
  Plus,
  FolderTree,
  Image as ImageIcon,
  Eye,
  Users,
  MousePointerClick,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    pendingComments: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(emptyAnalytics);
  const [analyticsDays, setAnalyticsDays] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesRes, commentsRes] = await Promise.all([
          fetch("/api/admin/blog/articles"),
          fetch("/api/admin/blog/comments"),
        ]);

        const articles = (await articlesRes.json()) as BlogArticleRow[];
        const comments = (await commentsRes.json()) as BlogCommentRow[];

        const articleList = Array.isArray(articles) ? articles : [];
        const commentList = Array.isArray(comments) ? comments : [];

        setStats({
          articles: articleList.length,
          published: articleList.filter((a) => a.status === "published").length,
          drafts: articleList.filter((a) => a.status === "draft").length,
          pendingComments: commentList.filter((c) => c.status === "pending")
            .length,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas do blog", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      title: "Rascunhos",
      value: stats.drafts,
      icon: FileEdit,
      description: "Ainda não publicados",
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="cursor-pointer transition-all hover:scale-[1.02]">
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
              ) : analytics.daily.every((d) => d.views === 0) ? (
                <p className="text-sm text-gray-500">
                  Ainda não há visitas registradas neste período. Abra o site público e
                  navegue um pouco — os números aparecem aqui.
                </p>
              ) : (
                <div className="flex h-40 items-end gap-1.5">
                  {analytics.daily.map((day) => (
                    <div
                      key={day.date}
                      className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                      title={`${formatDayLabel(day.date)}: ${day.views} views, ${day.visitors} visitantes`}
                    >
                      <span className="text-[10px] font-medium text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">
                        {day.views}
                      </span>
                      <div
                        className="w-full rounded-t bg-teal-500/80 transition-all group-hover:bg-teal-600"
                        style={{
                          height: `${Math.max(4, (day.views / maxDailyViews) * 100)}%`,
                        }}
                      />
                      <span className="truncate text-[10px] text-gray-400">
                        {formatDayLabel(day.date)}
                      </span>
                    </div>
                  ))}
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
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/midia">
              <ImageIcon className="mr-2 h-4 w-4" />
              Biblioteca de mídia
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
