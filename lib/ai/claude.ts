import Anthropic from "@anthropic-ai/sdk";
import { BLOG_ARTICLE_SYSTEM_PROMPT } from "@/lib/ai/prompt-blog";
import {
  normalizeGeneratedArticle,
  type ArticleOutline,
  type GeneratedArticle,
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

export async function writeArticleWithClaude(input: {
  topic: string;
  keyword?: string;
  categoryHint?: string;
  outline: ArticleOutline;
  referencesText: string;
}): Promise<GeneratedArticle> {
  const client = getAnthropicClient();

  const userPrompt = [
    "Gere o artigo completo em JSON conforme as regras do system prompt.",
    "",
    `Tema: ${input.topic}`,
    `Palavra-chave principal: ${input.keyword || input.outline.keyword || input.topic}`,
    `Categoria sugerida: ${input.categoryHint || input.outline.category_hint || "Cardiologia"}`,
    "",
    "Outline (use como base, mas escreva o artigo completo em HTML):",
    JSON.stringify(input.outline, null, 2),
    "",
    "Referências (use com cuidado; não invente dados):",
    input.referencesText,
  ].join("\n");

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8192,
    system: BLOG_ARTICLE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text" || !textBlock.text.trim()) {
    throw new Error("Claude retornou resposta vazia.");
  }

  return normalizeGeneratedArticle(textBlock.text);
}
