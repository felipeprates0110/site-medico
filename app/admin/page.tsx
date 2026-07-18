"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Star, 
  Stethoscope, 
  Pill, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Calendar,
  MessageSquare,
  Plus,
  User,
  Image,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    specialties: 0,
    treatments: 0,
    reviews: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);

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
          pendingReviews: Array.isArray(reviews) ? reviews.filter((r: any) => !r.approved).length : 0,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, Dr. Pedro Felipe</h1>
        <p className="text-gray-600">Aqui está o que está acontecendo no seu site hoje.</p>
      </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
