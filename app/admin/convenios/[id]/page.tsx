"use client";

import { use, useEffect, useState } from "react";
import { InsuranceForm } from "@/components/admin/insurance-form";
import { InsurancePlan } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditInsurancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/admin/insurance/${id}`);
        if (!response.ok) throw new Error("Falha ao carregar");
        const data = await response.json();
        setPlan(data);
      } catch (error) {
        toast.error("Erro ao carregar convênio");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!plan) {
    return <div>Convênio não encontrado.</div>;
  }

  return <InsuranceForm initialData={plan} />;
}
