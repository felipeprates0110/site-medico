"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  WhatsAppButton,
  buildWhatsAppUrl,
} from "@/components/whatsapp-button";
import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { trackEvent } from "@/lib/analytics";
import { MapPin, Phone, User, Mail, CheckCircle, Stethoscope } from "lucide-react";

interface SegundaOpiniaoFormProps {
  phone: string;
  whatsapp: string;
  clinicName: string;
  clinicStreet: string;
  clinicNeighborhood: string;
  clinicCity: string;
  clinicState: string;
}

const DIAGNOSTICO_OPTIONS = [
  { value: "fibrilacao-atrial", label: "Fibrilação atrial" },
  { value: "flutter-atrial", label: "Flutter atrial" },
  { value: "indicacao-ablacao", label: "Indicação de ablação" },
  { value: "marca-passo-cdi", label: "Marca-passo / CDI" },
  { value: "outro", label: "Outro" },
] as const;

const WHATSAPP_QUICK_MESSAGE =
  "Olá! Gostaria de solicitar uma segunda opinião em arritmologia. Já tenho diagnóstico/indicação e gostaria de agendar uma avaliação presencial na IDC.";

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function labelFromValue(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label || value;
}

export function SegundaOpiniaoForm({
  phone,
  whatsapp,
  clinicName,
  clinicStreet,
  clinicNeighborhood,
  clinicCity,
  clinicState,
}: SegundaOpiniaoFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    diagnostico: "",
    temProposta: "",
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
      "Olá! Solicito uma *segunda opinião* em arritmologia (presencial na IDC).",
      "",
      `*Nome:* ${formData.name}`,
      `*Telefone:* ${formData.phone}`,
      `*E-mail:* ${formData.email}`,
      `*Diagnóstico/motivo:* ${diagnosticoLabel || "Não informado"}`,
      `*Já tem proposta de procedimento?:* ${formData.temProposta || "Não informado"}`,
    ];

    if (formData.message.trim()) {
      lines.push(`*Mensagem:* ${formData.message.trim()}`);
    }

    trackEvent("segunda_opiniao_click", { meta: { source: "form" } });

    const url = buildWhatsAppUrl(whatsapp, lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[32vh] flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50/50 px-4 py-12">
        <div className="text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">
            Solicitação encaminhada!
          </h3>
          <p className="mx-auto max-w-md text-gray-600">
            Abrimos o WhatsApp com os seus dados. Se a conversa não abriu, use o
            botão abaixo.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
        {/* Clínica presencial — IDC */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <a
            href="https://idcbrasilia.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir o site da IDC Brasília"
            className="mb-4 inline-block rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            <Image
              src="/images/logo-idc-brasilia.png"
              alt="Logo do iDC — Instituto de Doenças Cardiovasculares"
              width={232}
              height={74}
              className="h-12 w-auto max-w-full object-contain sm:h-14"
            />
          </a>
          <p className="mb-3 text-sm font-semibold text-gray-900">
            Consulta presencial na IDC Brasília
          </p>
          <div className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            <div>
              <p>{clinicName}</p>
              <p>{clinicStreet}</p>
              <p>
                {clinicNeighborhood} — {clinicCity}, {clinicState}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h3 className="mb-2 text-lg font-bold text-gray-900">
            Contato rápido
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Prefere falar agora? Envie uma mensagem pronta.
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
          <h3 className="mb-2 text-lg font-bold text-gray-900">Telefone</h3>
          <Button asChild variant="outline" className="w-full">
            <TrackedAnchor event="phone_click" href={telHref(phone)}>
              <Phone className="h-4 w-4" />
              {phone}
            </TrackedAnchor>
          </Button>
        </div>
      </div>

      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="grid gap-5 sm:grid-cols-2">
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
              placeholder="O que gostaria de revisar? (exames você leva na consulta)"
            />
          </div>

          <div className="pt-1">
            <Button type="submit" size="lg" className="w-full">
              Enviar solicitação pelo WhatsApp
            </Button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Ao enviar, você concorda com o tratamento dos dados conforme a
              LGPD. A consulta é presencial na IDC Brasília.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
