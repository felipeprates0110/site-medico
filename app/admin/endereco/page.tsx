import { redirect } from "next/navigation";

/** Endereços do consultório vivem no código / fallback — não no CMS do blog. */
export default function AdminEnderecoRedirect() {
  redirect("/admin");
}
