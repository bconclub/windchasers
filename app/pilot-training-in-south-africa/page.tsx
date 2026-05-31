import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pilot-training-in-south-africa";

export const metadata = {
  title: "Pilot Training in South Africa | WindChasers Aviation Academy",
  description:
    "Train as a pilot in South Africa under SACAA. Affordable, excellent flying weather, CPL cost and duration, and study visa support.",
};

export default function Page() {
  return <ProgramPage content={content} slug="pilot-training-in-south-africa" />;
}
