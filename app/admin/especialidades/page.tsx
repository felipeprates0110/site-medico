import { redirect } from "next/navigation";

/** Especialidades são editadas em data/specialties.ts */
export default function AdminEspecialidadesRedirect() {
  redirect("/admin");
}
