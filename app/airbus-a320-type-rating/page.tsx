import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/airbus-a320-type-rating";

export const metadata = {
  title: "Airbus A320 Type Rating | WindChasers Aviation Academy",
  description:
    "Airbus A320 Type Rating with WindChasers. Ground school, Level D full flight simulator, MCC & JOC, line-oriented and base training. Eligibility: valid CPL with IR, Class 1 medical, ICAO Level 4. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
