import Link from "next/link";
import {
  Users,
  Layers,
  FileQuestion,
  ClipboardList,
  Activity,
  Plus,
  Upload,
} from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { SubjectBars } from "@/components/charts/Charts";
import { formatDateTime, formatMarks } from "@/lib/utils";
import type { AdminDashboardPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const supabase = getServerClient();
  const { data, error } = await supabase.rpc("get_admin_dashboard");

  if (error) {
    return (
      <EmptyState
        title="Could not load the overview"
        message={error.message}
        icon={<Activity className="h-8 w-8" />}
      />
    );
  }

  const payload = data as AdminDashboardPayload;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Question bank and exam activity at a glance"
        action={
          <>
            <Link
              href="/admin/questions/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-sm font-medium text-dark hover:bg-gold-600"
            >
              <Plus className="h-4 w-4" />
              New question
            </Link>
            <Link
              href="/admin/questions/import"
              className="inline-flex items-center gap-1.5 rounded-md border border-dark-100 px-3 py-2 text-sm text-dark hover:bg-dark-50"
            >
              <Upload className="h-4 w-4" />
              Import
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Active students"
          value={payload.total_students}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Active batches"
          value={payload.active_batches}
          icon={<Layers className="h-4 w-4" />}
        />
        <StatCard
          label="Active questions"
          value={payload.total_questions}
          icon={<FileQuestion className="h-4 w-4" />}
        />
        <StatCard
          label="Published exams"
          value={payload.published_exams}
          icon={<ClipboardList className="h-4 w-4" />}
        />
        <StatCard
          label="Attempts this week"
          value={payload.attempts_this_week}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Questions by subject"
            subtitle="Active questions only"
            action={
              <Link href="/admin/questions" className="text-sm text-gold-700 hover:underline">
                Manage
              </Link>
            }
          />
          <SubjectBars
            items={payload.questions_by_subject.map((row) => ({
              label: row.subject_name,
              value: row.total,
            }))}
          />
        </Card>

        <Card>
          <CardHeader title="Recent activity" subtitle="Latest attempts across all exams" />
          {payload.recent_attempts.length === 0 ? (
            <p className="text-sm text-dark-400">No attempts yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Student</Th>
                  <Th>Exam</Th>
                  <Th>Score</Th>
                  <Th>Status</Th>
                  <Th>Started</Th>
                </tr>
              </thead>
              <tbody>
                {payload.recent_attempts.map((row) => (
                  <tr key={row.id}>
                    <Td>{row.student_name}</Td>
                    <Td>{row.exam_title}</Td>
                    <Td className="whitespace-nowrap">
                      {row.score === null
                        ? "-"
                        : `${formatMarks(row.score)} / ${formatMarks(row.total_marks)}`}
                    </Td>
                    <Td>
                      <StatusBadge value={row.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-dark-400">
                      {formatDateTime(row.started_at)}
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
