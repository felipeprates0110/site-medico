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
import { Treatment } from "@/lib/supabase";

const treatmentSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  short_description: z.string().min(10, "Descrição curta deve ter pelo menos 10 caracteres"),
  description: z.string().min(20, "Descrição completa deve ter pelo menos 20 caracteres"),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
  symptoms: z.array(z.string()).default([]),
  diagnosis: z.array(z.string()).default([]),
  treatment: z.array(z.string()).default([]),
  preventive_care: z.array(z.string()).default([]),
});

type TreatmentFormValues = z.input<typeof treatmentSchema>;

interface TreatmentFormProps {
  initialData?: Treatment;
}

export function TreatmentForm({ initialData }: TreatmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>(initialData?.symptoms || []);
  const [diagnosis, setDiagnosis] = useState<string[]>(initialData?.diagnosis || []);
  const [treatmentSteps, setTreatmentSteps] = useState<string[]>(initialData?.treatment || []);
  const [preventive, setPreventive] = useState<string[]>(initialData?.preventive_care || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      short_description: "",
      description: "",
      display_order: 0,
      is_active: true,
      symptoms: [],
      diagnosis: [],
      treatment: [],
      preventive_care: [],
    },
  });

  const onSubmit = async (values: TreatmentFormValues) => {
    setLoading(true);
    try {
      const url = initialData
        ? `/api/admin/treatments/${initialData.id}`
        : "/api/admin/treatments";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          symptoms,
          diagnosis,
          treatment: treatmentSteps,
          preventive_care: preventive,
        }),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      toast.success(`Tratamento ${initialData ? "atualizado" : "criado"} com sucesso`);
      router.push("/admin/tratamentos");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar tratamento");
    } finally {
      setLoading(false);
    }
  };

  const addField = (setter: any, current: string[]) => setter([...current, ""]);
  const removeField = (setter: any, current: string[], index: number) =>
    setter(current.filter((_, i) => i !== index));
  const updateField = (setter: any, current: string[], index: number, value: string) => {
    const next = [...current];
    next[index] = value;
    setter(next);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Tratamento" : "Novo Tratamento"}
        </h1>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/tratamentos")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Tratamento"}
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
              <Input {...register("title")} placeholder="Ex: Hipertensão Arterial" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input {...register("slug")} placeholder="ex: hipertensao-arterial" />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordem de Exibição</label>
              <Input
                type="number"
                {...register("display_order", { valueAsNumber: true })}
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                {...register("is_active")}
                id="is_active"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Tratamento Ativo
              </label>
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
              {errors.short_description && (
                <p className="text-xs text-red-500">{errors.short_description.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Completa</label>
              <textarea
                {...register("description")}
                className="flex min-h-[150px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                placeholder="Descreva detalhadamente o tratamento..."
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Lists */}
        {[
          { title: "Sintomas", state: symptoms, setter: setSymptoms, placeholder: "Ex: Dor no peito" },
          { title: "Diagnóstico", state: diagnosis, setter: setDiagnosis, placeholder: "Ex: Eletrocardiograma" },
          { title: "Opções de Tratamento", state: treatmentSteps, setter: setTreatmentSteps, placeholder: "Ex: Medicamentos" },
          { title: "Cuidados Preventivos", state: preventive, setter: setPreventive, placeholder: "Ex: Dieta equilibrada" },
        ].map((list, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{list.title}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addField(list.setter, list.state)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {list.state.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateField(list.setter, list.state, index, e.target.value)}
                    placeholder={list.placeholder}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(list.setter, list.state, index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </form>
  );
}
