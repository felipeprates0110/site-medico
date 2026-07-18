"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  User,
  Phone,
  MapPin,
  Stethoscope,
  Pill,
  Shield,
  Star,
  Image,
  Settings,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Perfil",
    href: "/admin/perfil",
    icon: User,
  },
  {
    title: "Contato",
    href: "/admin/contato",
    icon: Phone,
  },
  {
    title: "Endereço",
    href: "/admin/endereco",
    icon: MapPin,
  },
  {
    title: "Especialidades",
    href: "/admin/especialidades",
    icon: Stethoscope,
  },
  {
    title: "Tratamentos",
    href: "/admin/tratamentos",
    icon: Pill,
  },
  {
    title: "Convênios",
    href: "/admin/convenios",
    icon: Shield,
  },
  {
    title: "Avaliações",
    href: "/admin/avaliacoes",
    icon: Star,
  },
  {
    title: "Mídia",
    href: "/admin/midia",
    icon: Image,
  },
  {
    title: "FAQ",
    href: "/admin/faq",
    icon: HelpCircle,
  },
  {
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      {/* Header */}
      <div className="flex h-20 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-lg shadow-primary-200">
          <Heart className="h-6 w-6" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">
            Dr. Pedro Felipe
          </span>
          <span className="text-xs font-medium text-primary-600">Painel Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-gray-400")} />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Profile */}
      <div className="border-t p-4">
        <div className="mb-4 flex items-center gap-3 px-3 py-2">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
            PF
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-gray-900">Dr. Pedro Felipe</span>
            <span className="truncate text-xs text-gray-500">admin@drpedrofelipe.com.br</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
