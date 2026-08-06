import { redirect } from "next/navigation";

/** Tratamentos são editados em data/treatments.ts */
export default function AdminTratamentosRedirect() {
  redirect("/admin");
}
