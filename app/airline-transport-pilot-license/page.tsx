import type { Metadata } from "next";
import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/airline-transport-pilot-license";

export const metadata: Metadata = {
  title: "Airline Transport Pilot License (ATPL) Training in Bangalore | WindChasers Aviation Academy",
  description:
    "Plan your DGCA Airline Transport Pilot License (ATPL) with WindChasers Aviation Academy in Bangalore, India. Theory exam preparation, hour-building guidance, eligibility, and the pathway to airline command.",
  alternates: { canonical: "/airline-transport-pilot-license" },
};

export default function Page() {
  return <ProgramPage content={content} />;
}
