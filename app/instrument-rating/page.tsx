import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/instrument-rating";

export const metadata: Metadata = {
  title: "Instrument Rating (IR) Training in Bangalore | WindChasers Aviation Academy",
  description:
    "DGCA Instrument Rating (IR) training in Bangalore, India. Learn to fly under IFR with ground classes and intensive flight training at WindChasers Aviation Academy.",
  alternates: { canonical: "/instrument-rating" },
  openGraph: {
    title: "Instrument Rating (IR) Training | WindChasers Aviation Academy",
    description:
      "DGCA Instrument Rating (IR) training in Bangalore, India with ground classes and flight training.",
    url: "/instrument-rating",
    type: "website",
  },
};

export default function Page() {
  return <ProgramPage content={content} slug="instrument-rating" />;
}
