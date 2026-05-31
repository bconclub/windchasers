import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/commercial-pilot-license";

export const metadata = {
  title: "Commercial Pilot License (CPL) | WindChasers Aviation Academy",
  description:
    "Become a commercial pilot with WindChasers. CPL eligibility, DGCA check-ride requirements, and a clear path from ground school to the cockpit. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} slug="commercial-pilot-license" />;
}
