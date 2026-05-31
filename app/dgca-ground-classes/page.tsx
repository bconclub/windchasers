import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/dgca-ground-classes";

export const metadata = {
  title: "DGCA Ground Classes | WindChasers Aviation Academy",
  description:
    "DGCA ground classes covering Air Navigation, Aviation Meteorology, Air Regulations, Technical General, Technical Specific and RTR. The theoretical foundation for your CPL. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} slug="dgca-ground-classes" />;
}
