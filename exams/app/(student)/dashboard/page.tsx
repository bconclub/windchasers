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
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { AccuracyBar } from "@/components/charts/Charts";
import { formatDateTime, formatMarks } from "@/lib/utils";
import type { DashboardExam, StudentDashboardPayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

function ExamCard({ exam }: { exam: DashboardExam }) {
  const attemptsLeft = exam.max_attempts - exam.attempts_used;
  const canStart = exam.phase === "live" && (attemptsLeft > 0 || exam.in_progress_attempt_id);

  return (
    <div className="rounded-lg border border-dark-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-dark">{exam.title}</h3>
          <p className="mt-0.5 text-xs capitalize text-dark-400">
            {exam.type} - {exam.duration_minutes} min - {formatMarks(exam.total_marks)} marks
          </p>
        </div>
        {exam.in_progress_attempt_id ? (
          <Badge tone="warning">In progress</Badge>
        ) : (
          <Badge tone={exam.phase === "live" ? "success" : "neutral"}>{exam.phase}</Badge>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-dark-400">
        <div>
          <dt className="inline">Opens </dt>
          <dd className="inline text-dark">{formatDateTime(exam.opens_at)}</dd>
        </div>
        <div>
          <dt className="inline">Closes </dt>
          <dd className="inline text-dark">{formatDateTime(exam.closes_at)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="inline">Attempts </dt>
          <dd className="inline text-dark">
            {exam.attempts_used} of {exam.max_attempts} used
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-2">
        {canStart ? (
          <Link
            href={`/exam/${exam.id}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-1.5 text-sm font-medium text-dark hover:bg-gold-600"
          >
            <PlayCircle className="h-4 w-4" />
            {exam.in_progress_attempt_id ? "Resume" : "Start"}
          </Link>
        ) : null}
        {exam.last_attempt_id ? (
          <Link
            href={`/result/${exam.last_attempt_id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-dark-100 px-3 py-1.5 text-sm text-dark hover:bg-dark-50"
          >
            <FileCheck2 className="h-4 w-4" />
            View result
          </Link>
        ) : null}
        {!canStart && !exam.last_attempt_id ? (
          <span className="text-xs text-dark-400">
            {exam.phase === "upcoming" ? "Opens later" : "No attempts left"}
          </span>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark-400">
          Live now
        </h2>
        {live.length === 0 ? (
          <EmptyState
            icon={<CalendarClock className="h-8 w-8" />}
            title="No live exams"
            message="Assigned exams appear here when their window opens."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {live.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        )}
      </section>

      {upcoming.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark-400">
            Upcoming
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
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

          <div className="mt-6 border-t border-dark-100 pt-5">
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completed.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
