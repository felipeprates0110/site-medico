"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface AddressData {
  id: string;
  clinic_name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
}

const emptyForm: Omit<AddressData, "id"> = {
  clinic_name: "",
  street: "",
  neighborhood: "",
  city: "",
  state: "DF",
  zip: "",
  latitude: null,
  longitude: null,
  is_primary: false,
};

export default function EnderecoPage() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/admin/address");
      if (!response.ok) throw new Error("Falha ao carregar");
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      toast.error("Erro ao carregar endereços");
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      ...emptyForm,
      is_primary: addresses.length === 0,
    });
  };

  const startEdit = (address: AddressData) => {
    setIsCreating(false);
    setEditingId(address.id);
    setFormData({
      clinic_name: address.clinic_name,
      street: address.street,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zip: address.zip,
      latitude: address.latitude,
      longitude: address.longitude,
      is_primary: address.is_primary,
    });
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingId
        ? `/api/admin/address/${editingId}`
        : "/api/admin/address";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Falha ao salvar");

      toast.success(
        editingId
          ? "Endereço atualizado com sucesso"
          : "Endereço criado com sucesso"
      );
      cancelForm();
      await fetchAddresses();
    } catch (error) {
      toast.error("Erro ao salvar endereço");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;

    try {
      const response = await fetch(`/api/admin/address/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir");

      setAddresses(addresses.filter((a) => a.id !== id));
      if (editingId === id) cancelForm();
      toast.success("Endereço excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir endereço");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const showForm = isCreating || editingId !== null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Endereço</h1>
          <p className="text-gray-600">
            Gerencie os consultórios exibidos no site
          </p>
        </div>
        {!showForm && (
          <Button onClick={startCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Endereço
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {editingId ? "Editar Endereço" : "Novo Endereço"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Consultório *
                </label>
                <input
                  type="text"
                  name="clinic_name"
                  required
                  value={formData.clinic_name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Life Centro Cardiológico"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rua / Logradouro *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    required
                    value={formData.neighborhood}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="72405-498"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    maxLength={2}
                    value={formData.state}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent uppercase"
                    placeholder="DF"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                Endereço principal (aparece em destaque no site)
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhum endereço cadastrado ainda.
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {address.clinic_name}
                      </h3>
                      {address.is_primary && (
                        <Badge>Principal</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {address.street}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {address.neighborhood} — {address.city}/{address.state}
                    </p>
                    <p className="text-gray-500 text-sm">CEP {address.zip}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(address)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
