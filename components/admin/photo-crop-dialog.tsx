"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { getCroppedImageFile } from "@/lib/crop-image";

interface PhotoCropDialogProps {
  imageSrc: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => void;
  /** Envia a imagem original sem recortar */
  onSkipCrop: () => void;
}

export function PhotoCropDialog({
  imageSrc,
  open,
  onCancel,
  onConfirm,
  onSkipCrop,
}: PhotoCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  if (!open) return null;

  const handleConfirmCrop = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const file = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        `perfil-${Date.now()}.jpg`
      );
      onConfirm(file);
    } catch (error) {
      console.error("Erro ao recortar:", error);
      alert("Não foi possível recortar a imagem. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Ajustar foto de perfil
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Arraste para enquadrar e use o zoom. Se preferir, envie sem recortar.
          </p>
        </div>

        <div className="relative h-72 w-full bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="block text-sm text-gray-700">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={handleConfirmCrop}
              disabled={processing || !croppedAreaPixels}
            >
              {processing ? "Processando..." : "Usar recorte"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkipCrop}
              disabled={processing}
            >
              Enviar sem recortar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={processing}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
