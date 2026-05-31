import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/helicopter-training";

export const metadata = {
  title: "Helicopter Pilot Training (CHPL) | WindChasers Aviation Academy",
  description:
    "DGCA-approved Commercial Helicopter Pilot License (CHPL) training at WindChasers. One-year program with 150 flying hours, expert instructors, and a clear path into rotor-wing aviation. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
