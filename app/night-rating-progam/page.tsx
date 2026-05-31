import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/night-rating-progam";

export const metadata: Metadata = {
  title: "Night Rating Program Training in Bangalore | WindChasers Aviation Academy",
  description:
    "DGCA Night Rating training in Bangalore, India. Learn night takeoffs, landings and navigation with ground classes and flight training at WindChasers Aviation Academy.",
  alternates: { canonical: "/night-rating-progam" },
  openGraph: {
    title: "Night Rating Program Training | WindChasers Aviation Academy",
    description:
      "DGCA Night Rating training in Bangalore, India with ground classes and practical flight training.",
    url: "/night-rating-progam",
    type: "website",
  },
};

export default function Page() {
  return <ProgramPage content={content} slug="night-rating-progam" />;
}
