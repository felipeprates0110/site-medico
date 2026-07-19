"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { InsurancePlan } from "@/lib/supabase";

const insuranceSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  category: z.enum(["private", "public", "corporate"]),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

type InsuranceFormValues = z.input<typeof insuranceSchema>;

interface InsuranceFormProps {
  initialData?: InsurancePlan;
}

export function InsuranceForm({ initialData }: InsuranceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InsuranceFormValues>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: initialData || {
      name: "",
      category: "private",
      display_order: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: InsuranceFormValues) => {
    setLoading(true);
    try {
      const url = initialData
        ? `/api/admin/insurance/${initialData.id}`
        : "/api/admin/insurance";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      toast.success(`Convênio ${initialData ? "atualizado" : "criado"} com sucesso`);
      router.push("/admin/convenios");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar convênio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Convênio" : "Novo Convênio"}
        </h1>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/convenios")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Convênio"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Convênio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Convênio</label>
            <Input {...register("name")} placeholder="Ex: Bradesco Saúde" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <select
              {...register("category")}
              className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <option value="private">Particular / Individual</option>
              <option value="public">Público (SUS/Outros)</option>
              <option value="corporate">Empresarial / Coletivo</option>
            </select>
            {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ordem de Exibição</label>
            <Input
              type="number"
              {...register("display_order", { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              {...register("is_active")}
              id="is_active"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Convênio Ativo
            </label>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
