import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/cadet-pilot-program";

export const metadata = {
  title: "Cadet Pilot Program | WindChasers Aviation Academy",
  description:
    "Specialized cadet pilot program preparation in Bangalore. Eligibility, the three-stage IndiGo-style selection process, and structured coaching in physics, maths, English, and aviation knowledge.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
