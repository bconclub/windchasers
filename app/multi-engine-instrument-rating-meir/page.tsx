import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/multi-engine-instrument-rating-meir";

export const metadata: Metadata = {
  title: "Multi Engine Instrument Rating (MEIR) Training in Bangalore | WindChasers Aviation Academy",
  description:
    "DGCA Multi Engine Instrument Rating (MEIR) training in Bangalore, India. Fly multi-engine aircraft under IFR with ground classes and flight training at WindChasers Aviation Academy.",
  alternates: { canonical: "/multi-engine-instrument-rating-meir" },
  openGraph: {
    title: "Multi Engine Instrument Rating (MEIR) Training | WindChasers Aviation Academy",
    description:
      "DGCA MEIR training in Bangalore, India with ground classes and intensive flight training.",
    url: "/multi-engine-instrument-rating-meir",
    type: "website",
  },
};

export default function Page() {
  return <ProgramPage content={content} slug="multi-engine-instrument-rating-meir" />;
}
