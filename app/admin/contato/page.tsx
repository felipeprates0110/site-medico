import { redirect } from "next/navigation";

/** Conteúdo clínico/contato não é mais gerenciado pelo Admin — use o código. */
export default function AdminContatoRedirect() {
  redirect("/admin");
}
