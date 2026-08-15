"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Search, Trash2, Wand2, X } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { cn, errorMessage, formatMarks, stripHtml, truncate } from "@/lib/utils";
import type {
  Exam,
  ExamRule,
  Question,
  QuestionDifficulty,
  Subject,
  Topic,
} from "@/lib/types";

interface PickerRow extends Question {
  subjects: { name: string } | null;
  topics: { name: string } | null;
}

interface RuleDraft {
  key: string;
  id: string | null;
  subject_id: string;
  topic_id: string;
  difficulty: string;
  question_count: number;
  available: number | null;
}

export function QuestionBuilder({
  exam,
  subjects,
  topics,
  selectedQuestions,
  rules,
}: {
  exam: Exam;
  subjects: Subject[];
  topics: Topic[];
  selectedQuestions: PickerRow[];
  rules: ExamRule[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [mode, setMode] = useState<"manual" | "auto">(rules.length > 0 ? "auto" : "manual");
  const [chosen, setChosen] = useState<PickerRow[]>(selectedQuestions);
  const [busy, setBusy] = useState(false);

  // Manual picker state
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [results, setResults] = useState<PickerRow[]>([]);
  const [searching, setSearching] = useState(false);

  // Auto rule state
  const [ruleDrafts, setRuleDrafts] = useState<RuleDraft[]>(() =>
    rules.map((rule) => ({
      key: rule.id,
      id: rule.id,
      subject_id: rule.subject_id,
      topic_id: rule.topic_id ?? "",
      difficulty: rule.difficulty ?? "",
      question_count: rule.question_count,
      available: null,
    }))
  );

  const chosenIds = useMemo(() => new Set(chosen.map((row) => row.id)), [chosen]);
  const locked = exam.status !== "draft";

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search.trim()), 300);
    return () => window.clearTimeout(id);
  }, [search]);

  const runSearch = useCallback(async (): Promise<void> => {
    setSearching(true);
    try {
      let query = supabase
        .from("questions")
        .select("*, subjects (name), topics (name)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50);

      if (debounced) query = query.ilike("stem", `%${debounced}%`);
      if (subjectId) query = query.eq("subject_id", subjectId);
      if (topicId) query = query.eq("topic_id", topicId);
      if (difficulty) query = query.eq("difficulty", difficulty);

      const { data, error } = await query;
      if (error) throw error;
      setResults((data ?? []) as unknown as PickerRow[]);
    } catch (caught) {
      toast.error(errorMessage(caught, "Search failed"));
    } finally {
      setSearching(false);
    }
  }, [supabase, debounced, subjectId, topicId, difficulty, toast]);

  useEffect(() => {
    if (mode === "manual") void runSearch();
  }, [mode, runSearch]);

  const refreshAvailability = useCallback(
    async (draft: RuleDraft): Promise<number> => {
      const { data, error } = await supabase.rpc("count_available_questions", {
        p_subject_id: draft.subject_id || null,
        p_topic_id: draft.topic_id || null,
        p_difficulty: draft.difficulty ? (draft.difficulty as QuestionDifficulty) : null,
      });
      if (error) return 0;
      return typeof data === "number" ? data : 0;
    },
    [supabase]
  );

  useEffect(() => {
    if (mode !== "auto") return;
    let cancelled = false;
    void (async () => {
      const updated = await Promise.all(
        ruleDrafts.map(async (draft) => ({
          ...draft,
          available: draft.subject_id ? await refreshAvailability(draft) : null,
        }))
      );
      if (!cancelled) {
        setRuleDrafts((prev) =>
          prev.map((draft, index) => ({ ...draft, available: updated[index]?.available ?? null }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
    // Recompute when the rule shape changes, not on every keystroke of count
  }, [
    mode,
    refreshAvailability,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ruleDrafts.map((draft) => `${draft.subject_id}:${draft.topic_id}:${draft.difficulty}`).join("|"),
  ]);

  function toggleQuestion(row: PickerRow): void {
    setChosen((prev) =>
      prev.some((entry) => entry.id === row.id)
        ? prev.filter((entry) => entry.id !== row.id)
        : [...prev, row]
    );
  }

  async function saveManual(): Promise<void> {
    setBusy(true);
    try {
      const { error: deleteError } = await supabase
        .from("exam_questions")
        .delete()
        .eq("exam_id", exam.id);
      if (deleteError) throw deleteError;

      if (chosen.length > 0) {
        const { error: insertError } = await supabase.from("exam_questions").insert(
          chosen.map((row, index) => ({
            exam_id: exam.id,
            question_id: row.id,
            order_index: index,
          }))
        );
        if (insertError) throw insertError;
      }

      const { error: totalError } = await supabase
        .from("exams")
        .update({ total_marks: chosen.length * exam.marks_per_question })
        .eq("id", exam.id);
      if (totalError) throw totalError;

      toast.success(`${chosen.length} questions saved to this exam`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the question set"));
    } finally {
      setBusy(false);
    }
  }

  function addRule(): void {
    setRuleDrafts((prev) => [
      ...prev,
      {
        key: `draft-${prev.length}-${prev.reduce((sum, item) => sum + item.question_count, 0)}`,
        id: null,
        subject_id: subjects[0]?.id ?? "",
        topic_id: "",
        difficulty: "",
        question_count: 10,
        available: null,
      },
    ]);
  }

  function updateRule(key: string, patch: Partial<RuleDraft>): void {
    setRuleDrafts((prev) =>
      prev.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft))
    );
  }

  function removeRule(key: string): void {
    setRuleDrafts((prev) => prev.filter((draft) => draft.key !== key));
  }

  async function generate(): Promise<void> {
    const invalid = ruleDrafts.find(
      (draft) => draft.available !== null && draft.question_count > draft.available
    );
    if (invalid) {
      toast.error("One rule asks for more questions than are available");
      return;
    }

    setBusy(true);
    try {
      const { error: deleteError } = await supabase
        .from("exam_rules")
        .delete()
        .eq("exam_id", exam.id);
      if (deleteError) throw deleteError;

      if (ruleDrafts.length > 0) {
        const { error: insertError } = await supabase.from("exam_rules").insert(
          ruleDrafts.map((draft) => ({
            exam_id: exam.id,
            subject_id: draft.subject_id,
            topic_id: draft.topic_id || null,
            difficulty: draft.difficulty || null,
            question_count: draft.question_count,
          }))
        );
        if (insertError) throw insertError;
      }

      const { data, error: rpcError } = await supabase.rpc("generate_exam_questions", {
        p_exam_id: exam.id,
      });
      if (rpcError) throw rpcError;

      toast.success(`${typeof data === "number" ? data : 0} questions generated`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not generate the question set"));
    } finally {
      setBusy(false);
    }
  }

  const totalRuleCount = ruleDrafts.reduce((sum, draft) => sum + draft.question_count, 0);
  const pickerTopics = topics.filter((topic) => !subjectId || topic.subject_id === subjectId);

  return (
    <Card>
      <CardHeader
        title="Questions"
        subtitle={
          locked
            ? "This exam is published. Close it or duplicate it to change the question set."
            : "Pick questions manually, or set rules and let the system draw them"
        }
        action={
          <div className="flex rounded-md border border-dark-100 p-0.5">
            {(["manual", "auto"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={cn(
                  "rounded px-3 py-1 text-sm capitalize",
                  mode === option ? "bg-gold text-dark" : "text-dark-400 hover:text-dark"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        }
      />

      {mode === "manual" ? (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-gold-200 bg-gold-50 px-3 py-2 text-sm">
            <span className="font-medium text-dark">{chosen.length} questions selected</span>
            <span className="text-dark-500">
              Total {formatMarks(chosen.length * exam.marks_per_question)} marks
            </span>
            <Button
              size="sm"
              className="ml-auto"
              onClick={saveManual}
              loading={busy}
              disabled={locked}
            >
              Save question set
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="relative sm:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
              <Input
                placeholder="Search questions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={subjectId}
              onChange={(event) => {
                setSubjectId(event.target.value);
                setTopicId("");
              }}
            >
              <option value="">All subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Select value={topicId} onChange={(event) => setTopicId(event.target.value)}>
                <option value="">All topics</option>
                {pickerTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </Select>
              <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                <option value="">Any level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 max-h-96 overflow-auto">
            <Table>
              <thead className="sticky top-0">
                <tr>
                  <Th className="w-10" />
                  <Th>Question</Th>
                  <Th>Subject</Th>
                  <Th>Level</Th>
                </tr>
              </thead>
              <tbody>
                {searching ? (
                  <tr>
                    <Td colSpan={4} className="py-6 text-center text-dark-400">
                      Searching
                    </Td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <Td colSpan={4} className="py-6 text-center text-dark-400">
                      No active questions match those filters
                    </Td>
                  </tr>
                ) : (
                  results.map((row) => {
                    const picked = chosenIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={cn("cursor-pointer", picked ? "bg-gold-50" : "hover:bg-dark-50")}
                        onClick={() => !locked && toggleQuestion(row)}
                      >
                        <Td>
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border",
                              picked ? "border-gold bg-gold text-dark" : "border-dark-200"
                            )}
                          >
                            {picked ? <Check className="h-3 w-3" /> : null}
                          </span>
                        </Td>
                        <Td className="max-w-md">{truncate(stripHtml(row.stem), 110)}</Td>
                        <Td className="whitespace-nowrap text-dark-400">
                          {row.subjects?.name ?? "-"}
                        </Td>
                        <Td>
                          <StatusBadge value={row.difficulty} />
                        </Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>

          {chosen.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-dark-400">
                Selected
              </p>
              <div className="flex flex-wrap gap-1.5">
                {chosen.map((row, index) => (
                  <span
                    key={row.id}
                    className="inline-flex items-center gap-1 rounded-full border border-dark-100 bg-white px-2 py-0.5 text-xs text-dark"
                  >
                    {index + 1}. {truncate(stripHtml(row.stem), 40)}
                    {!locked ? (
                      <button
                        type="button"
                        onClick={() => toggleQuestion(row)}
                        className="text-dark-300 hover:text-danger"
                        aria-label="Remove question"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-gold-200 bg-gold-50 px-3 py-2 text-sm">
            <span className="font-medium text-dark">{totalRuleCount} questions across {ruleDrafts.length} rules</span>
            <span className="text-dark-500">
              Total {formatMarks(totalRuleCount * exam.marks_per_question)} marks
            </span>
            <Button
              size="sm"
              className="ml-auto"
              onClick={generate}
              loading={busy}
              disabled={locked || ruleDrafts.length === 0}
            >
              <Wand2 className="h-4 w-4" />
              Generate question set
            </Button>
          </div>

          <Table>
            <thead>
              <tr>
                <Th>Subject</Th>
                <Th>Topic</Th>
                <Th>Difficulty</Th>
                <Th className="w-28">Count</Th>
                <Th className="w-28">Available</Th>
                <Th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {ruleDrafts.map((draft) => {
                const short =
                  draft.available !== null && draft.question_count > draft.available;
                return (
                  <tr key={draft.key}>
                    <Td>
                      <select
                        value={draft.subject_id}
                        disabled={locked}
                        onChange={(event) =>
                          updateRule(draft.key, { subject_id: event.target.value, topic_id: "" })
                        }
                        className="w-full rounded border border-dark-100 px-2 py-1 text-sm"
                      >
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </Td>
                    <Td>
                      <select
                        value={draft.topic_id}
                        disabled={locked}
                        onChange={(event) => updateRule(draft.key, { topic_id: event.target.value })}
                        className="w-full rounded border border-dark-100 px-2 py-1 text-sm"
                      >
                        <option value="">Any topic</option>
                        {topics
                          .filter((topic) => topic.subject_id === draft.subject_id)
                          .map((topic) => (
                            <option key={topic.id} value={topic.id}>
                              {topic.name}
                            </option>
                          ))}
                      </select>
                    </Td>
                    <Td>
                      <select
                        value={draft.difficulty}
                        disabled={locked}
                        onChange={(event) =>
                          updateRule(draft.key, { difficulty: event.target.value })
                        }
                        className="w-full rounded border border-dark-100 px-2 py-1 text-sm"
                      >
                        <option value="">Any level</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </Td>
                    <Td>
                      <input
                        type="number"
                        min={1}
                        value={draft.question_count}
                        disabled={locked}
                        onChange={(event) =>
                          updateRule(draft.key, {
                            question_count: Math.max(1, Number(event.target.value)),
                          })
                        }
                        className="w-full rounded border border-dark-100 px-2 py-1 text-sm"
                      />
                    </Td>
                    <Td>
                      <span className={cn("text-sm", short ? "font-medium text-danger" : "text-dark-400")}>
                        {draft.available === null ? "..." : draft.available}
                      </span>
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => removeRule(draft.key)}
                        disabled={locked}
                        className="rounded p-1 text-dark-300 hover:bg-dark-50 hover:text-danger"
                        aria-label="Remove rule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="mt-3">
            <Button variant="ghost" size="sm" onClick={addRule} disabled={locked}>
              <Plus className="h-4 w-4" />
              Add rule
            </Button>
          </div>

          <p className="mt-3 text-xs text-dark-400">
            Generating replaces the current question set with a fresh random draw that matches
            these rules. Only active questions are used.
          </p>
        </>
      )}
    </Card>
  );
}
