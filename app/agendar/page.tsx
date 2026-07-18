"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Phone, Calendar, User, Mail, FileText, CheckCircle } from "lucide-react";

export default function AgendarPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    convenio: "",
    preferredDate: "",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você integraria com um backend ou serviço de email
    console.log("Form data:", formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Solicitação Enviada!
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Recebemos sua solicitação de agendamento. Entraremos em contato em breve
            para confirmar o horário.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Agende sua Consulta
          </h1>
          <p className="text-xl text-gray-600">
            Preencha o formulário abaixo ou utilize o WhatsApp para agendamento rápido
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Quick Contact */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-xl border bg-green-50 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Agendamento Rápido
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Para agendamento imediato, entre em contato via WhatsApp
                </p>
                <WhatsAppButton className="w-full" />
              </div>

              <div className="p-6 rounded-xl border bg-blue-50 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Ligue Agora
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Fale diretamente com nossa equipe
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="tel:61999999999">
                    <Phone className="h-4 w-4" />
                    (61) 99999-9999
                  </a>
                </Button>
              </div>

              <div className="p-6 rounded-xl border bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Horário de Atendimento
                </h3>
                <p className="text-sm text-gray-600">
                  Segunda a Sexta
                  <br />
                  8h às 18h
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Telefone/WhatsApp *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="(61) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    E-mail *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="convenio"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Convênio
                  </label>
                  <select
                    id="convenio"
                    name="convenio"
                    value={formData.convenio}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="particular">Particular</option>
                    <option value="camed">Camed</option>
                    <option value="unimed">Unimed</option>
                    <option value="amil">Amil</option>
                    <option value="bradesco">Bradesco Saúde</option>
                    <option value="sulamerica">SulAmérica</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="preferredDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Data Preferencial
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mensagem (opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Informações adicionais sobre sua consulta..."
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full">
                    Enviar Solicitação de Agendamento
                  </Button>
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    Ao enviar este formulário, você concorda com nossa Política de
                    Privacidade e com o tratamento de seus dados conforme a LGPD.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
