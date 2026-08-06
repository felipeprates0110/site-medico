"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WhatsAppButton,
  buildWhatsAppUrl,
} from "@/components/whatsapp-button";
import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { trackEvent } from "@/lib/analytics";
import {
  Phone,
  User,
  Mail,
  FileText,
  CheckCircle,
  Stethoscope,
} from "lucide-react";

interface SegundaOpiniaoFormProps {
  phone: string;
  whatsapp: string;
}

const DIAGNOSTICO_OPTIONS = [
  { value: "fibrilacao-atrial", label: "Fibrilação atrial" },
  { value: "flutter-atrial", label: "Flutter atrial" },
  { value: "indicacao-ablacao", label: "Indicação de ablação" },
  { value: "marca-passo-cdi", label: "Marca-passo / CDI" },
  { value: "outro", label: "Outro" },
] as const;

const WHATSAPP_QUICK_MESSAGE =
  "Olá! Gostaria de solicitar uma segunda opinião em arritmologia. Já tenho diagnóstico/indicação e gostaria de agendar uma avaliação.";

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function labelFromValue(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label || value;
}

export function SegundaOpiniaoForm({ phone, whatsapp }: SegundaOpiniaoFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    diagnostico: "",
    temProposta: "",
    telemedicina: "",
    exames: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const diagnosticoLabel = labelFromValue(
      DIAGNOSTICO_OPTIONS,
      formData.diagnostico
    );

    const lines = [
      "Olá! Solicito uma *segunda opinião* em arritmologia.",
      "",
      `*Nome:* ${formData.name}`,
      `*Telefone:* ${formData.phone}`,
      `*E-mail:* ${formData.email}`,
      `*Diagnóstico/motivo:* ${diagnosticoLabel || "Não informado"}`,
      `*Já tem proposta de procedimento?:* ${formData.temProposta || "Não informado"}`,
      `*Aceita telemedicina?:* ${formData.telemedicina || "Não informado"}`,
    ];

    if (formData.exames.trim()) {
      lines.push(`*Exames disponíveis:* ${formData.exames.trim()}`);
    }
    if (formData.message.trim()) {
      lines.push(`*Mensagem:* ${formData.message.trim()}`);
    }

    lines.push(
      "",
      "_Levarei os exames na consulta ou enviarei após o contato, conforme orientação da equipe._"
    );

    trackEvent("segunda_opiniao_click", { meta: { source: "form" } });

    const url = buildWhatsAppUrl(whatsapp, lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50/50 px-4 py-16">
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Solicitação encaminhada!
          </h3>
          <p className="mx-auto max-w-md text-lg text-gray-600">
            Abrimos o WhatsApp com os seus dados. Se a conversa não abriu,
            use o botão abaixo ou fale conosco pelo telefone.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <WhatsAppButton
              whatsapp={whatsapp}
              message={WHATSAPP_QUICK_MESSAGE}
              analyticsEvent="segunda_opiniao_click"
              analyticsMeta={{ source: "cta_whatsapp_success" }}
            >
              Abrir WhatsApp novamente
            </WhatsAppButton>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  diagnostico: "",
                  temProposta: "",
                  telemedicina: "",
                  exames: "",
                  message: "",
                });
              }}
            >
              Preencher de novo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Contato rápido
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Prefere falar agora? Envie uma mensagem pronta pedindo segunda
            opinião.
          </p>
          <WhatsAppButton
            className="w-full"
            whatsapp={whatsapp}
            message={WHATSAPP_QUICK_MESSAGE}
            analyticsEvent="segunda_opiniao_click"
            analyticsMeta={{ source: "cta_whatsapp" }}
          >
            Solicitar pelo WhatsApp
          </WhatsAppButton>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Telefone</h3>
          <p className="mb-4 text-sm text-gray-600">
            Fale com a equipe para agendar a avaliação
          </p>
          <Button asChild variant="outline" className="w-full">
            <TrackedAnchor event="phone_click" href={telHref(phone)}>
              <Phone className="h-4 w-4" />
              {phone}
            </TrackedAnchor>
          </Button>
        </div>

        <div className="rounded-xl border bg-gray-50 p-6">
          <h3 className="mb-2 text-lg font-bold text-gray-900">Importante</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            O WhatsApp é para agendamento e informações. A segunda opinião é
            uma consulta médica (presencial ou telemedicina), com revisão dos
            exames e discussão individualizada.
          </p>
        </div>
      </div>

      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="so-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nome completo *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="so-name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-primary-600"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="so-phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Telefone/WhatsApp *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="so-phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-primary-600"
                placeholder="(61) 99999-0000"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="so-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              E-mail *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="so-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-primary-600"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="so-diagnostico"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Diagnóstico / motivo *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Stethoscope className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="so-diagnostico"
                name="diagnostico"
                required
                value={formData.diagnostico}
                onChange={handleChange}
                className="block w-full appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Selecione...</option>
                {DIAGNOSTICO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="so-temProposta"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Já tem proposta de procedimento? *
              </label>
              <select
                id="so-temProposta"
                name="temProposta"
                required
                value={formData.temProposta}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Selecione...</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="so-telemedicina"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Aceita telemedicina? *
              </label>
              <select
                id="so-telemedicina"
                name="telemedicina"
                required
                value={formData.telemedicina}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Selecione...</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não (prefiro presencial)</option>
                <option value="Indiferente">Indiferente</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="so-exames"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Exames disponíveis
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Não envie arquivos aqui. Liste o que já tem (ECG, Holter,
              ecocardiograma etc.) — você leva na consulta ou envia depois, por
              canal seguro.
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-3 flex items-start pl-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="so-exames"
                name="exames"
                rows={3}
                value={formData.exames}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-primary-600"
                placeholder="Ex.: ECG, Holter 24h, eco de 2024..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="so-message"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mensagem (opcional)
            </label>
            <textarea
              id="so-message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-600"
              placeholder="Conte brevemente o que gostaria de revisar na segunda opinião..."
            />
          </div>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full">
              Enviar solicitação pelo WhatsApp
            </Button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Ao enviar, você concorda com o tratamento dos dados conforme a
              LGPD. Segunda opinião é uma consulta médica — não substitui
              emergência.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
