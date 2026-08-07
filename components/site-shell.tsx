"use client";

import { usePathname } from "next/navigation";

/**
 * Decide se mostra o “chrome” do site público (Header, Footer, WhatsApp flutuante).
 * No admin e no login, esses pedaços atrapalham — o painel já tem layout próprio.
 */
function isPrivateArea(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/login");
}

type SiteShellProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
  floatingWhatsApp: React.ReactNode;
  children: React.ReactNode;
};

export function SiteShell({
  header,
  footer,
  floatingWhatsApp,
  children,
}: SiteShellProps) {
  const pathname = usePathname();
  const hidePublicChrome = isPrivateArea(pathname);

  if (hidePublicChrome) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {floatingWhatsApp}
    </>
  );
}
