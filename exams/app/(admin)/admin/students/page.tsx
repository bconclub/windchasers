import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { StudentsPanel, type StudentRow } from "./StudentsPanel";
import type { Batch, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Students" };

interface EnrollmentRow {
  student_id: string;
  batches: { id: string; name: string; code: string } | null;
}

export default async function StudentsPage() {
  const supabase = getServerClient();
  const [{ data: profiles }, { data: batches }, { data: enrollments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .order("created_at", { ascending: false }),
    supabase.from("batches").select("*").order("name"),
    supabase.from("batch_enrollments").select("student_id, batches (id, name, code)"),
  ]);

  const byStudent = new Map<string, Array<{ id: string; name: string; code: string }>>();
  for (const row of (enrollments ?? []) as unknown as EnrollmentRow[]) {
    if (!row.batches) continue;
    const list = byStudent.get(row.student_id) ?? [];
    list.push(row.batches);
    byStudent.set(row.student_id, list);
  }

  const rows: StudentRow[] = ((profiles ?? []) as Profile[]).map((profile) => ({
    ...profile,
    batches: byStudent.get(profile.id) ?? [],
  }));

  return (
    <>
      <PageHeader title="Students" subtitle="Add, invite and manage student accounts" />
      <StudentsPanel rows={rows} batches={(batches ?? []) as Batch[]} />
    </>
  );
}
