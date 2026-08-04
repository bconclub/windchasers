import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ScholarshipApplicationForm from "@/components/ScholarshipApplicationForm";
import { getScholarshipForm, SCHOLARSHIP_FORMS } from "@/lib/scholarship-forms";

/** Both tracks are known at build time - two static pages, no runtime lookup. */
export function generateStaticParams() {
  return Object.keys(SCHOLARSHIP_FORMS).map((track) => ({ track }));
}

export function generateMetadata({ params }: { params: { track: string } }): Metadata {
  const config = getScholarshipForm(params.track);
  if (!config) return { title: "Scholarship | WindChasers" };
  return {
    title: `${config.title} | ${config.academy}`,
    description: `Apply for the ${config.academy} full scholarship. ${config.processNote}`,
    robots: { index: false, follow: false },
  };
}

export default function ScholarshipApplicationPage({ params }: { params: { track: string } }) {
  const config = getScholarshipForm(params.track);
  if (!config) notFound();

  return (
    // pt-24 clears the fixed navbar - without it the academy line and the
    // title render underneath the header bar.
    <main className="min-h-screen bg-[#141417] px-4 pb-14 pt-24 sm:px-6 sm:pt-28">
      <ScholarshipApplicationForm config={config} />
    </main>
  );
}
