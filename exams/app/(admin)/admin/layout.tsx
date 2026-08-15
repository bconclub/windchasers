import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  FileQuestion,
  ClipboardList,
  Users,
  Layers,
  BookOpen,
} from "lucide-react";
import { getSessionUser, isStaffRole } from "@/lib/supabase/server";
import { NavShell, type NavItem } from "@/components/NavShell";
import { ToastProvider } from "@/components/ui/Toast";

export const dynamic = "force-dynamic";

const items: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/questions", label: "Questions", icon: <FileQuestion className="h-4 w-4" /> },
  { href: "/admin/exams", label: "Exams", icon: <ClipboardList className="h-4 w-4" /> },
  { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/batches", label: "Batches", icon: <Layers className="h-4 w-4" /> },
  { href: "/admin/subjects", label: "Subjects", icon: <BookOpen className="h-4 w-4" /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (!isStaffRole(session.profile.role)) redirect("/dashboard");

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
