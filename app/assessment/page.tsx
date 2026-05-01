import { Suspense } from "react";
import AssessmentForm from "@/components/AssessmentForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PAT - Pilot Aptitude Test | WindChasers Aviation Academy",
  description:
    "20 questions. About 3 minutes. Instant results plus personalised guidance.",
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col pt-24 pb-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center py-8">
        <Suspense
          fallback={
            <div className="text-center py-16">
              <div className="inline-block w-10 h-10 border-2 border-[#C5A572]/40 border-t-[#C5A572] rounded-full animate-spin" />
            </div>
          }
        >
          <AssessmentForm />
        </Suspense>
      </div>
    </div>
  );
}
