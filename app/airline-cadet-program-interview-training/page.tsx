import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/airline-cadet-program-interview-training";

export const metadata = {
  title: "Airline Cadet Program Interview Training | WindChasers Aviation Academy",
  description:
    "Airline cadet program interview training in Bangalore. Three-phase prep covering the written test, ADAPT simulator assessments, group discussion, and personal interviews with experienced instructors.",
};

export default function Page() {
  return <ProgramPage content={content} slug="airline-cadet-program-interview-training" />;
}
