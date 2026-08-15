import { redirect } from "next/navigation";
import { LayoutDashboard, Dumbbell, History } from "lucide-react";
import { getSessionUser, isStaffRole } from "@/lib/supabase/server";
import { NavShell, type NavItem } from "@/components/NavShell";
import { ToastProvider } from "@/components/ui/Toast";

export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/practice", label: "Practice", icon: <Dumbbell className="h-4 w-4" /> },
  { href: "/history", label: "History", icon: <History className="h-4 w-4" /> },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (isStaffRole(session.profile.role)) redirect("/admin");

  return (
    <ToastProvider>
      <NavShell
        items={items}
        userName={session.profile.full_name || session.email}
        userRole={session.profile.role}
      >
        {children}
      </NavShell>
    </ToastProvider>
  );
}
