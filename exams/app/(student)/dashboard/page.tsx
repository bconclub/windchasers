import Link from "next/link";
import {
  Target,
  ClipboardList,
  TrendingUp,
  Clock,
  PlayCircle,
  FileCheck2,
  CalendarClock,
} from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, SectionHeading, StatCard } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { AccuracyBar } from "@/components/charts/Charts";
import { formatDateTime, formatMarks } from "@/lib/utils";
import type { DashboardExam, StudentDashboardPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

/**
 * The one thing a student logs in to do. A live exam gets the full dark panel
 * and the only gold button on the screen, so sitting it is never a hunt.
 */
function NextExamPanel({ exam }: { exam: DashboardExam }) {
  const attemptsLeft = exam.max_attempts - exam.attempts_used;
  const resuming = Boolean(exam.in_progress_attempt_id);

  return (
    <section className="shell-dark animate-rise overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold">
            {resuming ? "Attempt in progress" : "Ready to sit"}
          </p>
          <h2 className="mt-2.5 text-[1.75rem] font-semibold leading-tight tracking-display text-white">
            {exam.title}
          </h2>
          {exam.description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-dark-200">
              {exam.description}
            </p>
          ) : null}

          <dl className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-wider text-dark-300">Duration</dt>
              <dd className="tnum mt-0.5 text-[0.9375rem] font-medium text-white">
                {exam.duration_minutes} min
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-wider text-dark-300">Total marks</dt>
              <dd className="tnum mt-0.5 text-[0.9375rem] font-medium text-white">
                {formatMarks(exam.total_marks)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] uppercase tracking-wider text-dark-300">Attempts left</dt>
              <dd className="tnum mt-0.5 text-[0.9375rem] font-medium text-white">
                {attemptsLeft} of {exam.max_attempts}
              </dd>
            </div>
            {exam.closes_at ? (
              <div>
                <dt className="text-[0.6875rem] uppercase tracking-wider text-dark-300">Closes</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-medium text-white">
                  {formatDateTime(exam.closes_at)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <Link href={`/exam/${exam.id}`} className="shrink-0">
          <Button size="lg" className="w-full lg:w-auto">
            <PlayCircle className="h-5 w-5" />
            {resuming ? "Resume attempt" : "Start exam"}
          </Button>
        </Link>
      </div>
    </section>
  );
}

/** Compact row for exams that are not the immediate task. */
function ExamRow({ exam }: { exam: DashboardExam }) {
  const attemptsLeft = exam.max_attempts - exam.attempts_used;
  const canStart = exam.phase === "live" && (attemptsLeft > 0 || exam.in_progress_attempt_id);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h3 className="truncate text-[0.9375rem] font-medium text-dark">{exam.title}</h3>
          {exam.in_progress_attempt_id ? (
            <Badge tone="warning">In progress</Badge>
          ) : (
            <Badge tone={exam.phase === "live" ? "success" : "neutral"}>{exam.phase}</Badge>
          )}
        </div>
        <p className="tnum mt-1 text-[0.8125rem] text-dark-400">
          {exam.duration_minutes} min, {formatMarks(exam.total_marks)} marks,{" "}
          {exam.attempts_used} of {exam.max_attempts} attempts used
          {exam.opens_at && exam.phase === "upcoming"
            ? `, opens ${formatDateTime(exam.opens_at)}`
            : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {canStart ? (
          <Link href={`/exam/${exam.id}`}>
            <Button size="sm">
              <PlayCircle className="h-4 w-4" />
              {exam.in_progress_attempt_id ? "Resume" : "Start"}
            </Button>
          </Link>
        ) : null}
        {exam.last_attempt_id ? (
          <Link href={`/result/${exam.last_attempt_id}`}>
            <Button size="sm" variant="ghost">
              <FileCheck2 className="h-4 w-4" />
              Result
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default async function StudentDashboardPage() {
  const supabase = getServerClient();
  const { data, error } = await supabase.rpc("get_student_dashboard");

  if (error) {
    return (
      <EmptyState
        title="Could not load the dashboard"
        message={error.message}
        icon={<ClipboardList className="h-8 w-8" />}
      />
    );
  }

  const payload = data as StudentDashboardPayload;
  // Each exam lands in exactly one section so nothing is listed twice
  const isDone = (exam: DashboardExam): boolean =>
    exam.phase === "closed" ||
    (exam.attempts_used >= exam.max_attempts && !exam.in_progress_attempt_id);

  const completed = payload.exams.filter(isDone);
  const live = payload.exams.filter((exam) => exam.phase === "live" && !isDone(exam));
  const upcoming = payload.exams.filter((exam) => exam.phase === "upcoming" && !isDone(exam));
  // Subject accuracy shows the shape of the gap, weak topics name what to
  // revise. The server already ranks and caps weak_topics at three.
  const subjectAccuracy = [...payload.subject_accuracy].sort(
    (a, b) => a.accuracy - b.accuracy
  );
  const weakTopics = payload.weak_topics ?? [];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your assigned exams and performance" />

      {live.length > 0 ? (
        <div className="mb-8 space-y-4">
          <NextExamPanel exam={live[0]} />
          {live.slice(1).map((exam) => (
            <ExamRow key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <EmptyState
            icon={<CalendarClock className="h-8 w-8" />}
            title="No exam is open right now"
            message="Assigned exams appear here the moment their window opens. You can keep sharpening in practice mode meanwhile."
            action={
              <Link href="/practice">
                <Button variant="ghost">
                  <Target className="h-4 w-4" />
                  Go to practice
                </Button>
              </Link>
            }
          />
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall accuracy"
          value={`${payload.stats.accuracy}%`}
          icon={<Target className="h-4 w-4" />}
          hint={`${payload.stats.correct} correct of ${payload.stats.questions_answered} answered`}
        />
        <StatCard
          label="Attempts"
          value={payload.stats.attempts}
          icon={<ClipboardList className="h-4 w-4" />}
        />
        <StatCard
          label="Average score"
          value={formatMarks(payload.stats.avg_score)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Live exams"
          value={live.length}
          icon={<Clock className="h-4 w-4" />}
          hint={`${upcoming.length} upcoming`}
        />
      </div>

      {upcoming.length > 0 ? (
        <section className="mt-8">
          <SectionHeading title="Upcoming" subtitle="Scheduled but not open yet" />
          <div className="space-y-3">
            {upcoming.map((exam) => (
              <ExamRow key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Subject accuracy" subtitle="Lowest first" />
          {subjectAccuracy.length === 0 ? (
            <p className="text-sm text-dark-400">Take an exam to see subject accuracy.</p>
          ) : (
            <div className="space-y-4">
              {subjectAccuracy.map((subject) => (
                <AccuracyBar
                  key={subject.subject_id}
                  label={subject.subject_name}
                  correct={subject.correct}
                  total={subject.answered}
                  sublabel="answered"
                />
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <h3 className="text-sm font-semibold text-dark">Three weakest topics</h3>
            {weakTopics.length === 0 ? (
              <p className="mt-2 text-sm text-dark-400">
                Answer at least three questions in a topic and it will be ranked here.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {weakTopics.map((topic) => (
                  <li
                    key={topic.topic_id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-dark">{topic.topic_name}</span>
                      <span className="block text-xs text-dark-400">
                        {topic.subject_name}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-danger">
                      {topic.accuracy}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent attempts"
            action={
              <Link href="/history" className="text-sm text-gold-700 hover:underline">
                View all
              </Link>
            }
          />
          {payload.recent_attempts.length === 0 ? (
            <p className="text-sm text-dark-400">No attempts yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Exam</Th>
                  <Th>Score</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                </tr>
              </thead>
              <tbody>
                {payload.recent_attempts.slice(0, 6).map((attempt) => (
                  <tr key={attempt.id}>
                    <Td>
                      <Link href={`/result/${attempt.id}`} className="text-gold-700 hover:underline">
                        {attempt.exam_title}
                      </Link>
                    </Td>
                    <Td>
                      {formatMarks(attempt.score)} / {formatMarks(attempt.total_marks)}
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

      {completed.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark-400">
            Completed and closed
          </h2>
          <div className="space-y-3">
            {completed.map((exam) => (
              <ExamRow key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
