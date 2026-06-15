import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/diploma-in-aviation";

export const metadata = {
  title: "Diploma in Aviation | WindChasers Aviation Academy",
  description:
    "An integrated Diploma in Aviation for commercial pilots, PPL, CPL, Multi-Engine Instrument Rating, Night Rating and VFR Over The Top, combining ground school with flight training. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} slug="diploma-in-aviation" />;
}
