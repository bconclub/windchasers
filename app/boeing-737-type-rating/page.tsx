import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/boeing-737-type-rating";

export const metadata = {
  title: "Boeing 737 Type Rating | WindChasers Aviation Academy",
  description:
    "Boeing 737 Type Rating with WindChasers. Ground school, full flight simulator, MCC, JOC, LOFT, and base training. Eligibility: valid CPL with IR, Class 1 medical, ICAO Level 4. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} slug="boeing-737-type-rating" />;
}
