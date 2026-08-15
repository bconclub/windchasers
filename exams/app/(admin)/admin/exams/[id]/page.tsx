import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, Users } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/Badge";
import { ExamSettingsForm } from "../ExamSettingsForm";
import { QuestionBuilder } from "./QuestionBuilder";
import type { Exam, ExamRule, Question, Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit exam" };

interface ExamQuestionRow {
  order_index: number;
  questions:
    | (Question & { subjects: { name: string } | null; topics: { name: string } | null })
    | null;
}

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();

  const [{ data: exam }, { data: subjects }, { data: topics }, { data: rules }, { data: picked }] =
    await Promise.all([
      supabase.from("exams").select("*").eq("id", params.id).maybeSingle<Exam>(),
      supabase.from("subjects").select("*").order("order_index"),
      supabase.from("topics").select("*").order("order_index"),
      supabase.from("exam_rules").select("*").eq("exam_id", params.id),
      supabase
        .from("exam_questions")
        .select("order_index, questions (*, subjects (name), topics (name))")
        .eq("exam_id", params.id)
        .order("order_index"),
    ]);

  if (!exam) notFound();

  const selectedQuestions = ((picked ?? []) as unknown as ExamQuestionRow[])
    .map((row) => row.questions)
    .filter((question): question is NonNullable<ExamQuestionRow["questions"]> => question !== null);

  return (
    <>
      <Link
        href="/admin/exams"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to exams
      </Link>

      <PageHeader
        title={exam.title}
        subtitle={`${selectedQuestions.length} questions - ${exam.duration_minutes} minutes`}
        action={
          <>
            <StatusBadge value={exam.status} />
            <Link
              href={`/admin/exams/${exam.id}/assign`}
              className="inline-flex items-center gap-1.5 rounded-md border border-dark-100 px-3 py-2 text-sm text-dark hover:bg-dark-50"
            >
              <Users className="h-4 w-4" />
              Assign
            </Link>
            <Link
              href={`/admin/exams/${exam.id}/results`}
              className="inline-flex items-center gap-1.5 rounded-md border border-dark-100 px-3 py-2 text-sm text-dark hover:bg-dark-50"
            >
              <BarChart3 className="h-4 w-4" />
              Results
            </Link>
          </>
        }
      />

      <div className="space-y-6">
        <QuestionBuilder
          exam={exam}
          subjects={(subjects ?? []) as Subject[]}
          topics={(topics ?? []) as Topic[]}
          selectedQuestions={selectedQuestions}
          rules={(rules ?? []) as ExamRule[]}
        />
        <div className="max-w-4xl">
          <ExamSettingsForm exam={exam} />
        </div>
      </div>
    </>
  );
}
