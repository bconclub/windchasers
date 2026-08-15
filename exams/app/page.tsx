import { redirect } from "next/navigation";
import { getSessionUser, isStaffRole } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  redirect(isStaffRole(session.profile.role) ? "/admin" : "/dashboard");
}
