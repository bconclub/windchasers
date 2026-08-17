"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  ListChecks,
  MinusCircle,
  PlayCircle,
  RefreshCw,
  Repeat,
} from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { errorMessage, formatDateTime, formatMarks } from "@/lib/utils";
import type { Exam, StartAttemptPayload } from "@/lib/types";
import { TestRunner } from "@/components/exam/TestRunner";

function Rule({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-line p-3">
      <span className="mt-0.5 text-gold">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wide text-dark-400">{label}</p>
        <p className="text-sm font-medium text-dark">{value}</p>
      </div>
    </div>
  );
}

export function ExamGate({
  exam,
  attemptsUsed,
  hasInProgress,
  studentName,
}: {
  exam: Exam;
  attemptsUsed: number;
  hasInProgress: boolean;
  studentName: string;
}) {
  const [session, setSession] = useState<StartAttemptPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const attemptsLeft = Math.max(0, exam.max_attempts - attemptsUsed);
  const now = Date.now();
  const notOpen = exam.opens_at !== null && now < new Date(exam.opens_at).getTime();
  const closed =
    exam.status !== "published" ||
    (exam.closes_at !== null && now > new Date(exam.closes_at).getTime());
  const blocked = notOpen || closed || (attemptsLeft === 0 && !hasInProgress);

  async function handleStart(): Promise<void> {
    setError(null);
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data, error: rpcError } = await supabase.rpc("start_attempt", {
        p_exam_id: exam.id,
      });
      if (rpcError) throw rpcError;
      setSession(data as StartAttemptPayload);
    } catch (caught) {
      setError(errorMessage(caught, "Could not start the exam"));
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return <TestRunner session={session} studentName={studentName} />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="rounded-xl border border-line bg-surface p-6">
        <h1 className="text-xl font-semibold text-dark">{exam.title}</h1>
        {exam.description ? (
          <p className="mt-2 text-sm text-dark-500">{exam.description}</p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Rule
            icon={<Clock className="h-4 w-4" />}
            label="Duration"
            value={`${exam.duration_minutes} minutes`}
          />
          <Rule
            icon={<ListChecks className="h-4 w-4" />}
            label="Marks per question"
            value={formatMarks(exam.marks_per_question)}
          />
          <Rule
            icon={<MinusCircle className="h-4 w-4" />}
            label="Negative marking"
            value={
              exam.negative_marks > 0
                ? `${formatMarks(exam.negative_marks)} per wrong answer`
                : "None"
            }
          />
          <Rule
            icon={<Repeat className="h-4 w-4" />}
            label="Attempts"
            value={`${attemptsLeft} of ${exam.max_attempts} left`}
          />
        </div>

        <div className="mt-6 rounded-md border border-gold-200 bg-gold-50 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-gold-700">
            <AlertTriangle className="h-4 w-4" />
            Before you begin
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-dark-500">
            <li>The timer starts the moment you begin and does not pause.</li>
            <li>Answers save automatically as you select them.</li>
            <li>
              Leaving the exam tab is recorded. Repeated switching is flagged to your instructor.
            </li>
            <li>Copy, paste and right click are disabled during the exam.</li>
            <li>The exam submits itself when the timer reaches zero.</li>
            {exam.closes_at ? (
              <li>This exam closes at {formatDateTime(exam.closes_at)}.</li>
            ) : null}
          </ul>
        </div>

        {error ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleStart} loading={loading} disabled={blocked} size="lg">
            {hasInProgress ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Resume attempt
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Start exam
              </>
            )}
          </Button>
          {blocked ? (
            <p className="text-sm text-dark-400">
              {notOpen
                ? `This exam opens at ${formatDateTime(exam.opens_at)}.`
                : closed
                  ? "This exam is closed."
                  : "You have used all your attempts."}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
