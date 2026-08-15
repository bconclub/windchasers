import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { formatMarks } from "@/lib/utils";
import { BatchesPanel, type BatchRow } from "./BatchesPanel";
import type { Batch, BatchComparisonRow } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Batches" };

export default async function BatchesPage() {
  const supabase = getServerClient();
  const [{ data: batches }, { data: enrollments }, { data: comparison }] = await Promise.all([
    supabase.from("batches").select("*").order("name"),
    supabase.from("batch_enrollments").select("batch_id"),
    supabase.rpc("compare_batches"),
  ]);

  // Batch to batch comparison is how teaching changes get measured, so the
  // strongest and weakest cohorts sit next to each other rather than buried
  // in per batch pages.
  const comparisonRows = ((comparison ?? []) as BatchComparisonRow[])
    .slice()
    .sort((a, b) => (b.avg_score ?? -1) - (a.avg_score ?? -1));

  const counts = new Map<string, number>();
  for (const row of (enrollments ?? []) as Array<{ batch_id: string }>) {
    counts.set(row.batch_id, (counts.get(row.batch_id) ?? 0) + 1);
  }

  const rows: BatchRow[] = ((batches ?? []) as Batch[]).map((batch) => ({
    ...batch,
    student_count: counts.get(batch.id) ?? 0,
  }));

  return (
    <>
      <PageHeader title="Batches" subtitle="Groups students take exams as" />
      <BatchesPanel rows={rows} />

      <Card className="mt-8">
        <CardHeader
          title="Batch comparison"
          subtitle="Average score and accuracy across every batch you can see"
        />
        {comparisonRows.length === 0 ? (
          <p className="text-sm text-dark-400">No batches to compare yet.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Batch</Th>
                <Th>Students</Th>
                <Th>Attempts</Th>
                <Th>Average score</Th>
                <Th>Accuracy</Th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.batch_id}>
                  <Td>
                    <span className="font-medium text-dark">{row.name}</span>
                    <span className="ml-2 text-xs text-dark-400">{row.code}</span>
                  </Td>
                  <Td>{row.student_count}</Td>
                  <Td>{row.attempts}</Td>
                  <Td>{row.avg_score === null ? "-" : formatMarks(row.avg_score)}</Td>
                  <Td>{row.accuracy === null ? "-" : `${row.accuracy}%`}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
