"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Settings, Save, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "A confirmação não confere com a nova senha.",
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "A nova senha deve ter pelo menos 8 caracteres.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar senha");
      }

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({
        type: "success",
        text: "Senha alterada com sucesso!",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao alterar senha. Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">
          Gerencie sua conta e a segurança do painel
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border ${
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Nome</span>
            <span className="font-medium text-gray-900">
              {session?.user?.name || "—"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">E-mail</span>
            <span className="font-medium text-gray-900">
              {session?.user?.email || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Perfil de acesso</span>
            <span className="font-medium text-gray-900 capitalize">
              {session?.user?.role || "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Alterar senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha atual *
              </label>
              <input
                type="password"
                name="currentPassword"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova senha *
              </label>
              <input
                type="password"
                name="newPassword"
                required
                minLength={8}
                value={formData.newPassword}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar nova senha *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
              {isSaving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Alterar Senha
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
