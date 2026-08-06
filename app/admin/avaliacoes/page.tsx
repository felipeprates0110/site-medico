import { redirect } from "next/navigation";

/** Avaliações públicas usam data/reviews + banco com fallback — não no CMS do blog. */
export default function AdminAvaliacoesRedirect() {
  redirect("/admin");
}
