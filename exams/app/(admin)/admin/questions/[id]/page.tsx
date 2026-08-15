import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuestionForm } from "../QuestionForm";
import { formatDateTime } from "@/lib/utils";
import type { Question, Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit question" };

export default async function EditQuestionPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();
  const [{ data: question }, { data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("questions").select("*").eq("id", params.id).maybeSingle<Question>(),
    supabase.from("subjects").select("*").order("order_index"),
    supabase.from("topics").select("*").order("order_index"),
  ]);

  if (!question) notFound();

  return (
    <>
      <Link
        href="/admin/questions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to questions
      </Link>
      <PageHeader
        title="Edit question"
        subtitle={`Last updated ${formatDateTime(question.updated_at)}`}
      />
      <QuestionForm
        question={question}
        subjects={(subjects ?? []) as Subject[]}
        topics={(topics ?? []) as Topic[]}
      />
    </>
  );
}
