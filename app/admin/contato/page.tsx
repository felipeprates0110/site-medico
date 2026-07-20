"use client";

import { useState, useEffect } from "react";
import { Phone, Save, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactData {
  id: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export default function ContatoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ContactData>({
    id: "",
    phone: "",
    whatsapp: "",
    email: "",
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await fetch("/api/admin/contact");
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error("Erro ao buscar contato:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Contato atualizado com sucesso!",
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao atualizar contato. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contato</h1>
        <p className="text-gray-600">
          Atualize telefone, WhatsApp e e-mail exibidos no site
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="61999999999"
            />
            <p className="text-sm text-gray-500 mt-1">
              Apenas números, com DDD (ex: 61999999999)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              name="whatsapp"
              required
              value={formData.whatsapp}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="5561999999999"
            />
            <p className="text-sm text-gray-500 mt-1">
              Com código do país 55 (ex: 5561999999999)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="contato@exemplo.com.br"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSaving} className="min-w-[150px]">
            {isSaving ? (
              "Salvando..."
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
