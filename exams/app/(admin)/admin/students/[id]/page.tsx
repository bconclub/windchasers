import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Target, ClipboardList } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Table, Td, Th } from "@/components/ui/Table";
import { AccuracyBar } from "@/components/charts/Charts";
import { formatDate, formatDateTime, formatDuration, formatMarks } from "@/lib/utils";
import type { StudentReportPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Student report" };

export default async function StudentReportPage({ params }: { params: { id: string } }) {
  const supabase = getServerClient();
  const { data, error } = await supabase.rpc("get_student_report", { p_student_id: params.id });

  if (error || !data) notFound();

  const report = data as StudentReportPayload;
  if (!report.student) notFound();

  return (
    <>
      <Link
        href="/admin/students"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      <PageHeader
        title={report.student.full_name || "Unnamed student"}
        subtitle={`${report.student.email}${report.student.phone ? ` - ${report.student.phone}` : ""}`}
        action={
          <>
            <Badge tone={report.student.is_active ? "success" : "neutral"}>
              {report.student.is_active ? "active" : "inactive"}
            </Badge>
            {report.student.batches.map((batch) => (
              <Badge key={batch.id} tone="gold">
                {batch.name}
              </Badge>
            ))}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Attempts"
          value={report.stats.attempts}
          icon={<ClipboardList className="h-4 w-4" />}
          hint={`Joined ${formatDate(report.student.created_at)}`}
        />
        <StatCard
          label="Average score"
          value={formatMarks(report.stats.avg_score)}
          icon={<Award className="h-4 w-4" />}
        />
        <StatCard
          label="Overall accuracy"
          value={`${report.stats.accuracy}%`}
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Subject accuracy" />
          {report.subject_accuracy.length === 0 ? (
            <p className="text-sm text-dark-400">No graded answers yet.</p>
          ) : (
            <div className="space-y-4">
              {report.subject_accuracy.map((row) => (
                <AccuracyBar
                  key={row.subject_name}
                  label={row.subject_name}
                  correct={row.correct}
                  total={row.answered}
                  sublabel="answered"
                />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Attempts" />
          {report.attempts.length === 0 ? (
            <p className="text-sm text-dark-400">No attempts yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Exam</Th>
                  <Th>Score</Th>
                  <Th>Time</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                </tr>
              </thead>
              <tbody>
                {report.attempts.map((attempt) => (
                  <tr key={attempt.id}>
                    <Td>{attempt.exam_title}</Td>
                    <Td className="whitespace-nowrap">
                      {formatMarks(attempt.score)} / {formatMarks(attempt.total_marks)}
                    </Td>
                    <Td className="whitespace-nowrap">
                      {formatDuration(attempt.time_taken_seconds)}
                    </Td>
                    <Td>
                      <StatusBadge value={attempt.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-dark-400">
                      {formatDateTime(attempt.submitted_at)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>
    </>
  );
}
