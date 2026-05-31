import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/airline";

export const metadata = {
  title: "Airline Pilot Programs | WindChasers Aviation Academy",
  description:
    "WindChasers airline-track programs: pre-cadet, cadet pilot, airline preparation, and airline cadet & interview training. A structured path from selection to the right seat.",
};

export default function Page() {
  return <ProgramPage content={content} slug="airline" />;
}
