import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pilot-training-in-india";

export const metadata = {
  title: "Pilot Training in India | WindChasers Aviation Academy",
  description:
    "Train as a pilot in India under DGCA. Cost advantage, diverse flying conditions, CPL duration, eligibility, and full guidance through DGCA examinations and licensing.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
