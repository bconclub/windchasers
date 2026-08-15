"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  Send,
  WifiOff,
} from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StemView } from "@/components/editor/StemView";
import { ExamTimer } from "./ExamTimer";
import { QuestionPalette, type PaletteEntry } from "./QuestionPalette";
import { cn, errorMessage, seededShuffle } from "@/lib/utils";
import type { OptionLetter, RunnerQuestion, StartAttemptPayload } from "@/lib/types";

interface AnswerState {
  selected: OptionLetter | null;
  marked: boolean;
  timeSpent: number;
}

interface DisplayOption {
  letter: OptionLetter;
  text: string;
}

interface SaveAnswerResult {
  saved: boolean;
  expired: boolean;
  server_now: string;
  deadline: string;
}

function optionsOf(question: RunnerQuestion): DisplayOption[] {
  return [
    { letter: "A", text: question.option_a },
    { letter: "B", text: question.option_b },
    { letter: "C", text: question.option_c },
    { letter: "D", text: question.option_d },
  ];
}

export function TestRunner({
  session,
  studentName,
}: {
  session: StartAttemptPayload;
  studentName: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const { attempt, exam, questions } = session;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const initial: Record<string, AnswerState> = {};
    for (const question of questions) {
      initial[question.id] = { selected: null, marked: false, timeSpent: 0 };
    }
    for (const saved of session.answers) {
      initial[saved.question_id] = {
        selected: saved.selected_option,
        marked: saved.marked_for_review,
        timeSpent: saved.time_spent_seconds,
      };
    }
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(attempt.tab_switch_count);

  const clockOffsetMs = useMemo(
    () => new Date(attempt.server_now).getTime() - Date.now(),
    [attempt.server_now]
  );
  const deadlineMs = useMemo(() => new Date(attempt.deadline).getTime(), [attempt.deadline]);

  const submittedRef = useRef(false);
  const questionEnteredAt = useRef<number>(Date.now());
  const current = questions[index];

  // Per attempt option order. Display only, the server always scores by letter.
  const displayOptions = useMemo(() => {
    if (!current) return [];
    const base = optionsOf(current);
    return exam.shuffle_options ? seededShuffle(base, `${attempt.id}:${current.id}`) : base;
  }, [current, exam.shuffle_options, attempt.id]);

  const leaveAttempt = useCallback(
    (auto: boolean): void => {
      const target = exam.show_result_immediately
        ? `/result/${attempt.id}`
        : `/dashboard?submitted=${auto ? "auto" : "manual"}`;
      router.replace(target);
      router.refresh();
    },
    [exam.show_result_immediately, attempt.id, router]
  );

  const submit = useCallback(
    async (auto: boolean): Promise<void> => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      try {
        const { error } = await supabase.rpc("submit_attempt", { p_attempt_id: attempt.id });
        if (error) throw error;
      } catch (caught) {
        // The server auto submits on the deadline anyway, so surface and move on
        setSaveError(errorMessage(caught, "Submit failed"));
      }
      leaveAttempt(auto);
    },
    [supabase, attempt.id, leaveAttempt]
  );

  const persist = useCallback(
    async (questionId: string, state: AnswerState): Promise<void> => {
      setSaving(true);
      try {
        const { data, error } = await supabase.rpc("save_answer", {
          p_attempt_id: attempt.id,
          p_question_id: questionId,
          p_selected_option: state.selected,
          p_marked_for_review: state.marked,
          p_time_spent_seconds: state.timeSpent,
        });
        if (error) throw error;

        // The server closes the attempt once the deadline passes and reports
        // it here rather than raising, so the grading it did is not rolled back
        const result = data as SaveAnswerResult | null;
        if (result && result.expired) {
          submittedRef.current = true;
          leaveAttempt(true);
          return;
        }
        setSaveError(null);
      } catch (caught) {
        setSaveError(errorMessage(caught, "Could not save that answer"));
      } finally {
        setSaving(false);
      }
    },
    [supabase, attempt.id, leaveAttempt]
  );

  // Record time on the question that is being left behind
  const flushTime = useCallback(
    (questionId: string): AnswerState => {
      const spent = Math.round((Date.now() - questionEnteredAt.current) / 1000);
      questionEnteredAt.current = Date.now();
      const existing = answers[questionId] ?? { selected: null, marked: false, timeSpent: 0 };
      return { ...existing, timeSpent: existing.timeSpent + Math.max(0, spent) };
    },
    [answers]
  );

  const goTo = useCallback(
    (nextIndex: number): void => {
      if (!current) return;
      if (nextIndex < 0 || nextIndex >= questions.length || nextIndex === index) return;
      const updated = flushTime(current.id);
      setAnswers((prev) => ({ ...prev, [current.id]: updated }));
      void persist(current.id, updated);
      setIndex(nextIndex);
    },
    [current, questions.length, index, flushTime, persist]
  );

  function selectOption(letter: OptionLetter): void {
    if (!current) return;
    const previous = answers[current.id] ?? { selected: null, marked: false, timeSpent: 0 };
    const next: AnswerState = {
      ...previous,
      selected: previous.selected === letter ? null : letter,
    };
    setAnswers((prev) => ({ ...prev, [current.id]: next }));
    void persist(current.id, next);
  }

  function toggleMark(): void {
    if (!current) return;
    const previous = answers[current.id] ?? { selected: null, marked: false, timeSpent: 0 };
    const next: AnswerState = { ...previous, marked: !previous.marked };
    setAnswers((prev) => ({ ...prev, [current.id]: next }));
    void persist(current.id, next);
  }

  // Tab switch tracking
  useEffect(() => {
    const onVisibility = (): void => {
      if (document.visibilityState !== "hidden" || submittedRef.current) return;
      setTabWarning(true);
      void supabase
        .rpc("record_tab_switch", { p_attempt_id: attempt.id })
        .then(({ data }) => {
          if (typeof data === "number") setTabSwitches(data);
        });
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [supabase, attempt.id]);

  // Block copy, paste and the context menu for the duration of the attempt
  useEffect(() => {
    const block = (event: Event): void => event.preventDefault();
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  // Pin history so the browser back button cannot drop out of a live attempt
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const onPopState = (): void => {
      if (submittedRef.current) return;
      window.history.pushState(null, "", window.location.href);
      setTabWarning(true);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Warn on reload or close while the attempt is live
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent): void => {
      if (submittedRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const handleExpire = useCallback(() => {
    void submit(true);
  }, [submit]);

  const paletteEntries: PaletteEntry[] = questions.map((question) => {
    const state = answers[question.id];
    return {
      questionId: question.id,
      selected: state?.selected ?? null,
      marked: state?.marked ?? false,
    };
  });

  const answeredCount = paletteEntries.filter((entry) => entry.selected).length;

  if (!current) {
    return <p className="text-sm text-dark-400">This exam has no questions.</p>;
  }

  const currentState = answers[current.id];

  return (
    <div className="no-select fixed inset-0 z-50 flex flex-col bg-dark-50">
      <header className="border-b border-dark-100 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-dark">{exam.title}</p>
            <p className="truncate text-xs text-dark-400">{studentName}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {saving ? (
              <span className="hidden items-center gap-1 text-xs text-dark-400 sm:flex">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving
              </span>
            ) : null}
            {saveError ? (
              <span className="hidden items-center gap-1 text-xs text-danger sm:flex">
                <WifiOff className="h-3 w-3" />
                Not saved
              </span>
            ) : null}
            <ExamTimer
              deadlineMs={deadlineMs}
              clockOffsetMs={clockOffsetMs}
              onExpire={handleExpire}
            />
            <Button size="sm" onClick={() => setConfirmOpen(true)}>
              <Send className="h-4 w-4" />
              Submit
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 overflow-hidden px-4 py-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto rounded-lg border border-dark-100 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-dark">
                Question {index + 1} of {questions.length}
              </p>
              <p className="text-xs text-dark-400">
                {current.subject_name}
                {current.topic_name ? ` - ${current.topic_name}` : ""}
              </p>
            </div>

            <StemView html={current.stem} className="mt-4 text-[15px] leading-relaxed text-dark" />

            {current.image_url ? (
              <div className="relative mt-4 h-64 w-full max-w-xl">
                <Image
                  src={current.image_url}
                  alt="Question figure"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : null}

            <div className="mt-6 space-y-2">
              {displayOptions.map((option) => {
                const active = currentState?.selected === option.letter;
                return (
                  <button
                    key={option.letter}
                    type="button"
                    onClick={() => selectOption(option.letter)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      active
                        ? "border-gold bg-gold-50 text-dark"
                        : "border-dark-100 bg-white text-dark hover:border-gold-300 hover:bg-gold-50/40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        active ? "border-gold bg-gold text-dark" : "border-dark-200 text-dark-500"
                      )}
                    >
                      {active ? <Check className="h-3.5 w-3.5" /> : option.letter}
                    </span>
                    <span className="flex-1">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button variant="ghost" onClick={() => goTo(index - 1)} disabled={index === 0}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant={currentState?.marked ? "primary" : "ghost"}
              onClick={toggleMark}
            >
              <Flag className="h-4 w-4" />
              {currentState?.marked ? "Marked" : "Mark for review"}
            </Button>
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={() => goTo(index + 1)}
              disabled={index === questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <aside className="hidden w-64 shrink-0 overflow-y-auto lg:block">
          <QuestionPalette entries={paletteEntries} currentIndex={index} onJump={goTo} />
          {tabSwitches > 0 ? (
            <p className="mt-3 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Tab switches recorded: {tabSwitches}
            </p>
          ) : null}
        </aside>
      </div>

      <Modal
        open={tabWarning}
        onClose={() => setTabWarning(false)}
        title="Stay on the exam screen"
        footer={
          <Button onClick={() => setTabWarning(false)}>Continue exam</Button>
        }
      >
        <p className="text-sm text-dark-500">
          Leaving the exam screen is recorded and shared with your instructor. Stay on this tab
          until you submit.
        </p>
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Submit this exam"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}>
              Keep working
            </Button>
            <Button onClick={() => void submit(false)} loading={submitting}>
              Submit now
            </Button>
          </>
        }
      >
        <p className="text-sm text-dark-500">
          You have answered {answeredCount} of {questions.length} questions.
          {answeredCount < questions.length
            ? ` ${questions.length - answeredCount} will be marked unattempted.`
            : ""}
        </p>
        <p className="mt-2 text-sm text-dark-500">You cannot return to this attempt afterwards.</p>
      </Modal>
    </div>
  );
}
