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
  CheckCircle2,
  Target,
  TrendingUp,
} from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, Metric, MetricRibbon, SectionHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { formatDateTime, formatMarks, percent } from "@/lib/utils";
import type { AdminDashboardPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Overview" };

interface AnswerRow {
  is_correct: boolean | null;
  selected_option: string | null;
  questions: { subjects: { name: string } | null } | null;
}

export default async function AdminOverviewPage() {
  const supabase = getServerClient();

  // The RPC covers inventory. Outcomes are computed here from plain reads,
  // which keeps this page free of another migration.
  const [
    { data, error },
    { data: assignments },
    { data: enrollments },
    { data: attempts },
    { data: answers },
  ] = await Promise.all([
    supabase.rpc("get_admin_dashboard"),
    supabase.from("exam_assignments").select("exam_id, batch_id, student_id"),
    supabase.from("batch_enrollments").select("batch_id, student_id"),
    supabase.from("attempts").select("exam_id, student_id, status, score, time_taken_seconds"),
    supabase
      .from("attempt_answers")
      .select("is_correct, selected_option, questions(subjects(name))"),
  ]);

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

  // Completion: every student an exam was assigned to, directly or through a
  // batch, against those who have actually sat it.
  const expected = new Set<string>();
  for (const a of assignments ?? []) {
    if (a.student_id) {
      expected.add(`${a.exam_id}|${a.student_id}`);
    } else {
      for (const e of (enrollments ?? []).filter((x) => x.batch_id === a.batch_id)) {
        expected.add(`${a.exam_id}|${e.student_id}`);
      }
    }
  }
  const sat = new Set(
    (attempts ?? [])
      .filter((a) => a.status !== "in_progress")
      .map((a) => `${a.exam_id}|${a.student_id}`)
  );
  const completionRate = expected.size === 0 ? 0 : Math.round((sat.size / expected.size) * 100);
  const outstanding = Math.max(0, expected.size - sat.size);

  const graded = (attempts ?? []).filter((a) => a.score !== null);
  const avgScore =
    graded.length === 0
      ? 0
      : graded.reduce((sum, a) => sum + Number(a.score), 0) / graded.length;
  const inProgress = (attempts ?? []).filter((a) => a.status === "in_progress").length;

  // Cohort accuracy, and the same figure per subject so a weak area is visible
  // without opening a single report.
  const rows = (answers ?? []) as unknown as AnswerRow[];
  let answered = 0;
  let correct = 0;
  const bySubject = new Map<string, { answered: number; correct: number }>();
  for (const row of rows) {
    const subject = row.questions?.subjects?.name;
    if (!row.selected_option) continue;
    answered += 1;
    if (row.is_correct) correct += 1;
    if (!subject) continue;
    const entry = bySubject.get(subject) ?? { answered: 0, correct: 0 };
    entry.answered += 1;
    if (row.is_correct) entry.correct += 1;
    bySubject.set(subject, entry);
  }
  const accuracy = percent(correct, answered);
  const subjectPerformance = [...bySubject.entries()]
    .map(([name, v]) => ({ name, ...v, pct: percent(v.correct, v.answered) }))
    .sort((a, b) => a.pct - b.pct);

  const bankTotal = payload.questions_by_subject.reduce((sum, r) => sum + r.total, 0);

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="How the cohort is performing, and what the bank can support"
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

      {/* Outcomes first. These are the numbers that answer "how are we doing". */}
      <MetricRibbon>
        <Metric
          label="Completion"
          value={`${completionRate}%`}
          hint={`${sat.size} of ${expected.size} sittings, ${outstanding} outstanding`}
          icon={<CheckCircle2 className="h-4 w-4" />}
          emphasis
        />
        <Metric
          label="Average score"
          value={formatMarks(avgScore)}
          hint={`across ${graded.length} graded attempts`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <Metric
          label="Accuracy"
          value={`${accuracy}%`}
          hint={`${correct} correct of ${answered} answered`}
          icon={<Target className="h-4 w-4" />}
        />
        <Metric
          label="Attempts"
          value={payload.attempts_this_week}
          hint={inProgress > 0 ? `${inProgress} in progress now` : "in the last 7 days"}
          icon={<Activity className="h-4 w-4" />}
        />
        <Metric
          label="Students"
          value={payload.total_students}
          hint={`in ${payload.active_batches} active ${payload.active_batches === 1 ? "batch" : "batches"}`}
          icon={<Users className="h-4 w-4" />}
        />
      </MetricRibbon>

      <SectionHeading
        title="Where the cohort is losing marks"
        subtitle="Accuracy by subject across every submitted attempt, weakest first"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          {subjectPerformance.length === 0 ? (
            <p className="text-sm text-dark-400">
              No answers recorded yet. This fills in as students submit.
            </p>
          ) : (
            <ul className="space-y-4">
              {subjectPerformance.map((row) => {
                const tone =
                  row.pct >= 70 ? "bg-success" : row.pct >= 50 ? "bg-gold" : "bg-danger";
                return (
                  <li key={row.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[0.8125rem] text-dark">{row.name}</span>
                      <span className="tnum shrink-0 text-[0.8125rem] font-medium text-dark">
                        {row.pct}%
                        <span className="ml-2 font-normal text-dark-400">
                          {row.correct}/{row.answered}
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-dark-50">
                      <div
                        className={`h-full rounded-full ${tone} transition-[width] duration-layout ease-out`}
                        style={{ width: `${Math.max(2, row.pct)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card padded={false}>
          <div className="p-5 pb-0">
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
                          <span className="font-medium text-dark">{formatMarks(row.score)}</span>
                          <span className="text-dark-300"> / {formatMarks(row.total_marks)}</span>
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

      <SectionHeading
        title="Question bank"
        subtitle={`${bankTotal} active questions across ${payload.questions_by_subject.length} subjects, supporting ${payload.published_exams} published ${payload.published_exams === 1 ? "exam" : "exams"}`}
        action={
          <Link
            href="/admin/questions"
            className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-gold-700 hover:text-gold-800"
          >
            Manage
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

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
          label="Batches"
          value={payload.active_batches}
          hint="currently running"
          icon={<Layers className="h-4 w-4" />}
        />
        {payload.questions_by_subject
          .slice()
          .sort((a, b) => a.total - b.total)
          .slice(0, 2)
          .map((row) => (
            <Metric
              key={row.subject_id}
              label={row.subject_name}
              value={row.total}
              hint={`${percent(row.total, bankTotal)}% of the bank, thinnest cover`}
            />
          ))}
      </MetricRibbon>
    </>
  );
}
