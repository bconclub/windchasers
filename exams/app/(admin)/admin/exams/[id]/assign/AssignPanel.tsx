"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Save, Search, Users } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { cn, errorMessage } from "@/lib/utils";
import type { Batch, Exam, ExamAssignment, Profile } from "@/lib/types";

/** Postgres timestamptz to the value shape a datetime-local input wants. */
function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function AssignPanel({
  exam,
  batches,
  students,
  assignments,
}: {
  exam: Exam;
  batches: Batch[];
  students: Profile[];
  assignments: ExamAssignment[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [batchIds, setBatchIds] = useState<Set<string>>(
    () =>
      new Set(
        assignments
          .map((assignment) => assignment.batch_id)
          .filter((id): id is string => id !== null)
      )
  );
  const [studentIds, setStudentIds] = useState<Set<string>>(
    () =>
      new Set(
        assignments
          .map((assignment) => assignment.student_id)
          .filter((id): id is string => id !== null)
      )
  );
  const [opensAt, setOpensAt] = useState(toLocalInput(exam.opens_at));
  const [closesAt, setClosesAt] = useState(toLocalInput(exam.closes_at));
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredStudents = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return students;
    return students.filter(
      (student) =>
        student.full_name.toLowerCase().includes(needle) ||
        student.email.toLowerCase().includes(needle)
    );
  }, [students, search]);

  function toggle(set: Set<string>, id: string, apply: (next: Set<string>) => void): void {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    apply(next);
  }

  async function save(): Promise<void> {
    if (opensAt && closesAt && new Date(opensAt) >= new Date(closesAt)) {
      toast.error("The close time must be after the open time");
      return;
    }

    setSaving(true);
    try {
      const { error: windowError } = await supabase
        .from("exams")
        .update({
          opens_at: opensAt ? new Date(opensAt).toISOString() : null,
          closes_at: closesAt ? new Date(closesAt).toISOString() : null,
        })
        .eq("id", exam.id);
      if (windowError) throw windowError;

      const { error: clearError } = await supabase
        .from("exam_assignments")
        .delete()
        .eq("exam_id", exam.id);
      if (clearError) throw clearError;

      const rows = [
        ...Array.from(batchIds).map((batchId) => ({
          exam_id: exam.id,
          batch_id: batchId,
          student_id: null,
        })),
        ...Array.from(studentIds).map((studentId) => ({
          exam_id: exam.id,
          batch_id: null,
          student_id: studentId,
        })),
      ];

      if (rows.length > 0) {
        const { error: insertError } = await supabase.from("exam_assignments").insert(rows);
        if (insertError) throw insertError;
      }

      toast.success(`Assigned to ${batchIds.size} batches and ${studentIds.size} students`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the assignment"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl">
        <CardHeader
          title="Exam window"
          subtitle="Students can only start inside this window"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Opens at"
            type="datetime-local"
            value={opensAt}
            onChange={(event) => setOpensAt(event.target.value)}
            hint="Leave empty to open immediately"
          />
          <Input
            label="Closes at"
            type="datetime-local"
            value={closesAt}
            onChange={(event) => setClosesAt(event.target.value)}
            hint="Leave empty for no close time"
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Batches"
            subtitle={`${batchIds.size} selected. Every enrolled student gets the exam.`}
          />
          {batches.length === 0 ? (
            <p className="text-sm text-dark-400">No batches yet.</p>
          ) : (
            <div className="space-y-1.5">
              {batches.map((batch) => {
                const active = batchIds.has(batch.id);
                return (
                  <button
                    key={batch.id}
                    type="button"
                    onClick={() => toggle(batchIds, batch.id, setBatchIds)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm",
                      active ? "border-gold bg-gold-50" : "border-dark-100 hover:bg-dark-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                        active ? "border-gold bg-gold text-dark" : "border-dark-200"
                      )}
                    >
                      {active ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="flex-1">
                      <span className="font-medium text-dark">{batch.name}</span>
                      <span className="ml-2 text-xs text-dark-400">{batch.code}</span>
                    </span>
                    {!batch.is_active ? (
                      <span className="text-xs text-dark-400">inactive</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Individual students"
            subtitle={`${studentIds.size} selected in addition to batches`}
          />
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-sm text-dark-400">No students match that search.</p>
          ) : (
            <div className="max-h-80 space-y-1.5 overflow-y-auto">
              {filteredStudents.map((student) => {
                const active = studentIds.has(student.id);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggle(studentIds, student.id, setStudentIds)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm",
                      active ? "border-gold bg-gold-50" : "border-dark-100 hover:bg-dark-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                        active ? "border-gold bg-gold text-dark" : "border-dark-200"
                      )}
                    >
                      {active ? <Check className="h-3 w-3" /> : null}
                    </span>
                    <span className="flex-1 truncate">
                      <span className="font-medium text-dark">{student.full_name || "Unnamed"}</span>
                      <span className="ml-2 text-xs text-dark-400">{student.email}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} loading={saving}>
          <Save className="h-4 w-4" />
          Save assignment
        </Button>
        <p className="flex items-center gap-1.5 text-sm text-dark-400">
          <Users className="h-4 w-4" />
          {batchIds.size} batches, {studentIds.size} individual students
        </p>
      </div>
    </div>
  );
}
