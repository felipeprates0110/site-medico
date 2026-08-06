"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Stethoscope,
  Pill,
  Activity,
  MessageSquare,
  Plus,
  User,
  Image,
  Shield,
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
  vercelAnalyticsHint?: string;
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
    specialties: 0,
    treatments: 0,
    reviews: 0,
    pendingReviews: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(emptyAnalytics);
  const [analyticsDays, setAnalyticsDays] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [specRes, treatRes, reviewRes] = await Promise.all([
          fetch("/api/admin/specialties"),
          fetch("/api/admin/treatments"),
          fetch("/api/admin/reviews"),
        ]);

        const specs = await specRes.json();
        const treats = await treatRes.json();
        const reviews = await reviewRes.json();

        setStats({
          specialties: Array.isArray(specs) ? specs.length : 0,
          treatments: Array.isArray(treats) ? treats.length : 0,
          reviews: Array.isArray(reviews) ? reviews.length : 0,
          pendingReviews: Array.isArray(reviews)
            ? reviews.filter((r: { approved?: boolean }) => !r.approved).length
            : 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
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
      title: "Especialidades",
      value: stats.specialties,
      icon: Stethoscope,
      description: "Especialidades ativas no site",
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/especialidades",
    },
    {
      title: "Tratamentos",
      value: stats.treatments,
      icon: Pill,
      description: "Doenças e procedimentos",
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/tratamentos",
    },
    {
      title: "Avaliações",
      value: stats.reviews,
      icon: Star,
      description: "Total de feedbacks recebidos",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      href: "/admin/avaliacoes",
    },
    {
      title: "Pendentes",
      value: stats.pendingReviews,
      icon: MessageSquare,
      description: "Avaliações aguardando aprovação",
      color: stats.pendingReviews > 0 ? "text-red-600" : "text-green-600",
      bg: stats.pendingReviews > 0 ? "bg-red-50" : "bg-green-50",
      href: "/admin/avaliacoes",
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
        <p className="text-gray-600">Aqui está o que está acontecendo no seu site hoje.</p>
      </div>

      {/* Conteúdo do site */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Link key={i} href={card.href}>
            <Card className="cursor-pointer transition-all hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
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
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>O que você deseja fazer agora?</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/especialidades/novo">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar nova especialidade
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/tratamentos/novo">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar novo tratamento
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/perfil">
                <User className="mr-2 h-4 w-4" />
                Atualizar meu perfil profissional
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>Integridade das integrações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Banco de Dados (Supabase)</span>
              </div>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Armazenamento (Vercel Blob)</span>
              </div>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">SSL / Segurança</span>
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Analytics (acessos)</span>
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
