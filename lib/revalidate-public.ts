import { revalidatePath } from "next/cache";

/**
 * Invalida o cache das páginas públicas após mudanças no admin.
 * Analogia: depois de atualizar o estoque no depósito, troca o cartaz da vitrine.
 */
export function revalidatePublicSite() {
  // "layout" no path raiz invalida a home e as páginas aninhadas (blog, especialidades, etc.)
  revalidatePath("/", "layout");
}
