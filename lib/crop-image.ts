import type { Area } from "react-easy-crop";

/**
 * Recorta a imagem no canvas e devolve um File pronto para upload.
 * Analogia: é como cortar uma foto com tesoura e guardar só o pedaço escolhido.
 * Funciona tanto para foto quadrada (perfil) quanto para capa 16:9 (blog).
 */
export async function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: Area,
  fileName = "imagem.jpg"
): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível processar a imagem");
  }

  // Mantém as proporções reais do recorte (não força quadrado)
  const width = Math.max(1, Math.round(pixelCrop.width));
  const height = Math.max(1, Math.round(pixelCrop.height));
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Falha ao gerar a imagem recortada"));
          return;
        }
        resolve(result);
      },
      "image/jpeg",
      0.92
    );
  });

  return new File([blob], fileName, { type: "image/jpeg" });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Não foi possível carregar a imagem"))
    );
    image.src = src;
  });
}
