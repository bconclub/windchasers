import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/Table";
import { ResultsView } from "./ResultsView";
import type { ExamAnalyticsPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Exam results" };

export default async function ExamResultsPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();
  const { data, error } = await supabase.rpc("get_exam_analytics", { p_exam_id: params.id });

  if (error) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-8 w-8" />}
        title="Could not load results"
        message={error.message}
      />
    );
  }

  const payload = data as ExamAnalyticsPayload;

  return (
    <>
      <Link
        href={`/admin/exams/${params.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to exam
      </Link>
      <PageHeader
        title="Results"
        subtitle={payload.exam?.title ?? "Exam"}
      />
      <ResultsView payload={payload} examId={params.id} />
    </>
  );
}
