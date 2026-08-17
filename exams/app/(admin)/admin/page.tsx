import Link from "next/link";
import {
  Users,
  Layers,
  FileQuestion,
  ClipboardList,
  Activity,
  Plus,
  Upload,
  ArrowUpRight,
} from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, Metric, MetricRibbon } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { formatDateTime, formatMarks, percent } from "@/lib/utils";
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
  const bankTotal = payload.questions_by_subject.reduce((sum, row) => sum + row.total, 0);
  const largestSubject = Math.max(...payload.questions_by_subject.map((r) => r.total), 1);

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Question bank and exam activity at a glance"
        action={
          <>
            <Link href="/admin/questions/import">
              <Button variant="ghost">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </Link>
            <Link href="/admin/questions/new">
              <Button>
                <Plus className="h-4 w-4" />
                New question
              </Button>
            </Link>
          </>
        }
      />

      {/* One instrument cluster. Attempts this week is the live reading, so it
          carries the accent and the rest stay quiet around it. */}
      <MetricRibbon>
        <Metric
          label="Questions"
          value={payload.total_questions}
          hint="active in the bank"
          icon={<FileQuestion className="h-4 w-4" />}
        />
        <Metric
          label="Exams"
          value={payload.published_exams}
          hint="published"
          icon={<ClipboardList className="h-4 w-4" />}
        />
        <Metric
          label="Students"
          value={payload.total_students}
          hint="active accounts"
          icon={<Users className="h-4 w-4" />}
        />
        <Metric
          label="Batches"
          value={payload.active_batches}
          hint="currently running"
          icon={<Layers className="h-4 w-4" />}
        />
        <Metric
          label="Attempts"
          value={payload.attempts_this_week}
          hint="in the last 7 days"
          icon={<Activity className="h-4 w-4" />}
          emphasis
        />
      </MetricRibbon>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,10fr)]">
        <Card>
          <CardHeader
            title="Bank coverage"
            subtitle={`${bankTotal} active questions across ${payload.questions_by_subject.length} subjects`}
            action={
              <Link
                href="/admin/questions"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-gold-700 hover:text-gold-800"
              >
                Manage
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {payload.questions_by_subject.length === 0 ? (
            <p className="text-sm text-dark-400">No questions yet. Import a sheet to begin.</p>
          ) : (
            <ul className="space-y-3.5">
              {payload.questions_by_subject.map((row) => (
                <li key={row.subject_id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[13px] text-dark">{row.subject_name}</span>
                    <span className="tnum shrink-0 text-[13px] font-medium text-dark-500">
                      {row.total}
                      <span className="ml-1.5 text-dark-300">
                        {percent(row.total, bankTotal)}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-dark-50">
                    <div
                      className="h-full rounded-full bg-gold transition-[width] duration-layout ease-out"
                      style={{ width: `${Math.max(3, (row.total / largestSubject) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padded={false}>
          <div className="p-5">
            <CardHeader title="Recent activity" subtitle="Latest attempts across all exams" />
          </div>
          {payload.recent_attempts.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-dark-400">
              No attempts yet. They appear here as students sit exams.
            </p>
          ) : (
            <Table bare>
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
                      <Td className="font-medium text-dark">{row.student_name}</Td>
                      <Td className="text-dark-500">{row.exam_title}</Td>
                      <Td className="tnum whitespace-nowrap">
                        {row.score === null ? (
                          <span className="text-dark-300">-</span>
                        ) : (
                          <>
                            <span className="font-medium text-dark">
                              {formatMarks(row.score)}
                            </span>
                            <span className="text-dark-300">
                              {" "}
                              / {formatMarks(row.total_marks)}
                            </span>
                          </>
                        )}
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
