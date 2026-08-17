"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Copy,
  Lock,
  Search,
  Send,
  Users,
} from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { errorMessage, formatDateTime, formatMarks } from "@/lib/utils";
import type { Exam } from "@/lib/types";

export interface ExamRow extends Exam {
  question_count: number;
  attempt_count: number;
}

export function ExamsTable({ rows }: { rows: ExamRow[] }) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [closing, setClosing] = useState<ExamRow | null>(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle && !row.title.toLowerCase().includes(needle)) return false;
      if (status && row.status !== status) return false;
      return true;
    });
  }, [rows, search, status]);

  async function publish(exam: ExamRow): Promise<void> {
    if (exam.question_count === 0) {
      toast.error("Add questions before publishing");
      return;
    }
    setBusyId(exam.id);
    try {
      const { error } = await supabase
        .from("exams")
        .update({
          status: "published",
          total_marks: exam.question_count * exam.marks_per_question,
        })
        .eq("id", exam.id);
      if (error) throw error;
      toast.success("Exam published");
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not publish"));
    } finally {
      setBusyId(null);
    }
  }

  async function close(exam: ExamRow): Promise<void> {
    setBusyId(exam.id);
    try {
      const { error } = await supabase.from("exams").update({ status: "closed" }).eq("id", exam.id);
      if (error) throw error;
      toast.success("Exam closed");
      setClosing(null);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not close"));
    } finally {
      setBusyId(null);
    }
  }

  async function duplicate(exam: ExamRow): Promise<void> {
    setBusyId(exam.id);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: created, error } = await supabase
        .from("exams")
        .insert({
          title: `${exam.title} (copy)`,
          description: exam.description,
          type: exam.type,
          duration_minutes: exam.duration_minutes,
          total_marks: exam.total_marks,
          marks_per_question: exam.marks_per_question,
          negative_marks: exam.negative_marks,
          shuffle_questions: exam.shuffle_questions,
          shuffle_options: exam.shuffle_options,
          show_result_immediately: exam.show_result_immediately,
          allow_review: exam.allow_review,
          max_attempts: exam.max_attempts,
          status: "draft",
          created_by: userData.user?.id ?? null,
        })
        .select("id")
        .single<{ id: string }>();
      if (error) throw error;

      const { data: questions } = await supabase
        .from("exam_questions")
        .select("question_id, order_index")
        .eq("exam_id", exam.id);

      const list = (questions ?? []) as Array<{ question_id: string; order_index: number }>;
      if (list.length > 0) {
        const { error: copyError } = await supabase.from("exam_questions").insert(
          list.map((entry) => ({
            exam_id: created.id,
            question_id: entry.question_id,
            order_index: entry.order_index,
          }))
        );
        if (copyError) throw copyError;
      }

      const { data: rules } = await supabase
        .from("exam_rules")
        .select("subject_id, topic_id, difficulty, question_count")
        .eq("exam_id", exam.id);
      const ruleList = (rules ?? []) as Array<{
        subject_id: string;
        topic_id: string | null;
        difficulty: string | null;
        question_count: number;
      }>;
      if (ruleList.length > 0) {
        await supabase
          .from("exam_rules")
          .insert(ruleList.map((rule) => ({ ...rule, exam_id: created.id })));
      }

      toast.success("Exam duplicated as a draft");
      router.push(`/admin/exams/${created.id}`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not duplicate"));
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-8 w-8" />}
        title="No exams yet"
        message="Create an exam, add questions manually or by rules, then assign it to a batch."
        action={
          <Link
            href="/admin/exams/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-sm font-medium text-dark hover:bg-gold-600"
          >
            New exam
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
          <Input
            placeholder="Search exam titles"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="closed">Closed</option>
        </Select>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Exam</Th>
            <Th>Questions</Th>
            <Th>Marks</Th>
            <Th>Window</Th>
            <Th>Attempts</Th>
            <Th>Status</Th>
            <Th className="w-64">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.id} className="hover:bg-dark-50">
              <Td>
                <Link href={`/admin/exams/${row.id}`} className="font-medium text-dark hover:text-gold-700">
                  {row.title}
                </Link>
                <span className="mt-0.5 block text-xs capitalize text-dark-400">
                  {row.type} - {row.duration_minutes} min
                </span>
              </Td>
              <Td>{row.question_count}</Td>
              <Td className="whitespace-nowrap">
                {formatMarks(row.total_marks)}
                {row.negative_marks > 0 ? (
                  <span className="block text-xs text-dark-400">
                    minus {formatMarks(row.negative_marks)} per wrong
                  </span>
                ) : null}
              </Td>
              <Td className="whitespace-nowrap text-xs text-dark-400">
                {formatDateTime(row.opens_at)}
                <br />
                {formatDateTime(row.closes_at)}
              </Td>
              <Td>{row.attempt_count}</Td>
              <Td>
                <StatusBadge value={row.status} />
              </Td>
              <Td>
                <div className="flex flex-wrap items-center gap-1">
                  {row.status === "draft" ? (
                    <Button
                      size="sm"
                      onClick={() => void publish(row)}
                      loading={busyId === row.id}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Publish
                    </Button>
                  ) : null}
                  {row.status === "published" ? (
                    <Button size="sm" variant="ghost" onClick={() => setClosing(row)}>
                      <Lock className="h-3.5 w-3.5" />
                      Close
                    </Button>
                  ) : null}
                  <Link
                    href={`/admin/exams/${row.id}/assign`}
                    className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-xs text-dark hover:bg-dark-50"
                  >
                    <Users className="h-3.5 w-3.5" />
                    Assign
                  </Link>
                  <Link
                    href={`/admin/exams/${row.id}/results`}
                    className="inline-flex items-center gap-1 rounded border border-line px-2 py-1 text-xs text-dark hover:bg-dark-50"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Results
                  </Link>
                  <button
                    type="button"
                    onClick={() => void duplicate(row)}
                    disabled={busyId === row.id}
                    className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-dark"
                    aria-label="Duplicate exam"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmDialog
        open={closing !== null}
        title="Close this exam"
        message="Students will not be able to start or resume attempts. Attempts in progress are auto submitted at their deadline."
        confirmLabel="Close exam"
        destructive
        loading={busyId !== null}
        onConfirm={() => closing && void close(closing)}
        onCancel={() => setClosing(null)}
      />
    </>
  );
}
