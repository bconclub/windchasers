import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { PracticeSession } from "./PracticeSession";
import type { Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Practice" };

export default async function PracticePage() {
  const supabase = getServerClient();
  const [{ data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("subjects").select("*").order("order_index"),
    supabase.from("topics").select("*").order("order_index"),
  ]);

  return (
    <>
      <PageHeader
        title="Practice"
        subtitle="Untimed practice with instant feedback. Practice answers are not scored."
      />
      <PracticeSession
        subjects={(subjects ?? []) as Subject[]}
        topics={(topics ?? []) as Topic[]}
      />
    </>
  );
}
