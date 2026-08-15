import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ImportWizard } from "./ImportWizard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Import questions" };

export default function ImportQuestionsPage() {
  return (
    <>
      <Link
        href="/admin/questions"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to questions
      </Link>
      <PageHeader
        title="Import questions"
        subtitle="Upload an Excel or CSV file, fix any flagged rows, then commit"
      />
      <ImportWizard />
    </>
  );
}
