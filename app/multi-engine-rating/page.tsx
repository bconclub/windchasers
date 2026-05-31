import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/multi-engine-rating";

export const metadata: Metadata = {
  title: "Multi Engine Rating (ME) Training in Bangalore | WindChasers Aviation Academy",
  description:
    "DGCA Multi Engine Rating training in Bangalore, India. Learn multi-engine handling, engine-out scenarios and asymmetric flight at WindChasers Aviation Academy.",
  alternates: { canonical: "/multi-engine-rating" },
  openGraph: {
    title: "Multi Engine Rating Training | WindChasers Aviation Academy",
    description:
      "DGCA Multi Engine Rating training in Bangalore, India with ground classes and flight training.",
    url: "/multi-engine-rating",
    type: "website",
  },
};

export default function Page() {
  return <ProgramPage content={content} />;
}
