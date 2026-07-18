"use client";

import { use, useEffect, useState } from "react";
import { TreatmentForm } from "@/components/admin/treatment-form";
import { Treatment } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await fetch(`/api/admin/treatments/${id}`);
        if (!response.ok) throw new Error("Falha ao carregar");
        const data = await response.json();
        setTreatment(data);
      } catch (error) {
        toast.error("Erro ao carregar tratamento");
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!treatment) {
    return <div>Tratamento não encontrado.</div>;
  }

  return <TreatmentForm initialData={treatment} />;
}
