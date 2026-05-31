import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/private-pilot-license";

export const metadata: Metadata = {
  title: "Private Pilot License (PPL) Training in Bangalore | WindChasers Aviation Academy",
  description:
    "Begin your flying career with a DGCA Private Pilot License (PPL) at WindChasers Aviation Academy in Bangalore. Ground classes, dual and solo flight training, eligibility, and a clear path to becoming a pilot in India.",
  alternates: { canonical: "/private-pilot-license" },
};

export default function Page() {
  return <ProgramPage content={content} />;
}
