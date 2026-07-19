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
import { FAQItem } from "@/lib/supabase";

const faqSchema = z.object({
  question: z.string().min(5, "Pergunta deve ter pelo menos 5 caracteres"),
  answer: z.string().min(10, "Resposta deve ter pelo menos 10 caracteres"),
  category: z.enum(["geral", "agendamento", "convenios", "tratamentos"]),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

type FAQFormValues = z.input<typeof faqSchema>;

interface FAQFormProps {
  initialData?: FAQItem;
}

export function FAQForm({ initialData }: FAQFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: initialData || {
      question: "",
      answer: "",
      category: "geral",
      display_order: 0,
      is_active: true,
    },
  });

  const onSubmit = async (values: FAQFormValues) => {
    setLoading(true);
    try {
      const url = initialData
        ? `/api/admin/faq/${initialData.id}`
        : "/api/admin/faq";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      toast.success(`Pergunta ${initialData ? "atualizada" : "criada"} com sucesso`);
      router.push("/admin/faq");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar pergunta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Editar Pergunta" : "Nova Pergunta"}
        </h1>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/faq")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Pergunta"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pergunta</label>
            <Input {...register("question")} placeholder="Ex: Quais convênios são aceitos?" />
            {errors.question && <p className="text-xs text-red-500">{errors.question.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resposta</label>
            <textarea
              {...register("answer")}
              className="flex min-h-[150px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              placeholder="Forneça uma resposta clara e objetiva..."
            />
            {errors.answer && <p className="text-xs text-red-500">{errors.answer.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <select
                {...register("category")}
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                <option value="geral">Geral</option>
                <option value="agendamento">Agendamento</option>
                <option value="convenios">Convênios</option>
                <option value="tratamentos">Tratamentos</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordem de Exibição</label>
              <Input
                type="number"
                {...register("display_order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              {...register("is_active")}
              id="is_active"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Pergunta Ativa
            </label>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
