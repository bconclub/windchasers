import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { AssignPanel } from "./AssignPanel";
import type { Batch, Exam, ExamAssignment, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Assign exam" };

export default async function AssignExamPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();

  const [{ data: exam }, { data: batches }, { data: students }, { data: assignments }] =
    await Promise.all([
      supabase.from("exams").select("*").eq("id", params.id).maybeSingle<Exam>(),
      supabase.from("batches").select("*").order("name"),
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .eq("is_active", true)
        .order("full_name"),
      supabase.from("exam_assignments").select("*").eq("exam_id", params.id),
    ]);

  if (!exam) notFound();

  return (
    <>
      <Link
        href={`/admin/exams/${exam.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to exam
      </Link>
      <PageHeader
        title="Assign exam"
        subtitle={exam.title}
      />
      <AssignPanel
        exam={exam}
        batches={(batches ?? []) as Batch[]}
        students={(students ?? []) as Profile[]}
        assignments={(assignments ?? []) as ExamAssignment[]}
      />
    </>
  );
}
