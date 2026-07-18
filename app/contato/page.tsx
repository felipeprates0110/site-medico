import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { siteConfig } from "@/lib/metadata";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contato - Agende sua Consulta",
  description:
    "Entre em contato com o Dr. Pedro Felipe Prates Silva. Telefone, WhatsApp, e-mail e endereço do consultório em Brasília/DF.",
};

export default function ContatoPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
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

      {/* Contact Options */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* WhatsApp */}
            <div className="p-6 rounded-xl border bg-green-50 border-green-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-sm text-gray-600 mb-4">Atendimento rápido e prático</p>
              <WhatsAppButton size="sm" className="w-full" />
            </div>

            {/* Phone */}
            <div className="p-6 rounded-xl border bg-blue-50 border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Telefone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ligue para agendar sua consulta
              </p>
              <Button asChild size="sm" className="w-full">
                <a href={`tel:${siteConfig.doctor.phone}`}>
                  {siteConfig.doctor.phone}
                </a>
              </Button>
            </div>

            {/* Email */}
            <div className="p-6 rounded-xl border bg-purple-50 border-purple-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">E-mail</h3>
              <p className="text-sm text-gray-600 mb-4">Envie sua mensagem</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={`mailto:${siteConfig.doctor.email}`}>Enviar e-mail</a>
              </Button>
            </div>

            {/* Schedule */}
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

      {/* Location Info */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
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
                    <p className="text-gray-600">
                      {siteConfig.doctor.address.clinic}
                    </p>
                    <p className="text-gray-600">
                      {siteConfig.doctor.address.street}
                    </p>
                    <p className="text-gray-600">
                      {siteConfig.doctor.address.neighborhood} -{" "}
                      {siteConfig.doctor.address.city}, {siteConfig.doctor.address.state}
                    </p>
                    <p className="text-gray-600">
                      CEP {siteConfig.doctor.address.zip}
                    </p>
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
                        href={`tel:${siteConfig.doctor.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {siteConfig.doctor.phone}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      E-mail:{" "}
                      <a
                        href={`mailto:${siteConfig.doctor.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {siteConfig.doctor.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative aspect-square lg:aspect-auto rounded-xl bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">Mapa do Google</p>
                  <p className="text-sm">(Integrar Google Maps API)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para agendar?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Entre em contato agora e garanta seu horário
          </p>
          <WhatsAppButton size="lg" className="bg-green-600 hover:bg-green-700" />
        </div>
      </section>
    </div>
  );
}
