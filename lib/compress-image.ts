/** Limite aceito pela API de upload */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

/** Alvo um pouco abaixo do limite, para sobrar margem */
export const TARGET_UPLOAD_BYTES = 4.5 * 1024 * 1024;

export interface CompressImageOptions {
  /** Tamanho máximo em bytes (padrão: ~4.5MB) */
  maxBytes?: number;
  /** Largura máxima em pixels */
  maxWidth?: number;
  /** Altura máxima em pixels */
  maxHeight?: number;
  /** Qualidade JPEG inicial (0 a 1) */
  initialQuality?: number;
}

export interface CompressImageResult {
  file: File;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
}

/**
 * Compacta uma imagem no navegador (sem instalar programa externo).
 * Analogia: é como reduzir a resolução e a “qualidade da impressão”
 * de uma foto do celular até ela caber no envelope de 5MB.
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressImageResult> {
  const maxBytes = options.maxBytes ?? TARGET_UPLOAD_BYTES;
  const maxWidth = options.maxWidth ?? 1920;
  const maxHeight = options.maxHeight ?? 1920;
  const initialQuality = options.initialQuality ?? 0.85;
  const originalSize = file.size;

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = fitInside(
      image.width,
      image.height,
      maxWidth,
      maxHeight
    );

    const needsResize = width < image.width || height < image.height;
    // JPEG já leve e no tamanho certo: não mexe (evita reprocessar à toa)
    const alreadyFits =
      originalSize <= maxBytes &&
      !needsResize &&
      file.type === "image/jpeg";

    if (alreadyFits) {
      return {
        file,
        compressed: false,
        originalSize,
        finalSize: originalSize,
      };
    }

    let currentWidth = width;
    let currentHeight = height;
    let quality = initialQuality;
    let bestBlob: Blob | null = null;

    // Tenta várias combinações: primeiro baixa qualidade, depois reduz tamanho
    for (let attempt = 0; attempt < 10; attempt++) {
      const blob = await drawToJpegBlob(image, currentWidth, currentHeight, quality);
      bestBlob = blob;

      if (blob.size <= maxBytes) {
        break;
      }

      if (quality > 0.45) {
        quality = Math.max(0.45, quality - 0.1);
      } else {
        currentWidth = Math.max(640, Math.round(currentWidth * 0.85));
        currentHeight = Math.max(360, Math.round(currentHeight * 0.85));
        quality = 0.75;
      }
    }

    if (!bestBlob) {
      throw new Error("Não foi possível compactar a imagem");
    }

    if (bestBlob.size > MAX_UPLOAD_BYTES) {
      throw new Error(
        "Não foi possível reduzir a imagem para menos de 5MB. Tente outra foto."
      );
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
    const compressedFile = new File([bestBlob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    return {
      file: compressedFile,
      compressed: compressedFile.size < originalSize || file.type !== "image/jpeg",
      originalSize,
      finalSize: compressedFile.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Formata bytes para texto amigável (ex.: 7.2 MB) */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fitInside(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Não foi possível carregar a imagem para compactar"))
    );
    image.src = src;
  });
}

function drawToJpegBlob(
  image: HTMLImageElement,
  width: number,
  height: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Não foi possível processar a imagem"));
      return;
    }

    // Fundo branco evita transparência virar preto no JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Falha ao gerar a imagem compactada"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}
