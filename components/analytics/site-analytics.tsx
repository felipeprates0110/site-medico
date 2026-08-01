"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { shouldSkipAnalyticsPath, trackEvent } from "@/lib/analytics";

/**
 * Coleta page views no site público:
 * 1) Vercel Analytics (painel da Vercel)
 * 2) Nosso banco (para mostrar no Admin)
 */
export function SiteAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || shouldSkipAnalyticsPath(pathname)) return;

    const query = searchParams?.toString();
    const key = query ? `${pathname}?${query}` : pathname;

    // Evita contar duas vezes a mesma página na mesma montagem
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    trackEvent("page_view", { path: pathname });
  }, [pathname, searchParams]);

  return <Analytics />;
}
