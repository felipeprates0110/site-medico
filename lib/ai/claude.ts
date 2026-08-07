import Anthropic from "@anthropic-ai/sdk";
import {
  BLOG_ARTICLE_SYSTEM_PROMPT,
  SUGGEST_TOPICS_SYSTEM_PROMPT,
} from "@/lib/ai/prompt-blog";
import {
  normalizeGeneratedArticle,
  parseJsonSafe,
  topicSuggestionSchema,
  type ArticleOutline,
  type GeneratedArticle,
  type TopicSuggestion,
} from "@/lib/ai/parse-article";

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY não configurada. Adicione no .env.local e na Vercel."
    );
  }
  return new Anthropic({ apiKey });
}

async function claudeText(
  system: string,
  user: string,
  maxTokens = 8192
): Promise<string> {
  const client = getAnthropicClient();
  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text" || !textBlock.text.trim()) {
    throw new Error("Claude retornou resposta vazia.");
  }
  return textBlock.text;
}

export async function suggestTopicsWithClaude(input: {
  seed?: string;
  category?: string;
}): Promise<TopicSuggestion[]> {
  const user = [
    "Sugira 8 temas de artigos para o RitmoBlog.",
    input.seed
      ? `Semente / foco: ${input.seed}`
      : "Semente: livre (cardiologia e arritmologia).",
    input.category ? `Preferir categoria: ${input.category}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await claudeText(SUGGEST_TOPICS_SYSTEM_PROMPT, user, 2048);
  const parsed = parseJsonSafe(raw, topicSuggestionSchema);
  return parsed.topics;
}

export async function writeArticleWithClaude(input: {
  topic: string;
  keyword?: string;
  categoryHint?: string;
  outline?: ArticleOutline;
  referencesText: string;
}): Promise<GeneratedArticle> {
  const userPrompt = [
    "Gere o artigo completo em JSON conforme as regras do system prompt.",
    "Monte mentalmente a estrutura (intro, seções H2, FAQ, quando procurar, CTA, disclaimer) e entregue o artigo pronto.",
    "",
    `Tema: ${input.topic}`,
    `Palavra-chave principal: ${input.keyword || input.outline?.keyword || input.topic}`,
    `Categoria sugerida: ${input.categoryHint || input.outline?.category_hint || "Cardiologia"}`,
    "",
    input.outline
      ? `Outline opcional (use como base se fizer sentido):\n${JSON.stringify(input.outline, null, 2)}`
      : "Não há outline prévio — crie a estrutura completa você mesmo.",
    "",
    "Referências (use com cuidado; não invente dados):",
    input.referencesText,
  ].join("\n");

  const raw = await claudeText(BLOG_ARTICLE_SYSTEM_PROMPT, userPrompt, 8192);
  return normalizeGeneratedArticle(raw);
}
