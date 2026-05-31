import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/certified-flight-instructor";

export const metadata: Metadata = {
  title: "Certified Flight Instructor (CFI) Training in Bangalore | WindChasers Aviation Academy",
  description:
    "DGCA Certified Flight Instructor (CFI) training in Bangalore, India. Learn teaching techniques, lesson planning and flight demonstration at WindChasers Aviation Academy.",
  alternates: { canonical: "/certified-flight-instructor" },
  openGraph: {
    title: "Certified Flight Instructor (CFI) Training | WindChasers Aviation Academy",
    description:
      "DGCA CFI training in Bangalore, India with ground classes and practical flight training.",
    url: "/certified-flight-instructor",
    type: "website",
  },
};

export default function Page() {
  return <ProgramPage content={content} slug="certified-flight-instructor" />;
}
