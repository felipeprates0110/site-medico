"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/sobre" },
  { name: "Especialidades", href: "/especialidades" },
  { name: "Blog", href: "/blog" },
  { name: "Avaliações", href: "/avaliacoes" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, isAdmin]);

  if (isAdmin) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "premium-glass border-b border-gray-200/80 shadow-sm"
          : "bg-white/70 backdrop-blur-md border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white transition-colors duration-300 group-hover:bg-primary-600">
            <Heart className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight text-gray-900">
              Dr. Pedro Felipe
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-600">
              Cardiologia
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300",
                isActive(item.href)
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button
            size="sm"
            className="rounded-lg bg-gray-900 px-5 font-semibold shadow-none transition-all duration-300 hover:bg-primary-600"
            asChild
          >
            <Link href="/agendar">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Consulta
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 transition-colors duration-300 hover:bg-gray-50 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
                <Heart className="h-5 w-5" fill="currentColor" />
              </div>
              <span className="text-lg font-bold text-gray-900">Dr. Pedro Felipe</span>
            </Link>
            <button
              type="button"
              className="rounded-lg p-2.5 text-gray-700 transition-colors duration-300 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-10 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-xl px-4 py-3.5 text-base font-semibold transition-all duration-300",
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-900 hover:bg-gray-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button className="w-full rounded-xl bg-gray-900 hover:bg-primary-600" asChild>
              <Link href="/agendar" onClick={() => setMobileMenuOpen(false)}>
                Agendar Consulta
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
