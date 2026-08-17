"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, Td, Th } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import { errorMessage, toCsv } from "@/lib/utils";
import type { ImportResult, ImportRow } from "@/lib/types";

const COLUMNS = [
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
] as const;

type ColumnKey = (typeof COLUMNS)[number];

const REQUIRED: ColumnKey[] = [
  "subject",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_option",
];

const DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const CHUNK = 500;

function normalizeStem(text: string): string {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function cell(row: Record<string, unknown>, key: string): string {
  const found = Object.keys(row).find(
    (name) => name.trim().toLowerCase().replace(/\s+/g, "_") === key
  );
  const value = found ? row[found] : "";
  return value === null || value === undefined ? "" : String(value).trim();
}

function validateRow(row: ImportRow): string[] {
  const errors: string[] = [];
  for (const key of REQUIRED) {
    if (!row[key]) errors.push(`${key} is empty`);
  }
  const answer = row.correct_option.toUpperCase();
  if (row.correct_option && !["A", "B", "C", "D"].includes(answer)) {
    errors.push("correct_option must be A, B, C or D");
  }
  if (row.difficulty && !DIFFICULTIES.has(row.difficulty.toLowerCase())) {
    errors.push("difficulty must be easy, medium or hard");
  }
  return errors;
}

export function ImportWizard() {
  const router = useRouter();
  const toast = useToast();

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [parsing, setParsing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [onlyProblems, setOnlyProblems] = useState(false);

  const stats = useMemo(() => {
    if (!rows) return { valid: 0, invalid: 0, duplicates: 0 };
    return {
      valid: rows.filter((row) => row.errors.length === 0).length,
      invalid: rows.filter((row) => row.errors.length > 0).length,
      duplicates: rows.filter((row) => row.duplicate).length,
    };
  }, [rows]);

  const visible = useMemo(() => {
    if (!rows) return [];
    return onlyProblems ? rows.filter((row) => row.errors.length > 0 || row.duplicate) : rows;
  }, [rows, onlyProblems]);

  async function handleFile(file: File): Promise<void> {
    setParsing(true);
    setResult(null);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const seen = new Map<string, number>();
      const parsed: ImportRow[] = raw.map((entry, position) => {
        const row: ImportRow = {
          rowNumber: position + 2,
          subject: cell(entry, "subject"),
          topic: cell(entry, "topic"),
          question: cell(entry, "question"),
          option_a: cell(entry, "option_a"),
          option_b: cell(entry, "option_b"),
          option_c: cell(entry, "option_c"),
          option_d: cell(entry, "option_d"),
          correct_option: cell(entry, "correct_option").toUpperCase(),
          explanation: cell(entry, "explanation"),
          difficulty: cell(entry, "difficulty").toLowerCase() || "medium",
          errors: [],
          duplicate: false,
        };
        row.errors = validateRow(row);

        const key = normalizeStem(row.question);
        if (key) {
          if (seen.has(key)) row.duplicate = true;
          else seen.set(key, position);
        }
        return row;
      });

      setRows(parsed);
      setFileName(file.name);
      toast.success(`${parsed.length} rows parsed`);
    } catch (caught) {
      toast.error(errorMessage(caught, "Could not read that file"));
    } finally {
      setParsing(false);
    }
  }

  function updateCell(rowNumber: number, key: ColumnKey, value: string): void {
    setRows((prev) => {
      if (!prev) return prev;
      return prev.map((row) => {
        if (row.rowNumber !== rowNumber) return row;
        const next: ImportRow = { ...row, [key]: value };
        next.errors = validateRow(next);
        return next;
      });
    });
  }

  async function commit(): Promise<void> {
    if (!rows) return;
    const payload = rows.filter((row) => row.errors.length === 0);
    if (payload.length === 0) {
      toast.error("No valid rows to import");
      return;
    }

    setCommitting(true);
    const totals: ImportResult = {
      inserted: 0,
      skipped: 0,
      createdSubjects: [],
      createdTopics: [],
      duplicates: 0,
    };

    try {
      for (let start = 0; start < payload.length; start += CHUNK) {
        const chunk = payload.slice(start, start + CHUNK);
        const response = await fetch("/api/admin/questions/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: chunk }),
        });
        const body = (await response.json()) as ImportResult & { error?: string };
        if (!response.ok) throw new Error(body.error ?? "Import failed");

        totals.inserted += body.inserted;
        totals.skipped += body.skipped;
        totals.duplicates += body.duplicates;
        for (const name of body.createdSubjects) {
          if (!totals.createdSubjects.includes(name)) totals.createdSubjects.push(name);
        }
        for (const name of body.createdTopics) {
          if (!totals.createdTopics.includes(name)) totals.createdTopics.push(name);
        }
      }

      setResult(totals);
      setRows(null);
      toast.success(`${totals.inserted} questions imported`);
      router.refresh();
    } catch (caught) {
      toast.error(errorMessage(caught, "Import failed"));
    } finally {
      setCommitting(false);
    }
  }

  function downloadTemplate(): void {
    const csv = toCsv([...COLUMNS], [
      [
        "Air Navigation",
        "Great Circle",
        "What is the shortest distance between two points on the earth surface?",
        "Rhumb line",
        "Great circle",
        "Small circle",
        "Meridian",
        "B",
        "A great circle is the shortest path between two points on a sphere.",
        "medium",
      ],
    ]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "question-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (result) {
    return (
      <Card className="max-w-2xl">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div>
            <h2 className="text-base font-semibold text-dark">Import complete</h2>
            <ul className="mt-2 space-y-1 text-sm text-dark-500">
              <li>{result.inserted} questions inserted</li>
              <li>{result.duplicates} flagged as duplicates of existing questions</li>
              {result.skipped > 0 ? <li>{result.skipped} rows skipped</li> : null}
              {result.createdSubjects.length > 0 ? (
                <li>Subjects created: {result.createdSubjects.join(", ")}</li>
              ) : null}
              {result.createdTopics.length > 0 ? (
                <li>Topics created: {result.createdTopics.join(", ")}</li>
              ) : null}
            </ul>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => router.push("/admin/questions")}>View questions</Button>
              <Button variant="ghost" onClick={() => setResult(null)}>
                Import another file
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!rows) {
    return (
      <Card className="max-w-2xl">
        <CardHeader
          title="Upload a file"
          subtitle="Excel (.xlsx, .xls) or CSV. The first sheet is used."
          action={
            <Button variant="ghost" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4" />
              Template
            </Button>
          }
        />

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-dark-100 px-6 py-12 text-center hover:bg-dark-50">
          <FileSpreadsheet className="mb-3 h-8 w-8 text-dark-300" />
          <span className="text-sm font-medium text-dark">
            {parsing ? "Reading file" : "Click to choose a file"}
          </span>
          <span className="mt-1 text-xs text-dark-400">
            Columns: {COLUMNS.join(", ")}
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            disabled={parsing}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>

        <div className="mt-4 rounded-md border border-line bg-dark-50 p-3 text-xs text-dark-500">
          <p className="font-medium text-dark">Notes</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            <li>Missing subjects and topics are created automatically.</li>
            <li>correct_option must be A, B, C or D. difficulty defaults to medium.</li>
            <li>Questions whose text matches an existing question are flagged, not blocked.</li>
            <li>Imported questions are created with status active.</li>
          </ul>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-dark">
          <FileSpreadsheet className="h-4 w-4 text-dark-400" />
          {fileName}
        </div>
        <Badge tone="success">{stats.valid} ready</Badge>
        {stats.invalid > 0 ? <Badge tone="danger">{stats.invalid} with errors</Badge> : null}
        {stats.duplicates > 0 ? (
          <Badge tone="warning">{stats.duplicates} duplicates in file</Badge>
        ) : null}

        <label className="ml-auto flex items-center gap-2 text-sm text-dark-500">
          <input
            type="checkbox"
            checked={onlyProblems}
            onChange={(event) => setOnlyProblems(event.target.checked)}
            className="h-4 w-4 rounded border-dark-200 text-gold focus:ring-gold"
          />
          Show only rows needing attention
        </label>

        <Button variant="ghost" onClick={() => setRows(null)} disabled={committing}>
          Cancel
        </Button>
        <Button onClick={commit} loading={committing} disabled={stats.valid === 0}>
          <Upload className="h-4 w-4" />
          Import {stats.valid} questions
        </Button>
      </div>

      {stats.invalid > 0 ? (
        <p className="mb-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Rows with errors are skipped unless you fix them here. Edit any cell directly in the
          table below.
        </p>
      ) : null}

      <div className="max-h-[32rem] overflow-auto">
        <Table>
          <thead className="sticky top-0">
            <tr>
              <Th className="w-12">Row</Th>
              {COLUMNS.map((column) => (
                <Th key={column}>{column}</Th>
              ))}
              <Th>Issues</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.rowNumber}
                className={row.errors.length > 0 ? "bg-red-50/40" : row.duplicate ? "bg-amber-50/40" : ""}
              >
                <Td className="text-dark-400">{row.rowNumber}</Td>
                {COLUMNS.map((column) => (
                  <Td key={column} className="min-w-[8rem] max-w-[16rem]">
                    <input
                      value={row[column]}
                      onChange={(event) => updateCell(row.rowNumber, column, event.target.value)}
                      className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm hover:border-dark-100 focus:border-gold focus:bg-surface focus:outline-none"
                    />
                  </Td>
                ))}
                <Td className="min-w-[12rem]">
                  {row.errors.length > 0 ? (
                    <span className="text-xs text-danger">{row.errors.join("; ")}</span>
                  ) : row.duplicate ? (
                    <span className="flex items-center gap-1 text-xs text-amber-700">
                      <Copy className="h-3 w-3" />
                      Duplicate in this file
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-700">Ready</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
