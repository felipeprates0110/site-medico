const MAX_URLS = 5;
const MAX_CHARS_PER_URL = 4000;
const FETCH_TIMEOUT_MS = 8000;

export type ReferenceSnippet = {
  url: string;
  text: string;
  error?: string;
};

function isAllowedUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchOne(url: string): Promise<ReferenceSnippet> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        "User-Agent": "RitmoBlogBot/1.0 (+https://site-medico-nine.vercel.app)",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return { url, text: "", error: `HTTP ${res.status}` };
    }

    const contentType = res.headers.get("content-type") || "";
    const body = await res.text();
    const text = contentType.includes("html")
      ? stripHtmlToText(body)
      : body.replace(/\s+/g, " ").trim();

    return {
      url,
      text: text.slice(0, MAX_CHARS_PER_URL),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao buscar URL";
    return { url, text: "", error: message };
  } finally {
    clearTimeout(timer);
  }
}

/** Busca e resume texto das URLs de referência (seguro para o servidor). */
export async function fetchReferenceSnippets(
  urls: string[]
): Promise<ReferenceSnippet[]> {
  const unique = Array.from(
    new Set(
      urls
        .map((u) => u.trim())
        .filter((u) => u.length > 0 && isAllowedUrl(u))
    )
  ).slice(0, MAX_URLS);

  if (unique.length === 0) return [];

  return Promise.all(unique.map(fetchOne));
}

export function formatReferencesForPrompt(refs: ReferenceSnippet[]): string {
  if (refs.length === 0) return "Nenhuma referência fornecida.";

  return refs
    .map((r, i) => {
      if (r.error || !r.text) {
        return `[Ref ${i + 1}] ${r.url}\n(Indisponível: ${r.error || "sem texto"})`;
      }
      return `[Ref ${i + 1}] ${r.url}\n${r.text}`;
    })
    .join("\n\n---\n\n");
}
