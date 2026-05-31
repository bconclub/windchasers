import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pilot-training-in-canada";

export const metadata = {
  title: "Pilot Training in Canada | WindChasers Aviation Academy",
  description:
    "Train as a pilot in Canada under Transport Canada. Four-season flying, immigration pathways, CPL cost and duration, and study permit support.",
};

export default function Page() {
  return <ProgramPage content={content} slug="pilot-training-in-canada" />;
}
