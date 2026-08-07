import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getBrazilNowParts } from "@/lib/blog-calendar";

type SiteEventRow = {
  event_name: string;
  path: string;
  session_id: string | null;
  created_at: string;
};

/** Dia civil em Brasília (YYYY-MM-DD), para o gráfico bater com o relógio do consultório. */
function brazilDayKey(iso: string) {
  return getBrazilNowParts(new Date(iso)).dateStr;
}

/** Meia-noite de Brasília (N dias atrás) em ISO UTC, para filtrar no banco. */
function brazilStartOfDayUTC(daysAgo: number) {
  const parts = getBrazilNowParts();
  // Monta "hoje 00:00" em Brasília e recua N dias
  const asUtc = new Date(
    `${parts.dateStr}T00:00:00-03:00`
  );
  asUtc.setUTCDate(asUtc.getUTCDate() - daysAgo);
  return asUtc.toISOString();
}

function addBrazilDays(dateStr: string, offset: number) {
  const d = new Date(`${dateStr}T12:00:00-03:00`);
  d.setUTCDate(d.getUTCDate() + offset);
  return getBrazilNowParts(d).dateStr;
}

/**
 * Resumo de acessos para o dashboard Admin.
 * Query: ?days=7 (padrão) ou ?days=30
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawDays = Number(searchParams.get("days") || "7");
  const days = [7, 30].includes(rawDays) ? rawDays : 7;

  const sinceISO = brazilStartOfDayUTC(days - 1);
  const todayBR = getBrazilNowParts().dateStr;
  const firstDayBR = addBrazilDays(todayBR, -(days - 1));

  const { data, error } = await supabaseAdmin
    .from("site_events")
    .select("event_name, path, session_id, created_at")
    .gte("created_at", sinceISO)
    .order("created_at", { ascending: true })
    .limit(20000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events = (data || []) as SiteEventRow[];

  const pageViews = events.filter((e) => e.event_name === "page_view");
  const uniqueVisitors = new Set(
    pageViews.map((e) => e.session_id).filter(Boolean) as string[]
  ).size;

  const countByName = (name: string) =>
    events.filter((e) => e.event_name === name).length;

  // Top páginas (só page_view)
  const pageCount = new Map<string, number>();
  for (const ev of pageViews) {
    const path = ev.path || "/";
    pageCount.set(path, (pageCount.get(path) || 0) + 1);
  }
  const topPages = [...pageCount.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Série diária no fuso de Brasília
  const dailyMap = new Map<
    string,
    { date: string; views: number; visitors: Set<string> }
  >();

  for (let i = 0; i < days; i++) {
    const key = addBrazilDays(firstDayBR, i);
    dailyMap.set(key, { date: key, views: 0, visitors: new Set() });
  }

  for (const ev of pageViews) {
    const key = brazilDayKey(ev.created_at);
    const bucket = dailyMap.get(key);
    if (!bucket) continue;
    bucket.views += 1;
    if (ev.session_id) bucket.visitors.add(ev.session_id);
  }

  const daily = [...dailyMap.values()].map((d) => ({
    date: d.date,
    views: d.views,
    visitors: d.visitors.size,
  }));

  return NextResponse.json({
    days,
    since: sinceISO,
    pageViews: pageViews.length,
    uniqueVisitors,
    whatsappClicks: countByName("whatsapp_click"),
    agendarClicks: countByName("agendar_click"),
    segundaOpiniaoClicks: countByName("segunda_opiniao_click"),
    phoneClicks: countByName("phone_click"),
    emailClicks: countByName("email_click"),
    topPages,
    daily,
  });
}
