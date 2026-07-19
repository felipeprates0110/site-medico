"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Specialty } from "@/lib/supabase";

const specialtySchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  short_description: z.string().min(10, "Descrição curta deve ter pelo menos 10 caracteres"),
  description: z.string().min(20, "Descrição completa deve ter pelo menos 20 caracteres"),
  icon: z.string().default("heart"),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
  benefits: z.array(z.string()).default([]),
  common_conditions: z.array(z.string()).default([]),
});

type SpecialtyFormValues = z.input<typeof specialtySchema>;

interface SpecialtyFormProps {
  initialData?: Specialty;
}

export function SpecialtyForm({ initialData }: SpecialtyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || []);
  const [conditions, setConditions] = useState<string[]>(initialData?.common_conditions || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SpecialtyFormValues>({
    resolver: zodResolver(specialtySchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      short_description: "",
      description: "",
      icon: "heart",
      display_order: 0,
      is_active: true,
      benefits: [],
      common_conditions: [],
    },
  });

  const onSubmit = async (values: SpecialtyFormValues) => {
    setLoading(true);
    try {
      const url = initialData
        ? `/api/admin/specialties/${initialData.id}`
        : "/api/admin/specialties";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, benefits, common_conditions: conditions }),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      toast.success(`Especialidade ${initialData ? "atualizada" : "criada"} com sucesso`);
      router.push("/admin/especialidades");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar especialidade");
    } finally {
      setLoading(false);
    }
  };

  const addBenefit = () => setBenefits([...benefits, ""]);
  const removeBenefit = (index: number) => setBenefits(benefits.filter((_, i) => i !== index));
  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const addCondition = () => setConditions([...conditions, ""]);
  const removeCondition = (index: number) => setConditions(conditions.filter((_, i) => i !== index));
  const updateCondition = (index: number, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = value;
    setConditions(newConditions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Especialidade" : "Nova Especialidade"}
        </h1>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/especialidades")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Especialidade"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input {...register("title")} placeholder="Ex: Cardiologia Geral" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input {...register("slug")} placeholder="ex: cardiologia-geral" />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ícone (Lucide name)</label>
              <Input {...register("icon")} placeholder="Ex: heart, activity, user" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordem de Exibição</label>
              <Input
                type="number"
                {...register("display_order", { valueAsNumber: true })}
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input type="checkbox" {...register("is_active")} id="is_active" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
              <label htmlFor="is_active" className="text-sm font-medium">Especialidade Ativa</label>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Descrições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Curta (para cards)</label>
              <Input {...register("short_description")} placeholder="Uma breve descrição..." />
              {errors.short_description && <p className="text-xs text-red-500">{errors.short_description.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Completa</label>
              <textarea
                {...register("description")}
                className="flex min-h-[150px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                placeholder="Descreva detalhadamente a especialidade..."
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Benefícios / Diferenciais</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={addBenefit}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder="Ex: Check-up completo"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBenefit(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Condições Tratadas</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={addCondition}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={condition}
                  onChange={(e) => updateCondition(index, e.target.value)}
                  placeholder="Ex: Hipertensão"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
