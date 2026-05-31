import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/type-rating";

export const metadata = {
  title: "Aircraft Type Ratings | WindChasers Aviation Academy",
  description:
    "Type rating programs at WindChasers for the Airbus A320 and Boeing 737. Ground school, full-flight simulator, MCC & JOC, and base training for licensed CPL holders.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
