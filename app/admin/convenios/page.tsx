import { redirect } from "next/navigation";

/** Convênios são editados em data/insurance.ts */
export default function AdminConveniosRedirect() {
  redirect("/admin");
}
