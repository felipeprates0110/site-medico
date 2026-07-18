"use client";

import { use, useEffect, useState } from "react";
import { SpecialtyForm } from "@/components/admin/specialty-form";
import { Specialty } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditSpecialtyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialty = async () => {
      try {
        const response = await fetch(`/api/admin/specialties/${id}`);
        if (!response.ok) throw new Error("Falha ao carregar");
        const data = await response.json();
        setSpecialty(data);
      } catch (error) {
        toast.error("Erro ao carregar especialidade");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!specialty) {
    return <div>Especialidade não encontrada.</div>;
  }

  return <SpecialtyForm initialData={specialty} />;
}
