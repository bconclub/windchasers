import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuestionForm } from "../QuestionForm";
import type { Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "New question" };

export default async function NewQuestionPage() {
  const supabase = getServerClient();
  const [{ data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("subjects").select("*").order("order_index"),
    supabase.from("topics").select("*").order("order_index"),
  ]);

  return (
    <>
      <Link
        href="/admin/questions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to questions
      </Link>
      <PageHeader title="New question" subtitle="Add a question to the bank" />
      <QuestionForm
        question={null}
        subjects={(subjects ?? []) as Subject[]}
        topics={(topics ?? []) as Topic[]}
      />
    </>
  );
}
