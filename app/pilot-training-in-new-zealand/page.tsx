import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pilot-training-in-new-zealand";

export const metadata = {
  title: "Pilot Training in New Zealand | WindChasers Aviation Academy",
  description:
    "Train as a pilot in New Zealand under CAA NZ. Uncongested airspace, diverse terrain, CPL cost and duration, and student visa support.",
};

export default function Page() {
  return <ProgramPage content={content} slug="pilot-training-in-new-zealand" />;
}
