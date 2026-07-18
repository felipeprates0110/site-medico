"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/sobre" },
  { name: "Especialidades", href: "/especialidades" },
  { name: "Tratamentos", href: "/tratamentos" },
  { name: "Convênios", href: "/convenios" },
  { name: "Avaliações", href: "/avaliacoes" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 lg:px-8">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 lg:px-6",
          scrolled
            ? "healthtech-glass shadow-lg shadow-primary-600/5 ring-1 ring-gray-200/60"
            : "bg-white/60 backdrop-blur-sm ring-1 ring-white/80"
        )}
      >
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30 transition-transform group-hover:scale-105">
            <Heart className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-gray-900">
              Dr. Pedro Felipe
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-600">
              Cardiologia
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Button variant="ghost" size="sm" className="rounded-xl font-semibold text-gray-600" asChild>
            <Link href="tel:61999999999">
              <Phone className="mr-2 h-4 w-4 text-primary-600" />
              (61) 99999-9999
            </Link>
          </Button>
          <Button
            size="sm"
            className="rounded-xl bg-primary-600 px-5 font-semibold shadow-lg shadow-primary-600/25 hover:bg-primary-700"
            asChild
          >
            <Link href="/agendar">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-gray-700 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <Heart className="h-5 w-5" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-gray-900">Dr. Pedro Felipe</span>
            </Link>
            <button
              type="button"
              className="rounded-xl p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-8 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-semibold",
                  pathname === item.href ? "bg-primary-50 text-primary-700" : "text-gray-900"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <Button className="w-full rounded-xl" asChild>
              <Link href="/agendar" onClick={() => setMobileMenuOpen(false)}>
                Agendar Consulta
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-xl" asChild>
              <Link href="tel:61999999999" onClick={() => setMobileMenuOpen(false)}>
                Ligar Agora
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
