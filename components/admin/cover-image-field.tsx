"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhotoCropDialog } from "@/components/admin/photo-crop-dialog";
import {
  compressImageFile,
  formatBytes,
  MAX_UPLOAD_BYTES,
} from "@/lib/compress-image";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface CoverImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  altText?: string;
  /** Dica após upload — qual botão usar para gravar no artigo */
  saveHint?: string;
}

/**
 * Campo de capa do artigo: permite colar uma URL ou fazer upload com recorte 16:9
 * (mesma proporção usada na página pública do blog).
 */
export function CoverImageField({
  value,
  onChange,
  altText = "Capa do artigo",
  saveHint = "Capa pronta. Clique em Salvar alterações para gravar no artigo.",
}: CoverImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(Boolean(value));
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  /** Prévia local enquanto o upload sobe — não grava blob: no formulário */
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
    };
  }, [cropSrc]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  useEffect(() => {
    if (value) setShowUrlInput(true);
  }, [value]);

  const closeCropDialog = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const prepareForUpload = async (file: File) => {
    const result = await compressImageFile(file, {
      maxBytes: MAX_UPLOAD_BYTES,
      maxWidth: 1920,
      maxHeight: 1080,
    });

    if (result.compressed && result.finalSize < result.originalSize) {
      toast.message(
        `Imagem compactada: ${formatBytes(result.originalSize)} → ${formatBytes(result.finalSize)}`
      );
    }

    return result.file;
  };

  const uploadCover = async (file: File) => {
    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return previewUrl;
    });

    try {
      const readyFile = await prepareForUpload(file);
      const body = new FormData();
      body.append("file", readyFile);
      body.append("type", "cover");
      body.append("alt_text", altText);

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha no upload");
      }

      const uploadedUrl = data.url as string | undefined;
      if (!uploadedUrl) {
        throw new Error("Servidor não retornou a URL da imagem.");
      }

      onChange(uploadedUrl);
      setShowUrlInput(true);
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      toast.success(saveHint);
    } catch (error) {
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao enviar a capa. Tente novamente."
      );
    } finally {
      setIsUploading(false);
      closeCropDialog();
    }
  };

  const displaySrc = localPreview || value;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou GIF.");
      e.target.value = "";
      return;
    }

    setIsCompressing(true);
    try {
      // Compacta antes do crop: foto grande do celular vira um arquivo leve
      const readyFile = await prepareForUpload(file);
      const objectUrl = URL.createObjectURL(readyFile);
      setPendingFile(readyFile);
      setCropSrc(objectUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível preparar a imagem."
      );
      e.target.value = "";
    } finally {
      setIsCompressing(false);
    }
  };

  const busy = isUploading || isCompressing;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Imagem de Capa</label>

      {displaySrc ? (
        <div className="relative aspect-video overflow-hidden rounded-lg border bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displaySrc}
            alt="Prévia da capa"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
              Enviando capa...
            </div>
          )}
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-slate-50 px-4 text-center">
          <ImagePlus className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            Nenhuma capa ainda. Envie um arquivo ou cole uma URL.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isCompressing
            ? "Compactando..."
            : isUploading
              ? "Enviando..."
              : "Enviar imagem"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowUrlInput((prev) => !prev)}
        >
          <Link2 className="mr-2 h-4 w-4" />
          {showUrlInput ? "Ocultar URL" : "Usar URL"}
        </Button>

        {(value || localPreview) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalPreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
              });
              onChange("");
            }}
            disabled={busy}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
        disabled={busy}
      />

      {showUrlInput && (
        <div className="space-y-1">
          <label htmlFor="cover_image_url" className="text-xs text-gray-500">
            Ou cole a URL da imagem
          </label>
          <Input
            id="cover_image_url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Proporção recomendada: 16:9. Imagens grandes são compactadas
        automaticamente (limite 5MB no servidor).
      </p>

      {cropSrc && pendingFile && (
        <PhotoCropDialog
          open
          imageSrc={cropSrc}
          aspect={16 / 9}
          cropShape="rect"
          title="Ajustar capa do artigo"
          description="Arraste e use o zoom para enquadrar a capa no formato 16:9 do blog."
          fileNamePrefix="capa"
          onCancel={closeCropDialog}
          onSkipCrop={() => uploadCover(pendingFile)}
          onConfirm={(croppedFile) => uploadCover(croppedFile)}
        />
      )}
    </div>
  );
}
