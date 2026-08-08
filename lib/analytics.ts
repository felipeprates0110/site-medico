/**
 * Analytics interno do site.
 * Analogia: é o "caderninho da porta" — anota visitas e cliques importantes,
 * sem guardar nome ou dados pessoais do visitante (LGPD).
 */

export const ANALYTICS_EVENTS = [
  "page_view",
  "whatsapp_click",
  "agendar_click",
  "segunda_opiniao_click",
  "phone_click",
  "email_click",
  "related_article_click",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return (ANALYTICS_EVENTS as readonly string[]).includes(value);
}

const SESSION_KEY = "ritmo_analytics_sid";

/** Gera/recupera um ID anônimo só desta aba (sessionStorage). */
export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function shouldSkipAnalyticsPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api")
  );
}

/**
 * Envia um evento para a API pública.
 * Usa keepalive para não perder o clique quando a página fecha (ex.: abre WhatsApp).
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  options?: { path?: string; meta?: Record<string, string> }
) {
  if (typeof window === "undefined") return;

  const path = options?.path ?? window.location.pathname;
  if (shouldSkipAnalyticsPath(path)) return;

  const payload = {
    event_name: eventName,
    path: path.slice(0, 500),
    session_id: getAnalyticsSessionId(),
    referrer: document.referrer ? document.referrer.slice(0, 500) : null,
    meta: options?.meta ?? {},
  };

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon("/api/analytics/event", blob);
      if (sent) return;
    }
  } catch {
    // fallback abaixo
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // silencioso: analytics não deve quebrar a navegação
  });
}
