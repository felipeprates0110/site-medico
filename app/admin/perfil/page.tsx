"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Save, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileData {
  id: string;
  doctor_name: string;
  doctor_crm: string;
  doctor_rqe: string[];
  specialty: string;
  subspecialty: string;
  bio: string;
  profile_photo_url: string | null;
}

export default function PerfilPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    doctor_name: "",
    doctor_crm: "",
    doctor_rqe: [],
    specialty: "",
    subspecialty: "",
    bio: "",
    profile_photo_url: null,
  });

  // Buscar dados do perfil
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile");
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Perfil atualizado com sucesso!",
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao atualizar perfil. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRQEChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rqes = e.target.value.split(",").map((r) => r.trim());
    setFormData((prev) => ({
      ...prev,
      doctor_rqe: rqes,
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Perfil
        </h1>
        <p className="text-gray-600">
          Atualize suas informações profissionais
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
        {/* Foto de Perfil */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Foto de Perfil
          </h2>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {formData.doctor_name?.charAt(0) || "D"}
            </div>
            <div>
              <Button type="button" variant="outline">
                Alterar Foto
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                JPG, PNG ou GIF. Máximo 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Informações Pessoais
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="doctor_name"
              required
              value={formData.doctor_name}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CRM *
              </label>
              <input
                type="text"
                name="doctor_crm"
                required
                value={formData.doctor_crm}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="CRM DF 18951"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RQEs (separados por vírgula)
              </label>
              <input
                type="text"
                value={formData.doctor_rqe.join(", ")}
                onChange={handleRQEChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="16475, 16476"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidade Principal
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Cardiologia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subespecialidade
              </label>
              <input
                type="text"
                name="subspecialty"
                value={formData.subspecialty}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Eletrofisiologia Clínica e Invasiva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografia
            </label>
            <textarea
              name="bio"
              rows={6}
              value={formData.bio}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Conte um pouco sobre sua formação e experiência..."
            />
          </div>
        </div>

        {/* Actions */}
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
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
