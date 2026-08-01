import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

type SiteEventRow = {
  event_name: string;
  path: string;
  session_id: string | null;
  created_at: string;
};

function startOfDayISO(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
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

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  const sinceISO = startOfDayISO(since);

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

  // Série diária
  const dailyMap = new Map<
    string,
    { date: string; views: number; visitors: Set<string> }
  >();

  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, { date: key, views: 0, visitors: new Set() });
  }

  for (const ev of pageViews) {
    const key = dayKey(ev.created_at);
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
    phoneClicks: countByName("phone_click"),
    emailClicks: countByName("email_click"),
    topPages,
    daily,
    vercelAnalyticsHint:
      "Visitas detalhadas também aparecem em Vercel → Analytics (após o deploy).",
  });
}
