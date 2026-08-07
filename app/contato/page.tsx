import type { Metadata } from "next";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";
import { siteConfig } from "@/lib/metadata";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getContactInfo, getPrimaryAddress } from "@/lib/data";

export const metadata: Metadata = buildPageMetadata({
  title: "Contato | Agende Consulta em Brasília",
  description:
    "Telefone, WhatsApp e endereço do Dr. Pedro Felipe na IDC Brasília — SHLS 716, Asa Sul/DF. Agende sua consulta de cardiologia ou arritmologia.",
  path: "/contato",
});

export const revalidate = 60;

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

/** Exibe WhatsApp no formato BR: 5561996270787 → (61) 9 9627-0787 */
function formatWhatsAppDisplay(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("55")) {
    const ddd = digits.slice(2, 4);
    const nine = digits.slice(4, 5);
    const part1 = digits.slice(5, 9);
    const part2 = digits.slice(9);
    return `(${ddd}) ${nine} ${part1}-${part2}`;
  }
  return whatsapp;
}

function whatsappHref(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

/**
 * Monta a URL do iframe do Google Maps.
 * Preferimos o embed do estabelecimento (place), porque mostra o pin certo
 * e o cartão com nome, endereço e avaliações — igual ao “Compartilhar > Incorporar mapa”.
 */
function resolveMapsEmbedUrl(options: {
  officialEmbedUrl?: string;
  clinicName: string;
  city: string;
}) {
  if (options.officialEmbedUrl) {
    return options.officialEmbedUrl;
  }

  // Busca pelo nome do lugar (melhor que lat/lng sozinho, que vira um pin genérico)
  const placeQuery = `${options.clinicName}, ${options.city}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(placeQuery)}&hl=pt-BR&z=17&output=embed`;
}

export default async function ContatoPage() {
  const [contact, address] = await Promise.all([
    getContactInfo(),
    getPrimaryAddress(),
  ]);

  const mapsQuery = `${address.clinic_name}, ${address.street}, ${address.neighborhood}, ${address.city}`;
  const mapsLink =
    siteConfig.doctor.address.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const wazeLink = siteConfig.doctor.address.wazeUrl;
  const embedSrc = resolveMapsEmbedUrl({
    officialEmbedUrl: siteConfig.doctor.address.mapsEmbedUrl,
    clinicName: address.clinic_name,
    city: address.city,
  });

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600">
            Estamos prontos para atendê-lo. Escolha a forma de contato mais conveniente.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl border bg-green-50 border-green-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-4">Atendimento rápido e prático</p>
              <WhatsAppButton size="sm" className="w-full" whatsapp={contact.whatsapp} />
            </div>

            <div className="p-6 rounded-xl border bg-blue-50 border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Telefone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ligue para agendar sua consulta
              </p>
              <Button asChild size="sm" className="w-full">
                <TrackedAnchor event="phone_click" href={telHref(contact.phone)}>
                  {contact.phone}
                </TrackedAnchor>
              </Button>
            </div>

            <div className="p-6 rounded-xl border bg-orange-50 border-orange-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Formulário</h3>
              <p className="text-sm text-gray-600 mb-4">Agende online</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <TrackedLink event="agendar_click" href="/agendar">
                  Agendar consulta
                </TrackedLink>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-primary-100 bg-primary-50/60 p-6 md:flex md:items-center md:justify-between md:gap-6">
            <div className="mb-4 flex items-start gap-4 md:mb-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Busca segunda opinião?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Se você já tem diagnóstico ou indicação de procedimento e
                  procura outra opinião ou avaliação, clique no botão ao lado.
                </p>
              </div>
            </div>
            <Button asChild className="w-full shrink-0 md:w-auto">
              <TrackedLink event="segunda_opiniao_click" href="/segunda-opiniao">
                Segunda opinião
              </TrackedLink>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              {/* Logo da clínica (IDC) — abre o perfil do médico no site da IDC */}
              <div className="mb-6">
                <a
                  href={siteConfig.doctor.address.clinicProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir o perfil do Dr. Pedro Felipe no site da IDC Brasília"
                  className="inline-block transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
                >
                  <Image
                    src="/images/logo-idc-brasilia.png"
                    alt="Logo do iDC — Instituto de Doenças Cardiovasculares"
                    width={232}
                    height={74}
                    className="h-14 w-auto max-w-full object-contain sm:h-16"
                    priority
                  />
                </a>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Informações do Consultório
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
                    <p className="text-gray-600">
                      <a
                        href={siteConfig.doctor.address.clinicProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {address.clinic_name}
                      </a>
                    </p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.neighborhood} — {address.city}, {address.state}
                    </p>
                    <p className="text-gray-600">CEP {address.zip}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Consultas presenciais na IDC Brasília — Asa Sul.{" "}
                      <a
                        href={siteConfig.doctor.address.clinicProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Ver perfil no site da IDC
                      </a>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                      >
                        Abrir no Google Maps
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {wazeLink && (
                        <a
                          href={wazeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                        >
                          Abrir no Waze
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Horário de Atendimento
                    </h3>
                    <p className="text-gray-600">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Atendimento com agendamento prévio
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Contato</h3>
                    <p className="text-gray-600">
                      Telefone:{" "}
                      <TrackedAnchor
                        event="phone_click"
                        href={telHref(contact.phone)}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.phone}
                      </TrackedAnchor>
                    </p>
                    <p className="text-gray-600">
                      WhatsApp:{" "}
                      <TrackedAnchor
                        event="whatsapp_click"
                        href={whatsappHref(contact.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {formatWhatsAppDisplay(contact.whatsapp)}
                      </TrackedAnchor>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] lg:min-h-[520px] rounded-xl bg-gray-200 overflow-hidden shadow-sm">
              <iframe
                title={`Mapa — ${address.clinic_name}`}
                src={embedSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-800 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para agendar?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Entre em contato agora e agende sua avaliação
          </p>
          <WhatsAppButton
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            whatsapp={contact.whatsapp}
          />
        </div>
      </section>
    </div>
  );
}
