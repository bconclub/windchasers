import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/foreign-cpl";

export const metadata: Metadata = {
  title: "Foreign CPL & DGCA Conversion Guidance in Bangalore | WindChasers Aviation Academy",
  description:
    "Train for your Commercial Pilot License abroad and convert it to a DGCA CPL with WindChasers Aviation Academy in Bangalore, India. School selection, budgeting, and DGCA conversion exam preparation.",
  alternates: { canonical: "/foreign-cpl" },
};

export default function Page() {
  return <ProgramPage content={content} />;
}
