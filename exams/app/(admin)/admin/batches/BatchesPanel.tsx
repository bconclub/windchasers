"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog, Modal } from "@/components/ui/Modal";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { errorMessage, formatDate } from "@/lib/utils";
import type { Batch } from "@/lib/types";

export interface BatchRow extends Batch {
  student_count: number;
}

interface BatchDraft {
  id: string | null;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const emptyDraft: BatchDraft = {
  id: null,
  name: "",
  code: "",
  start_date: "",
  end_date: "",
  is_active: true,
};

export function BatchesPanel({ rows }: { rows: BatchRow[] }) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [draft, setDraft] = useState<BatchDraft | null>(null);
  const [deleting, setDeleting] = useState<BatchRow | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(): Promise<void> {
    if (!draft) return;
    if (!draft.name.trim() || !draft.code.trim()) {
      toast.error("Name and code are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        code: draft.code.trim().toUpperCase(),
        start_date: draft.start_date || null,
        end_date: draft.end_date || null,
        is_active: draft.is_active,
      };
      if (draft.id) {
        const { error } = await supabase.from("batches").update(payload).eq("id", draft.id);
        if (error) throw error;
        toast.success("Batch updated");
      } else {
        const { error } = await supabase.from("batches").insert(payload);
        if (error) throw error;
        toast.success("Batch created");
      }
      setDraft(null);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not save the batch"));
    } finally {
      setSaving(false);
    }
  }

  async function remove(): Promise<void> {
    if (!deleting) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("batches").delete().eq("id", deleting.id);
      if (error) throw error;
      toast.success("Batch deleted");
      setDeleting(null);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not delete the batch"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setDraft({ ...emptyDraft })}>
          <Plus className="h-4 w-4" />
          New batch
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-8 w-8" />}
          title="No batches yet"
          message="Create a batch, enroll students, then assign exams to the whole batch at once."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Batch</Th>
              <Th>Code</Th>
              <Th>Students</Th>
              <Th>Starts</Th>
              <Th>Ends</Th>
              <Th>Status</Th>
              <Th className="w-24">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-dark-50">
                <Td>
                  <Link
                    href={`/admin/batches/${row.id}`}
                    className="font-medium text-dark hover:text-gold-700"
                  >
                    {row.name}
                  </Link>
                </Td>
                <Td className="text-dark-400">{row.code}</Td>
                <Td>{row.student_count}</Td>
                <Td className="whitespace-nowrap text-dark-400">{formatDate(row.start_date)}</Td>
                <Td className="whitespace-nowrap text-dark-400">{formatDate(row.end_date)}</Td>
                <Td>
                  <Badge tone={row.is_active ? "success" : "neutral"}>
                    {row.is_active ? "active" : "inactive"}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          id: row.id,
                          name: row.name,
                          code: row.code,
                          start_date: row.start_date ?? "",
                          end_date: row.end_date ?? "",
                          is_active: row.is_active,
                        })
                      }
                      className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-dark"
                      aria-label="Edit batch"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(row)}
                      className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-danger"
                      aria-label="Delete batch"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit batch" : "New batch"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              Save
            </Button>
          </>
        }
      >
        {draft ? (
          <div className="space-y-4">
            <Input
              label="Name"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="CPL Ground School January 2026"
            />
            <Input
              label="Code"
              value={draft.code}
              onChange={(event) => setDraft({ ...draft, code: event.target.value })}
              placeholder="CPL-JAN26"
              hint="Used in the student CSV upload to place students automatically"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start date"
                type="date"
                value={draft.start_date}
                onChange={(event) => setDraft({ ...draft, start_date: event.target.value })}
              />
              <Input
                label="End date"
                type="date"
                value={draft.end_date}
                onChange={(event) => setDraft({ ...draft, end_date: event.target.value })}
              />
            </div>
            <Checkbox
              label="Active"
              description="Inactive batches stay in reports but are not offered for new assignments"
              checked={draft.is_active}
              onChange={(event) => setDraft({ ...draft, is_active: event.target.checked })}
            />
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this batch"
        message={`${deleting?.name ?? "This batch"} has ${deleting?.student_count ?? 0} students enrolled. Deleting removes the enrollments and any exam assignments made to this batch. Student accounts and attempts are kept.`}
        confirmLabel="Delete batch"
        destructive
        loading={saving}
        onConfirm={() => void remove()}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
