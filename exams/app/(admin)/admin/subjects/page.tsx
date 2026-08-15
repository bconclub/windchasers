import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { SubjectsPanel } from "./SubjectsPanel";
import type { Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Subjects" };

export default async function SubjectsPage() {
  const supabase = getServerClient();
  const [{ data: subjects }, { data: topics }, { data: questions }] = await Promise.all([
    supabase.from("subjects").select("*").order("order_index"),
    supabase.from("topics").select("*").order("order_index"),
    supabase.from("questions").select("subject_id, topic_id").eq("status", "active"),
  ]);

  const bySubject = new Map<string, number>();
  const byTopic = new Map<string, number>();
  for (const row of (questions ?? []) as Array<{ subject_id: string; topic_id: string | null }>) {
    bySubject.set(row.subject_id, (bySubject.get(row.subject_id) ?? 0) + 1);
    if (row.topic_id) byTopic.set(row.topic_id, (byTopic.get(row.topic_id) ?? 0) + 1);
  }

  return (
    <>
      <PageHeader
        title="Subjects and topics"
        subtitle="Drag to reorder. The order here is the order students see."
      />
      <SubjectsPanel
        subjects={(subjects ?? []) as Subject[]}
        topics={(topics ?? []) as Topic[]}
        subjectCounts={Object.fromEntries(bySubject)}
        topicCounts={Object.fromEntries(byTopic)}
      />
    </>
  );
}
