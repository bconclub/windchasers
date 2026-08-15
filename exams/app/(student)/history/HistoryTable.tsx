"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { History, Search } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { Card, CardHeader } from "@/components/ui/Card";
import { ScoreTrend } from "@/components/charts/Charts";
import { formatDateTime, formatDuration, formatMarks, percent } from "@/lib/utils";

export interface HistoryRow {
  id: string;
  examTitle: string;
  examType: string;
  totalMarks: number;
  status: string;
  score: number | null;
  correct: number;
  incorrect: number;
  unattempted: number;
  totalQuestions: number;
  timeTakenSeconds: number | null;
  submittedAt: string | null;
  startedAt: string;
}

export function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle && !row.examTitle.toLowerCase().includes(needle)) return false;
      if (status && row.status !== status) return false;
      if (type && row.examType !== type) return false;
      return true;
    });
  }, [rows, search, status, type]);

  // The trend follows the filters, so narrowing to one subject shows whether
  // revision moved that subject rather than the overall average.
  const trendPoints = useMemo(
    () =>
      filtered
        .filter((row) => row.submittedAt !== null && row.totalMarks > 0)
        .slice()
        .sort(
          (a, b) =>
            new Date(a.submittedAt ?? 0).getTime() - new Date(b.submittedAt ?? 0).getTime()
        )
        .map((row) => ({
          label: formatDateTime(row.submittedAt),
          percent: percent(row.score ?? 0, row.totalMarks),
        })),
    [filtered]
  );

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-8 w-8" />}
        title="No attempts yet"
        message="Your completed exams will appear here."
      />
    );
  }

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-300" />
          <Input
            placeholder="Search by exam title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="in_progress">In progress</option>
          <option value="submitted">Submitted</option>
          <option value="auto_submitted">Auto submitted</option>
          <option value="expired">Expired</option>
        </Select>
        <Select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">All types</option>
          <option value="practice">Practice</option>
          <option value="mock">Mock</option>
          <option value="assignment">Assignment</option>
        </Select>
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Score trend"
          subtitle="Percentage of total marks, oldest attempt first"
        />
        <ScoreTrend points={trendPoints} />
      </Card>

      <Table>
        <thead>
          <tr>
            <Th>Exam</Th>
            <Th>Score</Th>
            <Th>Accuracy</Th>
            <Th>Correct</Th>
            <Th>Time</Th>
            <Th>Status</Th>
            <Th>Submitted</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row) => {
            const answered = row.correct + row.incorrect;
            return (
              <tr key={row.id} className="hover:bg-dark-50">
                <Td>
                  {row.status === "in_progress" ? (
                    <span className="text-dark">{row.examTitle}</span>
                  ) : (
                    <Link href={`/result/${row.id}`} className="text-gold-700 hover:underline">
                      {row.examTitle}
                    </Link>
                  )}
                  <span className="mt-0.5 block text-xs capitalize text-dark-400">
                    {row.examType}
                  </span>
                </Td>
                <Td className="whitespace-nowrap">
                  {row.status === "in_progress"
                    ? "-"
                    : `${formatMarks(row.score)} / ${formatMarks(row.totalMarks)}`}
                </Td>
                <Td>{answered > 0 ? `${percent(row.correct, answered)}%` : "-"}</Td>
                <Td className="whitespace-nowrap text-dark-400">
                  {row.correct} of {row.totalQuestions}
                </Td>
                <Td className="whitespace-nowrap">{formatDuration(row.timeTakenSeconds)}</Td>
                <Td>
                  <StatusBadge value={row.status} />
                </Td>
                <Td className="whitespace-nowrap text-dark-400">
                  {formatDateTime(row.submittedAt ?? row.startedAt)}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-dark-400">No attempts match those filters.</p>
      ) : null}
    </>
  );
}
