"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import {
  Phone,
  Calendar,
  User,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";

interface InsuranceOption {
  id: string;
  name: string;
}

interface AgendarFormProps {
  phone: string;
  whatsapp: string;
  insurancePlans: InsuranceOption[];
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

export function AgendarForm({
  phone,
  whatsapp,
  insurancePlans,
}: AgendarFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    convenio: "",
    preferredDate: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const sortedPlans = insurancePlans
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        convenio: "",
        preferredDate: "",
        message: "",
      });
    }, 3000);
  };

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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 px-4 py-16">
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Solicitação Enviada!
          </h1>
          <p className="max-w-md text-lg text-gray-600">
            Recebemos sua solicitação de agendamento. Entraremos em contato em
            breve para confirmar o horário.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Contato rápido — mesmos dados da página Contato */}
      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Agendamento Rápido
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Para agendamento imediato, entre em contato via WhatsApp
          </p>
          <WhatsAppButton className="w-full" whatsapp={whatsapp} />
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Ligue Agora</h3>
          <p className="mb-4 text-sm text-gray-600">
            Fale diretamente com nossa equipe
          </p>
          <Button asChild variant="outline" className="w-full">
            <a href={telHref(phone)}>
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </Button>
        </div>

        <div className="rounded-xl border bg-gray-50 p-6">
          <h3 className="mb-2 text-lg font-bold text-gray-900">
            Horário de Atendimento
          </h3>
          <p className="text-sm text-gray-600">
            Segunda a Sexta
            <br />
            8h às 18h
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nome Completo *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
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
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                placeholder="(61) 99999-0000"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
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
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="convenio"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Convênio
            </label>
            <select
              id="convenio"
              name="convenio"
              value={formData.convenio}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Selecione...</option>
              {sortedPlans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name}
                </option>
              ))}
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="preferredDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Data Preferencial
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mensagem (opcional)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-3 flex items-start pl-3">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                placeholder="Informações adicionais sobre sua consulta..."
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full">
              Enviar Solicitação de Agendamento
            </Button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Ao enviar este formulário, você concorda com nossa Política de
              Privacidade e com o tratamento de seus dados conforme a LGPD.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
