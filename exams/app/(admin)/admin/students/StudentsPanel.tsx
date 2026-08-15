"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  KeyRound,
  Search,
  Upload,
  UserPlus,
  Users,
  UserX,
  UserCheck,
} from "lucide-react";
import * as XLSX from "xlsx";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { errorMessage, formatDate, toCsv } from "@/lib/utils";
import type { Batch, Profile } from "@/lib/types";

export interface StudentRow extends Profile {
  batches: Array<{ id: string; name: string; code: string }>;
}

interface BulkRow {
  name: string;
  email: string;
  phone: string;
  batch_code: string;
}

interface BulkResponse {
  created: number;
  invited: number;
  enrolled: number;
  failures: Array<{ email: string; reason: string }>;
  error?: string;
}

export function StudentsPanel({ rows, batches }: { rows: StudentRow[]; batches: Batch[] }) {
  const router = useRouter();
  const supabase = useMemo(() => getBrowserClient(), []);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: "", email: "", phone: "", batch_id: "" });
  const [adding, setAdding] = useState(false);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);
  const [bulkResult, setBulkResult] = useState<BulkResponse | null>(null);
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (
        needle &&
        !row.full_name.toLowerCase().includes(needle) &&
        !row.email.toLowerCase().includes(needle) &&
        !(row.phone ?? "").includes(needle)
      ) {
        return false;
      }
      if (batchFilter && !row.batches.some((batch) => batch.id === batchFilter)) return false;
      if (statusFilter === "active" && !row.is_active) return false;
      if (statusFilter === "inactive" && row.is_active) return false;
      return true;
    });
  }, [rows, search, batchFilter, statusFilter]);

  async function addStudent(): Promise<void> {
    if (!addForm.email.trim() || !addForm.full_name.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setAdding(true);
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Could not add the student");
      toast.success("Student invited by email");
      setAddOpen(false);
      setAddForm({ full_name: "", email: "", phone: "", batch_id: "" });
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not add the student"));
    } finally {
      setAdding(false);
    }
  }

  async function toggleActive(row: StudentRow): Promise<void> {
    setBusyId(row.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !row.is_active })
        .eq("id", row.id);
      if (error) throw error;
      toast.success(row.is_active ? "Student deactivated" : "Student activated");
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not change the status"));
    } finally {
      setBusyId(null);
    }
  }

  async function resetPassword(row: StudentRow): Promise<void> {
    setBusyId(row.id);
    try {
      const response = await fetch("/api/admin/students/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: row.email }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Could not send the reset email");
      toast.success(`Reset link sent to ${row.email}`);
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not send the reset email"));
    } finally {
      setBusyId(null);
    }
  }

  async function parseBulkFile(file: File): Promise<void> {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const pick = (entry: Record<string, unknown>, key: string): string => {
        const found = Object.keys(entry).find(
          (name) => name.trim().toLowerCase().replace(/\s+/g, "_") === key
        );
        return found ? String(entry[found] ?? "").trim() : "";
      };

      setBulkRows(
        raw
          .map((entry) => ({
            name: pick(entry, "name"),
            email: pick(entry, "email"),
            phone: pick(entry, "phone"),
            batch_code: pick(entry, "batch_code"),
          }))
          .filter((row) => row.email.length > 0)
      );
      setBulkResult(null);
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not read that file"));
    }
  }

  async function commitBulk(): Promise<void> {
    if (bulkRows.length === 0) return;
    setUploading(true);
    try {
      const response = await fetch("/api/admin/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: bulkRows }),
      });
      const body = (await response.json()) as BulkResponse;
      if (!response.ok) throw new Error(body.error ?? "Bulk upload failed");
      setBulkResult(body);
      toast.success(`${body.created} students created`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Bulk upload failed"));
    } finally {
      setUploading(false);
    }
  }

  function exportStudents(): void {
    const csv = toCsv(
      ["Name", "Email", "Phone", "Batches", "Status", "Joined"],
      filtered.map((row) => [
        row.full_name,
        row.email,
        row.phone ?? "",
        row.batches.map((batch) => batch.code).join(" "),
        row.is_active ? "active" : "inactive",
        row.created_at,
      ])
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mb-4 grid gap-3 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
          <Input
            placeholder="Search name, email or phone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)}>
          <option value="">All batches</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAddOpen(true)} className="flex-1">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
          <Button variant="ghost" onClick={() => setBulkOpen(true)}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={exportStudents}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No students found"
          message="Add a student individually or upload a CSV with name, email, phone and batch_code."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Batches</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th className="w-40">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-dark-50">
                <Td>
                  <Link
                    href={`/admin/students/${row.id}`}
                    className="font-medium text-dark hover:text-gold-700"
                  >
                    {row.full_name || "Unnamed"}
                  </Link>
                </Td>
                <Td className="text-dark-400">{row.email}</Td>
                <Td className="text-dark-400">{row.phone ?? "-"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {row.batches.length === 0 ? (
                      <span className="text-xs text-dark-300">None</span>
                    ) : (
                      row.batches.map((batch) => (
                        <Badge key={batch.id} tone="neutral">
                          {batch.code}
                        </Badge>
                      ))
                    )}
                  </div>
                </Td>
                <Td>
                  <Badge tone={row.is_active ? "success" : "neutral"}>
                    {row.is_active ? "active" : "inactive"}
                  </Badge>
                </Td>
                <Td className="whitespace-nowrap text-dark-400">{formatDate(row.created_at)}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => void toggleActive(row)}
                      disabled={busyId === row.id}
                      title={row.is_active ? "Deactivate" : "Activate"}
                      aria-label={row.is_active ? "Deactivate" : "Activate"}
                      className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-dark"
                    >
                      {row.is_active ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => void resetPassword(row)}
                      disabled={busyId === row.id}
                      title="Send password reset"
                      aria-label="Send password reset"
                      className="rounded p-1 text-dark-400 hover:bg-dark-50 hover:text-dark"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a student"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={adding}>
              Cancel
            </Button>
            <Button onClick={addStudent} loading={adding}>
              Create and invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            value={addForm.full_name}
            onChange={(event) => setAddForm({ ...addForm, full_name: event.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={addForm.email}
            onChange={(event) => setAddForm({ ...addForm, email: event.target.value })}
            hint="An invite email is sent so the student can set a password"
          />
          <Input
            label="Phone"
            value={addForm.phone}
            onChange={(event) => setAddForm({ ...addForm, phone: event.target.value })}
          />
          <Select
            label="Batch"
            value={addForm.batch_id}
            onChange={(event) => setAddForm({ ...addForm, batch_id: event.target.value })}
          >
            <option value="">No batch</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </Select>
        </div>
      </Modal>

      <Modal
        open={bulkOpen}
        onClose={() => {
          setBulkOpen(false);
          setBulkRows([]);
          setBulkResult(null);
        }}
        title="Bulk upload students"
        width="max-w-2xl"
        footer={
          bulkResult ? (
            <Button
              onClick={() => {
                setBulkOpen(false);
                setBulkRows([]);
                setBulkResult(null);
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setBulkOpen(false)} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={commitBulk} loading={uploading} disabled={bulkRows.length === 0}>
                Create {bulkRows.length} students
              </Button>
            </>
          )
        }
      >
        {bulkResult ? (
          <div className="space-y-2 text-sm text-dark-500">
            <p>{bulkResult.created} students created and invited.</p>
            <p>{bulkResult.enrolled} batch enrollments added.</p>
            {bulkResult.failures.length > 0 ? (
              <div>
                <p className="font-medium text-dark">Skipped rows</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                  {bulkResult.failures.map((failure) => (
                    <li key={failure.email}>
                      {failure.email}: {failure.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : bulkRows.length === 0 ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-dark-100 px-6 py-10 text-center hover:bg-dark-50">
            <Upload className="mb-2 h-6 w-6 text-dark-300" />
            <span className="text-sm font-medium text-dark">Choose a CSV or Excel file</span>
            <span className="mt-1 text-xs text-dark-400">
              Columns: name, email, phone, batch_code
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void parseBulkFile(file);
              }}
            />
          </label>
        ) : (
          <div className="max-h-80 overflow-auto">
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Batch code</Th>
                </tr>
              </thead>
              <tbody>
                {bulkRows.map((row) => (
                  <tr key={row.email}>
                    <Td>{row.name}</Td>
                    <Td>{row.email}</Td>
                    <Td>{row.phone}</Td>
                    <Td>{row.batch_code}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal>
    </>
  );
}
