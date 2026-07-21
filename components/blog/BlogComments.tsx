"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type PublicBlogComment = {
  id: string;
  author_name: string;
  content: string;
  doctor_reply: string | null;
  replied_at: string | null;
  created_at: string;
};

type BlogCommentsProps = {
  articleId: string;
  doctorName: string;
  initialComments: PublicBlogComment[];
};

/**
 * Área de interação do artigo: lista comentários aprovados + formulário de dúvida.
 * Analogia: é o "livro de visitas" daquele post — só entra o que o médico liberou.
 */
export function BlogComments({
  articleId,
  doctorName,
  initialComments,
}: BlogCommentsProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState(""); // honeypot anti-spam
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          authorName,
          authorEmail,
          content,
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao enviar.");
      }

      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      setFeedback({
        type: "success",
        message:
          data.message ||
          "Recebemos sua mensagem! Ela será publicada após revisão.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível enviar. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="comentarios"
      className="mt-16 border-t border-gray-200 pt-12"
      aria-labelledby="comentarios-titulo"
    >
      <h2
        id="comentarios-titulo"
        className="mb-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl"
      >
        Tem alguma dúvida sobre este tema?
      </h2>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-600">
        Deixe sua pergunta abaixo. Quando possível, {doctorName} responde por
        aqui. Este espaço é educativo e{" "}
        <strong className="font-semibold text-gray-800">
          não substitui consulta médica
        </strong>
        . Em emergência, procure Pronto-Socorro ou ligue 192 (SAMU).
      </p>

      {initialComments.length > 0 ? (
        <ul className="mb-10 space-y-6">
          {initialComments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-semibold text-gray-900">
                  {comment.author_name}
                </span>
                <time
                  className="text-xs text-gray-400"
                  dateTime={comment.created_at}
                >
                  {new Date(comment.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {comment.content}
              </p>

              {comment.doctor_reply && (
                <div className="mt-4 rounded-lg border-l-4 border-primary-600 bg-primary-50/60 px-4 py-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary-700">
                    Resposta de {doctorName}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                    {comment.doctor_reply}
                  </p>
                  {comment.replied_at && (
                    <time
                      className="mt-2 block text-xs text-gray-400"
                      dateTime={comment.replied_at}
                    >
                      {new Date(comment.replied_at).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </time>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-10 text-sm text-gray-500">
          Ainda não há perguntas publicadas neste artigo. Seja o primeiro a
          perguntar.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-gray-200 bg-gray-50/80 p-6 md:p-8"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Enviar sua pergunta
        </h3>

        {/* Campo armadilha para bots — fica invisível */}
        <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="comment-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Seu nome *
            </label>
            <Input
              id="comment-name"
              required
              minLength={2}
              maxLength={80}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Como prefere ser chamado"
              disabled={submitting}
            />
          </div>
          <div>
            <label
              htmlFor="comment-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              E-mail{" "}
              <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <Input
              id="comment-email"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="Para avisar quando houver resposta"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment-content"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Sua dúvida *
          </label>
          <Textarea
            id="comment-content"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descreva sua dúvida de forma clara..."
            disabled={submitting}
            className="min-h-[120px] resize-y"
          />
          <p className="mt-1 text-xs text-gray-400">
            {content.length}/2000 caracteres
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
            role="status"
          >
            {feedback.message}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Enviando..." : "Enviar pergunta"}
        </Button>
      </form>
    </section>
  );
}
