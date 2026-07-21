"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/metadata";

interface WhatsAppButtonProps {
  message?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  children?: React.ReactNode;
  /** Número no formato internacional sem + (ex: 5561996270787). Se omitido, usa o do metadata. */
  whatsapp?: string;
}

function buildWhatsAppUrl(whatsapp: string, message: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppButton({
  message = "Olá! Gostaria de agendar uma consulta.",
  variant = "default",
  size = "default",
  className,
  children,
  whatsapp = siteConfig.doctor.whatsapp,
}: WhatsAppButtonProps) {
  const whatsappUrl = buildWhatsAppUrl(whatsapp, message);

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <MessageCircle className="h-5 w-5" />
        {children || "Agendar via WhatsApp"}
      </a>
    </Button>
  );
}

export function FloatingWhatsAppButton({
  whatsapp = siteConfig.doctor.whatsapp,
}: {
  whatsapp?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(
        whatsapp,
        "Olá! Gostaria de agendar uma consulta."
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      aria-label="Enviar mensagem no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
