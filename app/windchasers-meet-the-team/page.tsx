import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/windchasers-meet-the-team";

export const metadata = {
  title: "Meet the Team | WindChasers Aviation Academy",
  description:
    "The WindChasers team — ground instructors, CPL and helicopter advisors, and a cabin crew trainer with experience across the FAA, DGCA and international airlines. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} slug="windchasers-meet-the-team" />;
}
