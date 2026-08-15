"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  Check,
  Download,
  FileQuestion,
  FolderTree,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Pagination, Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { errorMessage, stripHtml, truncate } from "@/lib/utils";
import type {
  OptionLetter,
  Question,
  QuestionDifficulty,
  QuestionStatus,
  Subject,
  Topic,
} from "@/lib/types";

const PAGE_SIZE = 25;

interface Row extends Question {
  subjects: { name: string } | null;
  topics: { name: string } | null;
}

export function QuestionsTable({
  subjects,
  topics,
}: {
  subjects: Subject[];
  topics: Topic[];
}) {
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{
    correct_option: OptionLetter;
    difficulty: QuestionDifficulty;
    status: QuestionStatus;
  } | null>(null);
  const [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignTopicId, setReassignTopicId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(id);
  }, [search]);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      let query = supabase
        .from("questions")
        .select("*, subjects (name), topics (name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (debounced) query = query.ilike("stem", `%${debounced}%`);
      if (subjectId) query = query.eq("subject_id", subjectId);
      if (topicId) query = query.eq("topic_id", topicId);
      if (difficulty) query = query.eq("difficulty", difficulty);
      if (status) query = query.eq("status", status);

      const { data, count, error } = await query;
      if (error) throw error;
      setRows((data ?? []) as unknown as Row[]);
      setTotal(count ?? 0);
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not load questions"));
    } finally {
      setLoading(false);
    }
  }, [supabase, page, debounced, subjectId, topicId, difficulty, status, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const subjectTopics = topics.filter((topic) => !subjectId || topic.subject_id === subjectId);

  function toggleRow(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(): void {
    setSelected((prev) =>
      prev.size === rows.length ? new Set() : new Set(rows.map((row) => row.id))
    );
  }

  function startEdit(row: Row): void {
    setEditingId(row.id);
    setEditDraft({
      correct_option: row.correct_option,
      difficulty: row.difficulty,
      status: row.status,
    });
  }

  async function saveEdit(id: string): Promise<void> {
    if (!editDraft) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("questions").update(editDraft).eq("id", id);
      if (error) throw error;
      toast.success("Question updated");
      setEditingId(null);
      setEditDraft(null);
      await load();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not update the question"));
    } finally {
      setBusy(false);
    }
  }

  async function runBulk(): Promise<void> {
    if (!confirm || selected.size === 0) return;
    setBusy(true);
    const ids = Array.from(selected);
    try {
      if (confirm === "archive") {
        const { error } = await supabase
          .from("questions")
          .update({ status: "archived" })
          .in("id", ids);
        if (error) throw error;
        toast.success(`${ids.length} questions archived`);
      } else {
        const { error } = await supabase.from("questions").delete().in("id", ids);
        if (error) throw error;
        toast.success(`${ids.length} questions deleted`);
      }
      setSelected(new Set());
      setConfirm(null);
      await load();
    } catch (caught) {
      toast.error(errorMessage(caught, "Bulk action failed"));
    } finally {
      setBusy(false);
    }
  }

  // Moves a filtered selection under a different topic. Subject follows the
  // topic so a question can never end up under a topic from another subject.
  async function reassignTopic(): Promise<void> {
    if (!reassignTopicId || selected.size === 0) return;
    const target = topics.find((topic) => topic.id === reassignTopicId);
    if (!target) return;

    setBusy(true);
    const ids = Array.from(selected);
    try {
      const { error } = await supabase
        .from("questions")
        .update({ topic_id: target.id, subject_id: target.subject_id })
        .in("id", ids);
      if (error) throw error;
      toast.success(`${ids.length} questions moved to ${target.name}`);
      setSelected(new Set());
      setReassignOpen(false);
      setReassignTopicId("");
      await load();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not reassign the topic"));
    } finally {
      setBusy(false);
    }
  }

  // Exports the whole bank under the current filters, not just the page on
  // screen, so the file matches what the filters describe.
  async function exportCsv(): Promise<void> {
    setBusy(true);
    try {
      let query = supabase
        .from("questions")
        .select(
          "stem, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, status, source, subjects(name), topics(name)"
        )
        .order("created_at", { ascending: false });

      if (debounced) query = query.ilike("stem", `%${debounced}%`);
      if (subjectId) query = query.eq("subject_id", subjectId);
      if (topicId) query = query.eq("topic_id", topicId);
      if (difficulty) query = query.eq("difficulty", difficulty);
      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;

      const exportRows = (data ?? []) as unknown as Array<
        Pick<
          Question,
          | "stem"
          | "option_a"
          | "option_b"
          | "option_c"
          | "option_d"
          | "correct_option"
          | "explanation"
          | "difficulty"
          | "status"
          | "source"
        > & { subjects: { name: string } | null; topics: { name: string } | null }
      >;

      const header = [
        "subject",
        "topic",
        "question",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_option",
        "explanation",
        "difficulty",
        "status",
        "source",
      ];
      const cell = (value: string | null): string =>
        `"${(value ?? "").replace(/"/g, '""')}"`;

      const lines = [
        header.join(","),
        ...exportRows.map((row) =>
          [
            cell(row.subjects?.name ?? ""),
            cell(row.topics?.name ?? ""),
            cell(stripHtml(row.stem)),
            cell(row.option_a),
            cell(row.option_b),
            cell(row.option_c),
            cell(row.option_d),
            cell(row.correct_option),
            cell(row.explanation),
            cell(row.difficulty),
            cell(row.status),
            cell(row.source),
          ].join(",")
        ),
      ];

      const blob = new Blob([`﻿${lines.join("\r\n")}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `question-bank-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${exportRows.length} questions`);
    } catch (caught) {
      toast.error(errorMessage(caught, "Export failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-4 grid gap-3 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
          <Input
            placeholder="Search question text"
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
            setPage(1);
          }}
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>
        <Select
          value={topicId}
          onChange={(event) => {
            setTopicId(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All topics</option>
          {subjectTopics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Any level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Any status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
      </div>

      {selected.size > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-gold-200 bg-gold-50 px-3 py-2">
          <span className="text-sm text-dark">{selected.size} selected</span>
          <Button size="sm" variant="ghost" onClick={() => setConfirm("archive")}>
            <Archive className="h-4 w-4" />
            Archive
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setReassignOpen(true)}>
            <FolderTree className="h-4 w-4" />
            Reassign topic
          </Button>
          <Button size="sm" variant="danger" onClick={() => setConfirm("delete")}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-sm text-dark-400 hover:text-dark"
          >
            Clear
          </button>
        </div>
      ) : null}

      <div className="mb-3 flex justify-end">
        <Button size="sm" variant="ghost" onClick={() => void exportCsv()} loading={busy}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-dark-400">Loading questions</p>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<FileQuestion className="h-8 w-8" />}
          title="No questions found"
          message="Adjust the filters, or add questions manually or by import."
        />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th className="w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === rows.length && rows.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-dark-200 text-gold focus:ring-gold"
                    aria-label="Select all"
                  />
                </Th>
                <Th>Question</Th>
                <Th>Subject</Th>
                <Th>Topic</Th>
                <Th>Answer</Th>
                <Th>Level</Th>
                <Th>Status</Th>
                <Th className="w-24">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const editing = editingId === row.id;
                return (
                  <tr key={row.id} className="hover:bg-dark-50">
                    <Td>
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="h-4 w-4 rounded border-dark-200 text-gold focus:ring-gold"
                        aria-label="Select question"
                      />
                    </Td>
                    <Td className="max-w-md">
                      <Link
                        href={`/admin/questions/${row.id}`}
                        className="text-dark hover:text-gold-700"
                      >
                        {truncate(stripHtml(row.stem), 110)}
                      </Link>
                    </Td>
                    <Td className="whitespace-nowrap text-dark-400">
                      {row.subjects?.name ?? "-"}
                    </Td>
                    <Td className="whitespace-nowrap text-dark-400">{row.topics?.name ?? "-"}</Td>
                    <Td>
                      {editing && editDraft ? (
                        <select
                          value={editDraft.correct_option}
                          onChange={(event) =>
                            setEditDraft({
                              ...editDraft,
                              correct_option: event.target.value as OptionLetter,
                            })
                          }
                          className="rounded border border-dark-100 px-1 py-0.5 text-sm"
                        >
                          {["A", "B", "C", "D"].map((letter) => (
                            <option key={letter} value={letter}>
                              {letter}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="font-medium">{row.correct_option}</span>
                      )}
                    </Td>
                    <Td>
                      {editing && editDraft ? (
                        <select
                          value={editDraft.difficulty}
                          onChange={(event) =>
                            setEditDraft({
                              ...editDraft,
                              difficulty: event.target.value as QuestionDifficulty,
                            })
                          }
                          className="rounded border border-dark-100 px-1 py-0.5 text-sm"
                        >
                          <option value="easy">easy</option>
                          <option value="medium">medium</option>
                          <option value="hard">hard</option>
                        </select>
                      ) : (
                        <StatusBadge value={row.difficulty} />
                      )}
                    </Td>
                    <Td>
                      {editing && editDraft ? (
                        <select
                          value={editDraft.status}
                          onChange={(event) =>
                            setEditDraft({
                              ...editDraft,
                              status: event.target.value as QuestionStatus,
                            })
                          }
                          className="rounded border border-dark-100 px-1 py-0.5 text-sm"
                        >
                          <option value="draft">draft</option>
                          <option value="active">active</option>
                          <option value="archived">archived</option>
                        </select>
                      ) : (
                        <StatusBadge value={row.status} />
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        {editing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void saveEdit(row.id)}
                              disabled={busy}
                              className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                              aria-label="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditDraft(null);
                              }}
                              className="rounded p-1 text-dark-400 hover:bg-dark-50"
                              aria-label="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(row)}
                            className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-dark"
                            aria-label="Quick edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={confirm !== null}
        title={confirm === "delete" ? "Delete questions" : "Archive questions"}
        message={
          confirm === "delete"
            ? `Permanently delete ${selected.size} questions. Questions already used in an exam cannot be deleted. This cannot be undone.`
            : `Archive ${selected.size} questions. Archived questions stay in the bank but are not picked for new exams.`
        }
        confirmLabel={confirm === "delete" ? "Delete" : "Archive"}
        destructive={confirm === "delete"}
        loading={busy}
        onConfirm={() => void runBulk()}
        onCancel={() => setConfirm(null)}
      />

      <Modal
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        title="Reassign topic"
        footer={
          <>
            <Button variant="ghost" onClick={() => setReassignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void reassignTopic()}
              loading={busy}
              disabled={!reassignTopicId}
            >
              Move {selected.size} questions
            </Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-dark-500">
          The subject is updated to match the topic you pick, so nothing ends up filed
          under another subject.
        </p>
        <Select
          label="Target topic"
          value={reassignTopicId}
          onChange={(event) => setReassignTopicId(event.target.value)}
        >
          <option value="">Select a topic</option>
          {subjects.map((subject) => (
            <optgroup key={subject.id} label={subject.name}>
              {topics
                .filter((topic) => topic.subject_id === subject.id)
                .map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </Select>
      </Modal>
    </>
  );
}
