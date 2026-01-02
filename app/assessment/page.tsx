import { Suspense } from "react";
import AssessmentForm from "@/components/AssessmentForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PAT - Pilot Aptitude Test | WindChasers Aviation Academy",
  description: "20 questions. 3 minutes. Instant results + personalized guidance",
};

export default function AssessmentPage() {
  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[2.5rem] md:text-6xl font-bold mb-6 text-white">
            PAT<br />
            <span className="text-gold">Pilot Aptitude Test</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            20 questions. 3 minutes. Instant results + personalized guidance
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-8">Loading assessment...</div>}>
          <AssessmentForm />
        </Suspense>
      </div>
    </div>
  );
}
