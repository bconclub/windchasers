import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pre-cadet-program";

export const metadata = {
  title: "Pre-Cadet Program | WindChasers Aviation Academy",
  description:
    "Prepare for competitive airline cadet selection with the WindChasers Pre-Cadet Program: written-exam prep, interview readiness, CASS training, and airline-specific guidance. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
