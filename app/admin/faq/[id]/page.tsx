"use client";

import { use, useEffect, useState } from "react";
import { FAQForm } from "@/components/admin/faq-form";
import { FAQItem } from "@/lib/supabase";
import { toast } from "sonner";

export default function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [item, setItem] = useState<FAQItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/admin/faq/${id}`);
        if (!response.ok) throw new Error("Falha ao carregar");
        const data = await response.json();
        setItem(data);
      } catch (error) {
        toast.error("Erro ao carregar pergunta");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!item) {
    return <div>Pergunta não encontrada.</div>;
  }

  return <FAQForm initialData={item} />;
}
