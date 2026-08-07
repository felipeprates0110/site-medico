/**
 * Utilitários do calendário editorial do RitmoBlog.
 * Analogia: o "relógio da clínica" em Brasília — decide se já é hora de publicar.
 */

export const BLOG_TZ = "America/Sao_Paulo";

export const ARTICLE_STATUSES = [
  "draft",
  "ready",
  "scheduled",
  "published",
] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "Rascunho",
  ready: "Na fila",
  scheduled: "Agendado",
  published: "Publicado",
};

/** Partes de data/hora no fuso de Brasília. */
export function getBrazilNowParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BLOG_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value])
  );

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // Alguns ambientes retornam "24" para meia-noite
  const hour = parts.hour === "24" ? 0 : Number(parts.hour);
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);

  return {
    dateStr: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    year,
    month,
    day,
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: weekdayMap[parts.weekday] ?? 0,
  };
}

/** Converte "08:00" ou "08:00:00" em minutos desde meia-noite. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** True se o horário da regra já passou hoje (Brasília). */
export function isRuleDueNow(
  publishTime: string,
  now = getBrazilNowParts()
): boolean {
  const ruleMinutes = timeToMinutes(publishTime);
  const nowMinutes = now.hour * 60 + now.minute;
  return nowMinutes >= ruleMinutes;
}

/** Normaliza TIME do Postgres para HH:MM. */
export function normalizePublishTime(time: string): string {
  if (!time) return "08:00";
  const [h, m] = time.split(":");
  return `${String(h).padStart(2, "0")}:${String(m || "0").padStart(2, "0")}`;
}

/**
 * Próximas N datas (incluindo hoje) para um weekday em Brasília.
 * Retorna YYYY-MM-DD.
 */
export function upcomingDatesForWeekday(
  weekday: number,
  count: number,
  from = new Date()
): string[] {
  const dates: string[] = [];
  const cursor = new Date(from);

  for (let i = 0; i < 90 && dates.length < count; i++) {
    const probe = new Date(cursor.getTime() + i * 24 * 60 * 60 * 1000);
    const parts = getBrazilNowParts(probe);
    if (parts.weekday === weekday) {
      dates.push(parts.dateStr);
    }
  }

  return dates;
}

/**
 * Normaliza timestamps vindos do Postgres/Supabase.
 * Ex.: "2026-08-07 12:47:00+00" → Date válido no navegador.
 */
export function parseTimestamp(value: string | null | undefined): Date | null {
  if (!value) return null;

  let normalized = String(value).trim();
  // Espaço entre data e hora (Postgres) → ISO com T
  if (/^\d{4}-\d{2}-\d{2} /.test(normalized)) {
    normalized = normalized.replace(" ", "T");
  }
  // "+00" / "-03" sem minutos → "+00:00"
  normalized = normalized.replace(/([+-]\d{2})$/, "$1:00");

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

/** Converte datetime-local (Brasília, sem DST) para ISO UTC. */
export function brazilLocalToIso(localDatetime: string): string | null {
  if (!localDatetime) return null;
  const match = localDatetime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
  );
  if (!match) return null;

  const [, y, mo, d, h, mi] = match;
  const date = new Date(`${y}-${mo}-${d}T${h}:${mi}:00-03:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/** Formata ISO/Postgres para input datetime-local em Brasília. */
export function isoToBrazilLocalInput(iso: string | null | undefined): string {
  const date = parseTimestamp(iso);
  if (!date) return "";

  const parts = getBrazilNowParts(date);
  return `${parts.dateStr}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

/** Texto legível: "07/08/2026 às 09:47". */
export function formatBrazilDateTimeLabel(
  iso: string | null | undefined
): string {
  const local = isoToBrazilLocalInput(iso);
  if (!local) return "";
  const [datePart, timePart] = local.split("T");
  const [y, m, d] = datePart.split("-");
  return `${d}/${m}/${y} às ${timePart}`;
}

export function isValidArticleStatus(status: string): status is ArticleStatus {
  return (ARTICLE_STATUSES as readonly string[]).includes(status);
}
