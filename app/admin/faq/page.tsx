import { redirect } from "next/navigation";

/** FAQ é editada em data/faq.ts */
export default function AdminFaqRedirect() {
  redirect("/admin");
}
