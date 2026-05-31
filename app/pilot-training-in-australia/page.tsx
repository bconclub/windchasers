import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pilot-training-in-australia";

export const metadata = {
  title: "Pilot Training in Australia | WindChasers Aviation Academy",
  description:
    "Train as a pilot in Australia under CASA. Ideal flying conditions, modern fleets, CPL cost and duration, and subclass 500 student visa support.",
};

export default function Page() {
  return <ProgramPage content={content} slug="pilot-training-in-australia" />;
}
