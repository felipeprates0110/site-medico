"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  FileText,
  FolderTree,
  MessageSquareText,
  CalendarDays,
  Newspaper,
  ShoppingBag,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type MenuLink = {
  type: "link";
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
};

type MenuGroup = {
  type: "group";
  title: string;
  icon: typeof LayoutDashboard;
  children: {
    title: string;
    href: string;
    icon: typeof LayoutDashboard;
  }[];
};

type MenuItem = MenuLink | MenuGroup;

const menuItems: MenuItem[] = [
  {
    type: "link",
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    title: "Perfil",
    href: "/admin/perfil",
    icon: User,
  },
  {
    type: "group",
    title: "RitmoBlog",
    icon: Newspaper,
    children: [
      {
        title: "Artigos",
        href: "/admin/blog",
        icon: FileText,
      },
      {
        title: "Calendário",
        href: "/admin/blog/calendario",
        icon: CalendarDays,
      },
      {
        title: "Categorias",
        href: "/admin/blog/categorias",
        icon: FolderTree,
      },
      {
        title: "Ofertas",
        href: "/admin/blog/ofertas",
        icon: ShoppingBag,
      },
      {
        title: "Comentários",
        href: "/admin/blog/comentarios",
        icon: MessageSquareText,
      },
    ],
  },
  {
    type: "link",
    title: "Configurações",
    href: "/admin/configuracoes",
    icon: Settings,
  },
];

function isMenuItemActive(pathname: string, href: string) {
  // Dashboard: só a raiz do admin
  if (href === "/admin") {
    return pathname === "/admin";
  }

  // Calendário tem rota própria no menu
  if (href === "/admin/blog/calendario") {
    return pathname.startsWith("/admin/blog/calendario");
  }

  // Artigos: /admin/blog e /admin/blog/[id|novo], mas não submenus dedicados
  if (href === "/admin/blog") {
    if (pathname === "/admin/blog") return true;
    if (!pathname.startsWith("/admin/blog/")) return false;
    return (
      !pathname.startsWith("/admin/blog/categorias") &&
      !pathname.startsWith("/admin/blog/comentarios") &&
      !pathname.startsWith("/admin/blog/calendario") &&
      !pathname.startsWith("/admin/blog/ofertas")
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, children: MenuGroup["children"]) {
  return children.some((child) => isMenuItemActive(pathname, child.href));
}

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
          <span className="text-xs font-medium text-primary-600">
            RitmoBlog Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.type === "group") {
              const GroupIcon = item.icon;
              const groupActive = isGroupActive(pathname, item.children);

              return (
                <li key={item.title} className="pt-1">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold",
                      groupActive ? "text-primary-700" : "text-gray-800"
                    )}
                  >
                    <GroupIcon
                      className={cn(
                        "h-5 w-5",
                        groupActive ? "text-primary-600" : "text-gray-500"
                      )}
                    />
                    {item.title}
                  </div>
                  <ul className="mt-1 space-y-1 border-l border-gray-100 ml-5 pl-2">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isActive = isMenuItemActive(pathname, child.href);

                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                              isActive
                                ? "bg-primary-50 text-primary-700 shadow-sm"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <ChildIcon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-primary-600" : "text-gray-400"
                              )}
                            />
                            {child.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            }

            const Icon = item.icon;
            const isActive = isMenuItemActive(pathname, item.href);

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
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary-600" : "text-gray-400"
                    )}
                  />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
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
