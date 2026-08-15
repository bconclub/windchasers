import { getServerClient, getSessionUser } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { HistoryTable, type HistoryRow } from "./HistoryTable";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "History" };

interface AttemptRow {
  id: string;
  status: string;
  score: number | null;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  total_questions: number;
  time_taken_seconds: number | null;
  submitted_at: string | null;
  started_at: string;
  exams: { id: string; title: string; type: string; total_marks: number } | null;
}

export default async function HistoryPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const supabase = getServerClient();
  const { data } = await supabase
    .from("attempts")
    .select(
      "id, status, score, correct_count, incorrect_count, unattempted_count, total_questions, time_taken_seconds, submitted_at, started_at, exams (id, title, type, total_marks)"
    )
    .eq("student_id", session.id)
    .order("started_at", { ascending: false });

  const rows: HistoryRow[] = ((data ?? []) as unknown as AttemptRow[]).map((row) => ({
    id: row.id,
    examTitle: row.exams?.title ?? "Exam",
    examType: row.exams?.type ?? "mock",
    totalMarks: row.exams?.total_marks ?? 0,
    status: row.status,
    score: row.score,
    correct: row.correct_count,
    incorrect: row.incorrect_count,
    unattempted: row.unattempted_count,
    totalQuestions: row.total_questions,
    timeTakenSeconds: row.time_taken_seconds,
    submittedAt: row.submitted_at,
    startedAt: row.started_at,
  }));

  return (
    <>
      <PageHeader title="History" subtitle="Every attempt you have made" />
      <HistoryTable rows={rows} />
    </>
  );
}
