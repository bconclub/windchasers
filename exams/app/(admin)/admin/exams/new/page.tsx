import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExamSettingsForm } from "../ExamSettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "New exam" };

export default function NewExamPage() {
  return (
    <>
      <Link
        href="/admin/exams"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to exams
      </Link>
      <PageHeader
        title="New exam"
        subtitle="Set the rules first. You pick questions on the next screen."
      />
      <div className="max-w-4xl">
        <ExamSettingsForm exam={null} />
      </div>
    </>
  );
}
