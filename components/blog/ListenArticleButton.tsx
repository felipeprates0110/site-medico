"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SpeakStatus = "idle" | "playing" | "paused" | "unsupported";

type ListenArticleButtonProps = {
  title: string;
  /** Texto puro do artigo (sem HTML). */
  text: string;
  className?: string;
};

/** Parte o texto em pedaços curtos — navegadores engasgam com textos muito longos de uma vez. */
function chunkForSpeech(text: string, maxLen = 220): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const sentences = normalized.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || [
    normalized,
  ];
  const chunks: string[] = [];
  let buffer = "";

  for (const sentence of sentences) {
    const piece = sentence.trim();
    if (!piece) continue;
    if ((buffer + " " + piece).trim().length <= maxLen) {
      buffer = (buffer + " " + piece).trim();
    } else {
      if (buffer) chunks.push(buffer);
      if (piece.length <= maxLen) {
        buffer = piece;
      } else {
        // Frase enorme: corta por palavras
        const words = piece.split(" ");
        let slice = "";
        for (const word of words) {
          if ((slice + " " + word).trim().length > maxLen) {
            if (slice) chunks.push(slice.trim());
            slice = word;
          } else {
            slice = (slice + " " + word).trim();
          }
        }
        buffer = slice;
      }
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

function pickPortugueseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase() === "pt-br") ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("pt")) ||
    null
  );
}

/**
 * Botão "Ouvir artigo" usando a voz do navegador (Web Speech API).
 * Analogia: o celular vira um locutor que lê o texto em voz alta.
 */
export function ListenArticleButton({
  title,
  text,
  className,
}: ListenArticleButtonProps) {
  const [status, setStatus] = useState<SpeakStatus>("idle");
  const [supported, setSupported] = useState(true);
  const chunkIndexRef = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined";
    setSupported(ok);
    if (!ok) {
      setStatus("unsupported");
      return;
    }

    const loadVoices = () => {
      voiceRef.current = pickPortugueseVoice();
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const fullScript = [title, text].filter(Boolean).join(". ");

  const speakFrom = (startIndex: number) => {
    if (!supported || !fullScript.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    chunksRef.current = chunkForSpeech(fullScript);
    chunkIndexRef.current = startIndex;
    voiceRef.current = pickPortugueseVoice() || voiceRef.current;

    const speakNext = () => {
      const chunks = chunksRef.current;
      const i = chunkIndexRef.current;
      if (i >= chunks.length) {
        setStatus("idle");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[i]);
      utterance.lang = "pt-BR";
      utterance.rate = 1;
      utterance.pitch = 1;
      if (voiceRef.current) utterance.voice = voiceRef.current;

      utterance.onend = () => {
        chunkIndexRef.current += 1;
        speakNext();
      };
      utterance.onerror = () => {
        setStatus("idle");
      };

      setStatus("playing");
      synth.speak(utterance);
    };

    speakNext();
  };

  const handlePlay = () => {
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }
    speakFrom(0);
  };

  const handlePause = () => {
    if (status !== "playing") return;
    window.speechSynthesis.pause();
    setStatus("paused");
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    chunkIndexRef.current = 0;
    setStatus("idle");
  };

  if (!supported || status === "unsupported") {
    return (
      <p
        className={cn("text-xs text-gray-500", className)}
        role="status"
      >
        Seu navegador não suporta leitura em voz alta. No celular, o leitor de
        tela do sistema também pode ler esta página.
      </p>
    );
  }

  if (!fullScript.trim()) return null;

  const isActive = status === "playing" || status === "paused";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 md:justify-start",
        className
      )}
    >
      <div
        className="inline-flex items-center gap-1.5 rounded-xl border border-primary-100 bg-primary-50/60 p-1"
        role="group"
        aria-label="Controles de leitura em voz alta"
      >
        {!isActive ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-9 gap-1.5 px-3 text-primary-800 hover:bg-white hover:text-primary-900"
            onClick={handlePlay}
            aria-label="Ouvir artigo em voz alta"
          >
            <Volume2 className="h-4 w-4" aria-hidden />
            Ouvir artigo
          </Button>
        ) : (
          <>
            {status === "playing" ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-9 gap-1.5 px-3 text-primary-800 hover:bg-white"
                onClick={handlePause}
                aria-label="Pausar leitura"
              >
                <Pause className="h-4 w-4" aria-hidden />
                Pausar
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-9 gap-1.5 px-3 text-primary-800 hover:bg-white"
                onClick={handlePlay}
                aria-label="Continuar leitura"
              >
                <Play className="h-4 w-4" aria-hidden />
                Continuar
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 gap-1.5 px-3 text-gray-600 hover:bg-white"
              onClick={handleStop}
              aria-label="Parar leitura"
            >
              <Square className="h-3.5 w-3.5" aria-hidden />
              Parar
            </Button>
          </>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {status === "playing"
          ? "Lendo o artigo em voz alta"
          : status === "paused"
            ? "Leitura pausada"
            : "Leitura parada"}
      </span>
      {isActive && (
        <span className="text-xs text-gray-500" aria-hidden>
          {status === "playing" ? "Lendo…" : "Pausado"}
        </span>
      )}
    </div>
  );
}
