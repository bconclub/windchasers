import { notFound } from "next/navigation";
import { getServerClient, getSessionUser } from "@/lib/supabase/server";
import { ExamGate } from "./ExamGate";
import type { Attempt, Exam } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Exam" };

export default async function ExamPage({ params }: { params: { id: string } }) {
  const session = await getSessionUser();
  if (!session) notFound();

  const supabase = getServerClient();
  const { data: exam } = await supabase
    .from("exams")
    .select("*")
    .eq("id", params.id)
    .maybeSingle<Exam>();

  if (!exam) notFound();

  const { data: attempts } = await supabase
    .from("attempts")
    .select("id, status")
    .eq("exam_id", params.id)
    .eq("student_id", session.id);

  const rows = (attempts ?? []) as Array<Pick<Attempt, "id" | "status">>;
  const inProgress = rows.find((row) => row.status === "in_progress") ?? null;

  return (
    <ExamGate
      exam={exam}
      attemptsUsed={rows.length}
      hasInProgress={Boolean(inProgress)}
      studentName={session.profile.full_name || session.email}
    />
  );
}
