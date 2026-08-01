import { Suspense } from "react";
import { SiteAnalytics } from "./site-analytics";

/** Envolve o tracker com Suspense (exigido pelo useSearchParams no App Router). */
export function SiteAnalyticsProvider() {
  return (
    <Suspense fallback={null}>
      <SiteAnalytics />
    </Suspense>
  );
}
