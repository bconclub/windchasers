import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/license-conversion-course";

export const metadata: Metadata = {
  title: "Pilot License Conversion Course (DGCA) in Bangalore | WindChasers Aviation Academy",
  description:
    "Convert your foreign FAA, SACAA, or ICAO pilot licence to a DGCA licence with WindChasers Aviation Academy in Bangalore, India. Conversion exam preparation, documentation, and application support.",
  alternates: { canonical: "/license-conversion-course" },
};

export default function Page() {
  return <ProgramPage content={content} slug="license-conversion-course" />;
}
