import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/lib/metadata";
import { getContactInfo, getPrimaryAddress } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contato - Agende sua Consulta",
  description:
    "Entre em contato com o Dr. Pedro Felipe Prates Silva. Telefone, WhatsApp, e-mail e endereço do consultório na IDC Brasília — Asa Sul/DF.",
};

export const revalidate = 60;

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <a href={telHref(contact.phone)}>{contact.phone}</a>
              </Button>
            </div>

            <div className="p-6 rounded-xl border bg-purple-50 border-purple-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">E-mail</h3>
              <p className="text-sm text-gray-600 mb-4">Envie sua mensagem</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={`mailto:${contact.email}`}>Enviar e-mail</a>
              </Button>
            </div>

            <div className="p-6 rounded-xl border bg-orange-50 border-orange-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Formulário</h3>
              <p className="text-sm text-gray-600 mb-4">Agende online</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/agendar">Agendar consulta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
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
                    <p className="text-gray-600">{address.clinic_name}</p>
                    <p className="text-gray-600">{address.street}</p>
                    <p className="text-gray-600">
                      {address.neighborhood} — {address.city}, {address.state}
                    </p>
                    <p className="text-gray-600">CEP {address.zip}</p>
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
                      <a
                        href={telHref(contact.phone)}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      E-mail:{" "}
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
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

      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para agendar?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato agora e garanta seu horário
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
