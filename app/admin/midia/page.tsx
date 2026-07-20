"use client";

import { useState, useEffect, useRef } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  type: "profile" | "clinic" | "procedure" | "other";
  url: string;
  alt_text: string | null;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
}

const typeLabels: Record<MediaItem["type"], string> = {
  profile: "Perfil",
  clinic: "Consultório",
  procedure: "Procedimento",
  other: "Outro",
};

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MidiaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<MediaItem["type"]>("other");
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/admin/media");
      if (!response.ok) throw new Error("Falha ao carregar");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast.error("Erro ao carregar mídias");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", mediaType);
      formData.append("alt_text", altText);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha no upload");
      }

      setItems((prev) => [data, ...prev]);
      setAltText("");
      toast.success("Imagem enviada com sucesso");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar imagem"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir");

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Imagem excluída");
    } catch (error) {
      toast.error("Erro ao excluir imagem");
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copiada");
    } catch {
      toast.error("Não foi possível copiar a URL");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mídia</h1>
        <p className="text-gray-600">
          Envie e gerencie fotos do site (perfil, consultório, etc.)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enviar nova imagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={mediaType}
                onChange={(e) =>
                  setMediaType(e.target.value as MediaItem["type"])
                }
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="profile">Foto de Perfil</option>
                <option value="clinic">Consultório</option>
                <option value="procedure">Procedimento</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto alternativo (acessibilidade)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Descrição da imagem"
              />
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, WEBP ou GIF. Máximo 5MB.
              {mediaType === "profile" &&
                " Ao enviar como Perfil, a foto do site é atualizada automaticamente."}
            </p>
            {uploading && (
              <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            Nenhuma imagem enviada ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt_text || "Mídia"}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{typeLabels[item.type]}</Badge>
                  <span className="text-xs text-gray-500">
                    {formatBytes(item.file_size)}
                  </span>
                </div>
                {item.alt_text && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.alt_text}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyUrl(item.url)}
                  >
                    Copiar URL
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
