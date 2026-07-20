/** Foto oficial do Dr. Pedro Felipe (public/images) */
export const DEFAULT_DOCTOR_PHOTO = "/images/dr-pedro-felipe.png";

/**
 * Usa a foto local por padrão.
 * Só aceita URL externa se for http(s) válida (ex.: upload no painel admin).
 */
export function resolveDoctorPhoto(url?: string | null) {
  const trimmed = url?.trim();
  if (!trimmed) return DEFAULT_DOCTOR_PHOTO;

  // Evita URLs quebradas/antigas do banco sobrescreverem a foto oficial
  if (trimmed.startsWith("/images/")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return DEFAULT_DOCTOR_PHOTO;
}
