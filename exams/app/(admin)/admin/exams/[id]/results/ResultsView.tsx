"use client";

import { useMemo } from "react";
import { Award, Clock, Download, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, Table, Td, Th } from "@/components/ui/Table";
import { ScoreDistribution } from "@/components/charts/Charts";
import {
  cn,
  formatDateTime,
  formatDuration,
  formatMarks,
  stripHtml,
  toCsv,
  truncate,
} from "@/lib/utils";
import type { ExamAnalyticsPayload, OptionLetter } from "@/lib/types";

const LETTERS: OptionLetter[] = ["A", "B", "C", "D"];

export function ResultsView({
  payload,
  examId,
}: {
  payload: ExamAnalyticsPayload;
  examId: string;
}) {
  const scores = useMemo(
    () => payload.leaderboard.map((row) => row.score ?? 0),
    [payload.leaderboard]
  );

  function exportLeaderboard(): void {
    const csv = toCsv(
      [
        "Rank",
        "Student",
        "Email",
        "Score",
        "Total marks",
        "Correct",
        "Incorrect",
        "Unattempted",
        "Time taken",
        "Tab switches",
        "Submitted at",
      ],
      payload.leaderboard.map((row) => [
        row.rank,
        row.student_name,
        row.email,
        row.score ?? 0,
        payload.exam?.total_marks ?? 0,
        row.correct_count,
        row.incorrect_count,
        row.unattempted_count,
        formatDuration(row.time_taken_seconds),
        row.tab_switch_count,
        row.submitted_at ?? "",
      ])
    );
    download(csv, `exam-${examId}-leaderboard.csv`);
  }

  function exportQuestionAnalytics(): void {
    const csv = toCsv(
      ["Order", "Question", "Correct option", "Attempted", "Correct", "Percent correct", "A", "B", "C", "D"],
      payload.question_analytics.map((row) => [
        row.order_index + 1,
        stripHtml(row.stem),
        row.correct_option,
        row.attempted,
        row.correct,
        row.percent_correct,
        row.option_counts.A,
        row.option_counts.B,
        row.option_counts.C,
        row.option_counts.D,
      ])
    );
    download(csv, `exam-${examId}-question-analytics.csv`);
  }

  function download(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (payload.summary.attempts === 0) {
    return (
      <EmptyState
        icon={<Users className="h-8 w-8" />}
        title="No submitted attempts yet"
        message="Results appear here once students submit."
      />
    );
  }

  const totalMarks = payload.exam?.total_marks ?? 0;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Attempts"
          value={payload.summary.attempts}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Average score"
          value={`${formatMarks(payload.summary.avg_score)} / ${formatMarks(totalMarks)}`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Highest score"
          value={formatMarks(payload.summary.high_score)}
          icon={<Award className="h-4 w-4" />}
          hint={`Lowest ${formatMarks(payload.summary.low_score)}`}
        />
        <StatCard
          label="Average time"
          value={formatDuration(payload.summary.avg_time_seconds)}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader
            title="Score distribution"
            subtitle="Share of the total marks achieved"
          />
          <ScoreDistribution scores={scores} maxScore={totalMarks} />
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader
            title="Leaderboard"
            action={
              <Button variant="ghost" size="sm" onClick={exportLeaderboard}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            }
          />
          <Table>
            <thead>
              <tr>
                <Th className="w-12">Rank</Th>
                <Th>Student</Th>
                <Th>Score</Th>
                <Th>Correct</Th>
                <Th>Incorrect</Th>
                <Th>Unattempted</Th>
                <Th>Time</Th>
                <Th>Tab switches</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody>
              {payload.leaderboard.map((row) => (
                <tr key={row.attempt_id} className="hover:bg-dark-50">
                  <Td className="font-medium">{row.rank}</Td>
                  <Td>
                    <span className="block font-medium text-dark">{row.student_name}</span>
                    <span className="block text-xs text-dark-400">{row.email}</span>
                  </Td>
                  <Td className="whitespace-nowrap font-medium">
                    {formatMarks(row.score)} / {formatMarks(totalMarks)}
                  </Td>
                  <Td>{row.correct_count}</Td>
                  <Td>{row.incorrect_count}</Td>
                  <Td>{row.unattempted_count}</Td>
                  <Td className="whitespace-nowrap">{formatDuration(row.time_taken_seconds)}</Td>
                  <Td>
                    {row.tab_switch_count > 0 ? (
                      <Badge tone="warning">{row.tab_switch_count}</Badge>
                    ) : (
                      <span className="text-dark-300">0</span>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-dark-400">
                    {formatDateTime(row.submitted_at)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader
            title="Question analytics"
            subtitle="Low percent correct points at a weak topic or a bad question"
            action={
              <Button variant="ghost" size="sm" onClick={exportQuestionAnalytics}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            }
          />
          <Table>
            <thead>
              <tr>
                <Th className="w-12">Q</Th>
                <Th>Question</Th>
                <Th>Answer</Th>
                <Th>Attempted</Th>
                <Th>Percent correct</Th>
                <Th>Option split</Th>
                <Th>Most picked wrong</Th>
              </tr>
            </thead>
            <tbody>
              {payload.question_analytics.map((row) => {
                const wrongOptions = LETTERS.filter((letter) => letter !== row.correct_option);
                const mostPickedWrong = wrongOptions.reduce((best, letter) =>
                  row.option_counts[letter] > row.option_counts[best] ? letter : best
                );
                const wrongCount = row.option_counts[mostPickedWrong];

                return (
                  <tr key={row.question_id} className="hover:bg-dark-50">
                    <Td className="text-dark-400">{row.order_index + 1}</Td>
                    <Td className="max-w-sm">{truncate(stripHtml(row.stem), 90)}</Td>
                    <Td className="font-medium">{row.correct_option}</Td>
                    <Td>{row.attempted}</Td>
                    <Td>
                      <span
                        className={cn(
                          "font-medium",
                          row.percent_correct < 40
                            ? "text-danger"
                            : row.percent_correct < 70
                              ? "text-amber-700"
                              : "text-emerald-700"
                        )}
                      >
                        {row.percent_correct}%
                      </span>
                    </Td>
                    <Td>
                      <div className="flex gap-1.5 text-xs text-dark-400">
                        {LETTERS.map((letter) => (
                          <span
                            key={letter}
                            className={cn(
                              "rounded px-1.5 py-0.5",
                              letter === row.correct_option
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-dark-50"
                            )}
                          >
                            {letter} {row.option_counts[letter]}
                          </span>
                        ))}
                      </div>
                    </Td>
                    <Td>
                      {wrongCount > 0 ? (
                        <Badge tone="danger">
                          {mostPickedWrong} picked {wrongCount} times
                        </Badge>
                      ) : (
                        <span className="text-xs text-dark-300">None</span>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </div>
    </>
  );
}
