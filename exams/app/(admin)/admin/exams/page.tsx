import Link from "next/link";
import { Plus } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExamsTable, type ExamRow } from "./ExamsTable";
import type { Exam } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Exams" };

export default async function ExamsPage() {
  const supabase = getServerClient();
  const { data } = await supabase
    .from("exams")
    .select("*")
    .order("created_at", { ascending: false });

  const exams = (data ?? []) as Exam[];

  const counts = await Promise.all(
    exams.map(async (exam) => {
      const [{ count: questionCount }, { count: attemptCount }] = await Promise.all([
        supabase
          .from("exam_questions")
          .select("id", { count: "exact", head: true })
          .eq("exam_id", exam.id),
        supabase
          .from("attempts")
          .select("id", { count: "exact", head: true })
          .eq("exam_id", exam.id)
          .neq("status", "in_progress"),
      ]);
      return { questionCount: questionCount ?? 0, attemptCount: attemptCount ?? 0 };
    })
  );

  const rows: ExamRow[] = exams.map((exam, index) => ({
    ...exam,
    question_count: counts[index].questionCount,
    attempt_count: counts[index].attemptCount,
  }));

  return (
    <>
      <PageHeader
        title="Exams"
        subtitle="Create, publish and close exams"
        action={
          <Link
            href="/admin/exams/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-sm font-medium text-dark hover:bg-gold-600"
          >
            <Plus className="h-4 w-4" />
            New exam
          </Link>
        }
      />
      <ExamsTable rows={rows} />
    </>
  );
}
