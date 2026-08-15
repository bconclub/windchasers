import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { BatchDetail } from "./BatchDetail";
import { formatDate } from "@/lib/utils";
import type { Batch, BatchPerformancePayload, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Batch" };

interface EnrollmentRow {
  student_id: string;
}

export default async function BatchDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();

  const [{ data: batch }, { data: enrollments }, { data: students }, { data: performance }] =
    await Promise.all([
      supabase.from("batches").select("*").eq("id", params.id).maybeSingle<Batch>(),
      supabase.from("batch_enrollments").select("student_id").eq("batch_id", params.id),
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .eq("is_active", true)
        .order("full_name"),
      supabase.rpc("get_batch_performance", { p_batch_id: params.id }),
    ]);

  if (!batch) notFound();

  const enrolledIds = ((enrollments ?? []) as EnrollmentRow[]).map((row) => row.student_id);

  return (
    <>
      <Link
        href="/admin/batches"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to batches
      </Link>

      <PageHeader
        title={batch.name}
        subtitle={`${batch.code} - ${formatDate(batch.start_date)} to ${formatDate(batch.end_date)}`}
        action={
          <Badge tone={batch.is_active ? "success" : "neutral"}>
            {batch.is_active ? "active" : "inactive"}
          </Badge>
        }
      />

      <BatchDetail
        batchId={batch.id}
        enrolledIds={enrolledIds}
        students={(students ?? []) as Profile[]}
        performance={(performance ?? { students: [] }) as BatchPerformancePayload}
      />
    </>
  );
}
