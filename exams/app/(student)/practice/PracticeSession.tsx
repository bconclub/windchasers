"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronRight, PlayCircle, RotateCcw, XCircle } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Table";
import { StemView } from "@/components/editor/StemView";
import { cn, errorMessage, percent } from "@/lib/utils";
import type {
  OptionLetter,
  PracticeCheckPayload,
  PracticeQuestion,
  QuestionDifficulty,
  StartPracticePayload,
  Subject,
  Topic,
} from "@/lib/types";

const COUNTS = [5, 10, 20, 30, 50];

export function PracticeSession({
  subjects,
  topics,
}: {
  subjects: Subject[];
  topics: Topic[];
}) {
  const supabase = useMemo(() => getBrowserClient(), []);

  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id ?? "");
  const [topicId, setTopicId] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [count, setCount] = useState<number>(10);

  const [questions, setQuestions] = useState<PracticeQuestion[] | null>(null);
  // Practice is logged server side against this session id.
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<OptionLetter | null>(null);
  const [feedback, setFeedback] = useState<PracticeCheckPayload | null>(null);
  const [tally, setTally] = useState({ correct: 0, answered: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjectTopics = topics.filter((topic) => topic.subject_id === subjectId);
  const current = questions?.[index] ?? null;

  async function startSession(): Promise<void> {
    setError(null);
    setLoading(true);
    try {
      const { data, error: rpcError } = await supabase.rpc("start_practice", {
        p_subject_id: subjectId || null,
        p_topic_id: topicId || null,
        p_count: count,
        p_difficulty: difficulty ? (difficulty as QuestionDifficulty) : null,
      });
      if (rpcError) throw rpcError;
      const payload = data as StartPracticePayload;
      setSessionId(payload.session_id);
      setQuestions(payload.questions ?? []);
      setIndex(0);
      setSelected(null);
      setFeedback(null);
      setTally({ correct: 0, answered: 0 });
    } catch (caught) {
      setError(errorMessage(caught, "Could not load practice questions"));
    } finally {
      setLoading(false);
    }
  }

  async function check(letter: OptionLetter): Promise<void> {
    if (!current || feedback || !sessionId) return;
    setSelected(letter);
    try {
      const { data, error: rpcError } = await supabase.rpc("check_practice_answer", {
        p_session_id: sessionId,
        p_question_id: current.id,
        p_selected_option: letter,
      });
      if (rpcError) throw rpcError;
      const payload = data as PracticeCheckPayload;
      setFeedback(payload);
      setTally((prev) => ({
        correct: prev.correct + (payload.is_correct ? 1 : 0),
        answered: prev.answered + 1,
      }));
    } catch (caught) {
      setError(errorMessage(caught, "Could not check that answer"));
      setSelected(null);
    }
  }

  // Stamps ended_at so the session reads as finished rather than abandoned.
  // Failure here is not surfaced, the answers are already recorded and a
  // missing end time is not worth interrupting the student over.
  async function closeSession(): Promise<void> {
    if (!sessionId) return;
    try {
      await supabase.rpc("finish_practice", { p_session_id: sessionId });
    } catch {
      // Intentionally ignored, see above.
    }
  }

  function next(): void {
    setSelected(null);
    setFeedback(null);
    setIndex((prev) => {
      const nextIndex = prev + 1;
      if (questions && nextIndex >= questions.length) {
        void closeSession();
      }
      return nextIndex;
    });
  }

  function reset(): void {
    void closeSession();
    setQuestions(null);
    setSessionId(null);
    setSelected(null);
    setFeedback(null);
    setTally({ correct: 0, answered: 0 });
  }

  if (!questions) {
    return (
      <Card className="max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Subject"
            value={subjectId}
            onChange={(event) => {
              setSubjectId(event.target.value);
              setTopicId("");
            }}
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>

          <Select
            label="Topic"
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
          >
            <option value="">All topics</option>
            {subjectTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </Select>

          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option value="">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>

          <Select
            label="Number of questions"
            value={String(count)}
            onChange={(event) => setCount(Number(event.target.value))}
          >
            {COUNTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </div>

        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

        <div className="mt-5">
          <Button onClick={startSession} loading={loading} disabled={!subjectId}>
            <PlayCircle className="h-4 w-4" />
            Start practice
          </Button>
        </div>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        title="No questions match that selection"
        message="Try a different topic or difficulty."
        action={
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Change selection
          </Button>
        }
      />
    );
  }

  if (!current) {
    return (
      <Card className="max-w-2xl text-center">
        <h2 className="text-lg font-semibold text-dark">Practice complete</h2>
        <p className="mt-2 text-sm text-dark-500">
          You answered {tally.correct} of {tally.answered} correctly (
          {percent(tally.correct, tally.answered)}%).
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            New practice set
          </Button>
        </div>
      </Card>
    );
  }

  const options: Array<{ letter: OptionLetter; text: string }> = [
    { letter: "A", text: current.option_a },
    { letter: "B", text: current.option_b },
    { letter: "C", text: current.option_c },
    { letter: "D", text: current.option_d },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-dark-400">
          Question {index + 1} of {questions.length}
        </p>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">
            {tally.correct} correct of {tally.answered}
          </Badge>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-dark-400">
            {current.subject_name}
            {current.topic_name ? ` - ${current.topic_name}` : ""}
          </span>
          <Badge tone={current.difficulty === "hard" ? "danger" : current.difficulty === "easy" ? "success" : "warning"}>
            {current.difficulty}
          </Badge>
        </div>

        <StemView html={current.stem} className="mt-3 text-[0.9375rem] leading-relaxed text-dark" />

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

        <div className="mt-5 space-y-2">
          {options.map((option) => {
            const isCorrect = feedback?.correct_option === option.letter;
            const isChosen = selected === option.letter;
            return (
              <button
                key={option.letter}
                type="button"
                disabled={Boolean(feedback)}
                onClick={() => void check(option.letter)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                  feedback && isCorrect
                    ? "border-emerald-200 bg-emerald-50"
                    : feedback && isChosen
                      ? "border-red-200 bg-red-50"
                      : "border-dark-100 hover:border-gold-300 hover:bg-gold-50/40",
                  feedback && !isCorrect && !isChosen && "opacity-70"
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dark-200 text-xs font-semibold text-dark-500">
                  {option.letter}
                </span>
                <span className="flex-1 text-dark">{option.text}</span>
                {feedback && isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : null}
                {feedback && isChosen && !isCorrect ? (
                  <XCircle className="h-4 w-4 shrink-0 text-danger" />
                ) : null}
              </button>
            );
          })}
        </div>

        {feedback ? (
          <>
            {feedback.explanation ? (
              <div className="mt-4 rounded-md border border-gold-200 bg-gold-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
                  Explanation
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-dark-600">
                  {feedback.explanation}
                </p>
              </div>
            ) : null}
            <div className="mt-5">
              <Button onClick={next}>
                {index === questions.length - 1 ? "Finish" : "Next question"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : null}

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </Card>
    </div>
  );
}
