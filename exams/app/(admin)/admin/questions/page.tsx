import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuestionsTable } from "./QuestionsTable";
import type { Subject, Topic } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Questions" };

export default async function QuestionsPage() {
  const supabase = getServerClient();
  const [{ data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("subjects").select("*").order("order_index"),
    supabase.from("topics").select("*").order("order_index"),
  ]);

  return (
    <>
      <PageHeader
        title="Questions"
        subtitle="The full question bank"
        action={
          <>
            <Link
              href="/admin/questions/import"
              className="inline-flex items-center gap-1.5 rounded-md border border-dark-100 px-3 py-2 text-sm text-dark hover:bg-dark-50"
            >
              <Upload className="h-4 w-4" />
              Import
            </Link>
            <Link
              href="/admin/questions/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-2 text-sm font-medium text-dark hover:bg-gold-600"
            >
              <Plus className="h-4 w-4" />
              New question
            </Link>
          </>
        }
      />
      <QuestionsTable
        subjects={(subjects ?? []) as Subject[]}
        topics={(topics ?? []) as Topic[]}
      />
    </>
  );
}
