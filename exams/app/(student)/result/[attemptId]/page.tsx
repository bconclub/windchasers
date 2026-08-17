import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  MinusCircle,
  Target,
  XCircle,
} from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Table";
import { AccuracyBar } from "@/components/charts/Charts";
import { StemView } from "@/components/editor/StemView";
import { cn, formatDuration, formatMarks, percent } from "@/lib/utils";
import type { AttemptResultPayload, OptionLetter, ReviewQuestion } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Result" };

function ReviewCard({ question, order }: { question: ReviewQuestion; order: number }) {
  const options: Array<{ letter: OptionLetter; text: string }> = [
    { letter: "A", text: question.option_a },
    { letter: "B", text: question.option_b },
    { letter: "C", text: question.option_c },
    { letter: "D", text: question.option_d },
  ];

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-dark">Question {order}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-dark-400">
            {question.subject_name}
            {question.topic_name ? ` - ${question.topic_name}` : ""}
          </span>
          {question.selected_option === null ? (
            <Badge tone="neutral">Unattempted</Badge>
          ) : question.is_correct ? (
            <Badge tone="success">Correct</Badge>
          ) : (
            <Badge tone="danger">Incorrect</Badge>
          )}
        </div>
      </div>

      <StemView html={question.stem} className="mt-3 text-[15px] leading-relaxed text-dark" />

      <div className="mt-4 space-y-2">
        {options.map((option) => {
          const isCorrect = option.letter === question.correct_option;
          const isChosen = option.letter === question.selected_option;
          return (
            <div
              key={option.letter}
              className={cn(
                "flex items-start gap-3 rounded-md border px-3 py-2 text-sm",
                isCorrect
                  ? "border-emerald-200 bg-emerald-50"
                  : isChosen
                    ? "border-red-200 bg-red-50"
                    : "border-dark-100"
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dark-200 text-xs font-semibold text-dark-500">
                {option.letter}
              </span>
              <span className="flex-1 text-dark">{option.text}</span>
              {isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : null}
              {isChosen && !isCorrect ? (
                <XCircle className="h-4 w-4 shrink-0 text-danger" />
              ) : null}
            </div>
          );
        })}
      </div>

      {question.explanation ? (
        <div className="mt-4 rounded-md border border-gold-200 bg-gold-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Explanation</p>
          <p className="mt-1 whitespace-pre-line text-sm text-dark-600">{question.explanation}</p>
        </div>
      ) : null}

      <p className="mt-3 text-xs text-dark-400">
        Time spent {formatDuration(question.time_spent_seconds)}
      </p>
    </div>
  );
}

export default async function ResultPage({ params }: { params: { attemptId: string } }) {
  const supabase = getServerClient();
  const { data, error } = await supabase.rpc("get_attempt_result", {
    p_attempt_id: params.attemptId,
  });

  if (error) {
    return (
      <EmptyState
        title="Could not load this result"
        message={error.message}
        icon={<Award className="h-8 w-8" />}
        action={
          <Link href="/dashboard" className="text-sm text-gold-700 hover:underline">
            Back to dashboard
          </Link>
        }
      />
    );
  }
  if (!data) notFound();

  const result = data as AttemptResultPayload;
  const { attempt, exam } = result;
  const answered = attempt.correct_count + attempt.incorrect_count;
  const accuracy = percent(attempt.correct_count, answered);

  return (
    <>
      <Link
        href="/history"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to history
      </Link>

      <PageHeader
        title={exam.title}
        subtitle={`Attempt result - ${attempt.total_questions} questions`}
        action={<StatusBadge value={attempt.status} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Score"
          value={`${formatMarks(attempt.score)} / ${formatMarks(exam.total_marks)}`}
          icon={<Award className="h-4 w-4" />}
          hint={
            result.batch_average !== null
              ? `Batch average ${formatMarks(result.batch_average)}`
              : exam.negative_marks > 0
                ? `Negative marking ${formatMarks(exam.negative_marks)} per wrong answer`
                : "No negative marking"
          }
        />
        <StatCard
          label="Accuracy"
          value={`${accuracy}%`}
          icon={<Target className="h-4 w-4" />}
          hint={`${attempt.correct_count} correct of ${answered} answered`}
        />
        <StatCard
          label="Time taken"
          value={formatDuration(attempt.time_taken_seconds)}
          icon={<Clock className="h-4 w-4" />}
          hint={`Allowed ${exam.duration_minutes} min`}
        />
        <StatCard
          label="Unattempted"
          value={attempt.unattempted_count}
          icon={<MinusCircle className="h-4 w-4" />}
          hint={`${attempt.incorrect_count} incorrect`}
        />
      </div>

      {attempt.tab_switch_count > 0 ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Tab switches recorded during this attempt: {attempt.tab_switch_count}
        </p>
      ) : null}

      {result.leaderboard.length > 0 ? (
        <Card className="mt-6">
          <CardHeader
            title="Batch leaderboard"
            subtitle="Everyone in your batch who has sat this exam"
          />
          <ol className="space-y-1">
            {result.leaderboard.map((row, position) => (
              <li
                key={`${row.rank}-${row.student_name}-${position}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm",
                  row.is_you ? "bg-gold-50 font-semibold text-dark" : "text-dark-600"
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-6 shrink-0 text-right text-xs text-dark-400">
                    {row.rank}
                  </span>
                  <span className="truncate">
                    {row.student_name}
                    {row.is_you ? " (you)" : ""}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-4">
                  <span>{formatMarks(row.score)}</span>
                  <span className="w-16 text-right text-xs text-dark-400">
                    {formatDuration(row.time_taken_seconds)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Subject breakdown" />
          {result.subject_breakdown.length === 0 ? (
            <p className="text-sm text-dark-400">No data.</p>
          ) : (
            <div className="space-y-4">
              {result.subject_breakdown.map((row) => (
                <AccuracyBar
                  key={row.subject_id}
                  label={row.subject_name}
                  correct={row.correct}
                  total={row.total}
                />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Topic breakdown" />
          {result.topic_breakdown.length === 0 ? (
            <p className="text-sm text-dark-400">Questions in this exam have no topic set.</p>
          ) : (
            <div className="space-y-4">
              {result.topic_breakdown.map((row) => (
                <AccuracyBar
                  key={row.topic_id}
                  label={`${row.topic_name} (${row.subject_name})`}
                  correct={row.correct}
                  total={row.total}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-dark-400">
          Solution review
        </h2>
        {!result.can_review ? (
          <EmptyState
            title="Review is not available for this exam"
            message="Your instructor has turned off answer review. Your score and breakdown above are final."
          />
        ) : (
          <div className="space-y-4">
            {result.questions.map((question, position) => (
              <ReviewCard key={question.id} question={question} order={position + 1} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
