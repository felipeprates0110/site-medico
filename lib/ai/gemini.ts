import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  OUTLINE_SYSTEM_PROMPT,
  SUGGEST_TOPICS_SYSTEM_PROMPT,
} from "@/lib/ai/prompt-blog";
import {
  outlineSchema,
  parseJsonSafe,
  topicSuggestionSchema,
  type ArticleOutline,
  type TopicSuggestion,
} from "@/lib/ai/parse-article";

const GEMINI_MODEL = "gemini-2.0-flash";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY não configurada. Adicione no .env.local e na Vercel."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

async function generateText(system: string, user: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: system,
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  if (!text?.trim()) {
    throw new Error("Gemini retornou resposta vazia.");
  }
  return text;
}

export async function suggestTopicsWithGemini(input: {
  seed?: string;
  category?: string;
}): Promise<TopicSuggestion[]> {
  const user = [
    "Sugira 8 temas de artigos para o RitmoBlog.",
    input.seed ? `Semente / foco: ${input.seed}` : "Semente: livre (cardiologia e arritmologia).",
    input.category ? `Preferir categoria: ${input.category}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const raw = await generateText(SUGGEST_TOPICS_SYSTEM_PROMPT, user);
  const parsed = parseJsonSafe(raw, topicSuggestionSchema);
  return parsed.topics;
}

export async function buildOutlineWithGemini(input: {
  topic: string;
  keyword?: string;
  categoryHint?: string;
  referencesText: string;
}): Promise<ArticleOutline> {
  const user = [
    `Tema: ${input.topic}`,
    `Palavra-chave: ${input.keyword || input.topic}`,
    `Categoria sugerida: ${input.categoryHint || "a definir"}`,
    "",
    "Referências (texto extraído):",
    input.referencesText,
  ].join("\n");

  const raw = await generateText(OUTLINE_SYSTEM_PROMPT, user);
  return parseJsonSafe(raw, outlineSchema);
}
