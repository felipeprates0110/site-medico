/** Foto oficial do Dr. Pedro Felipe (public/images) */
export const DEFAULT_DOCTOR_PHOTO = "/images/dr-pedro-felipe.png";

export function resolveDoctorPhoto(url?: string | null) {
  return url?.trim() || DEFAULT_DOCTOR_PHOTO;
}
