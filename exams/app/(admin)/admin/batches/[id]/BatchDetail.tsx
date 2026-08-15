"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Save, Search } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { cn, errorMessage, formatMarks } from "@/lib/utils";
import type { BatchPerformancePayload, Profile } from "@/lib/types";

export function BatchDetail({
  batchId,
  enrolledIds,
  students,
  performance,
}: {
  batchId: string;
  enrolledIds: string[];
  students: Profile[];
  performance: BatchPerformancePayload;
}) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [selected, setSelected] = useState<Set<string>>(() => new Set(enrolledIds));
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return students;
    return students.filter(
      (student) =>
        student.full_name.toLowerCase().includes(needle) ||
        student.email.toLowerCase().includes(needle)
    );
  }, [students, search]);

  function toggle(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveEnrollments(): Promise<void> {
    setSaving(true);
    try {
      const current = new Set(enrolledIds);
      const toAdd = Array.from(selected).filter((id) => !current.has(id));
      const toRemove = enrolledIds.filter((id) => !selected.has(id));

      if (toRemove.length > 0) {
        const { error } = await supabase
          .from("batch_enrollments")
          .delete()
          .eq("batch_id", batchId)
          .in("student_id", toRemove);
        if (error) throw error;
      }
      if (toAdd.length > 0) {
        const { error } = await supabase
          .from("batch_enrollments")
          .insert(toAdd.map((studentId) => ({ batch_id: batchId, student_id: studentId })));
        if (error) throw error;
      }

      toast.success(`${selected.size} students enrolled`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save enrollments"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Enrolled students"
          subtitle={`${selected.size} selected`}
          action={
            <Button size="sm" onClick={saveEnrollments} loading={saving}>
              <Save className="h-4 w-4" />
              Save
            </Button>
          }
        />

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
          <Input
            placeholder="Search students"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-dark-400">No students match that search.</p>
        ) : (
          <div className="max-h-96 space-y-1.5 overflow-y-auto">
            {filtered.map((student) => {
              const active = selected.has(student.id);
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => toggle(student.id)}
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

      <Card>
        <CardHeader title="Batch performance" subtitle="Across every exam this batch has taken" />
        {performance.students.length === 0 ? (
          <p className="text-sm text-dark-400">No students enrolled yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Student</Th>
                <Th>Attempts</Th>
                <Th>Average score</Th>
                <Th>Accuracy</Th>
              </tr>
            </thead>
            <tbody>
              {performance.students.map((row) => (
                <tr key={row.id} className="hover:bg-dark-50">
                  <Td>
                    <Link
                      href={`/admin/students/${row.id}`}
                      className="text-dark hover:text-gold-700"
                    >
                      {row.full_name || "Unnamed"}
                    </Link>
                    <span className="block text-xs text-dark-400">{row.email}</span>
                  </Td>
                  <Td>{row.attempts}</Td>
                  <Td>{row.avg_score === null ? "-" : formatMarks(row.avg_score)}</Td>
                  <Td>{row.accuracy === null ? "-" : `${row.accuracy}%`}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
