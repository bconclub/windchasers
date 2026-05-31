import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/pilot-training-in-usa";

export const metadata = {
  title: "Pilot Training in USA | WindChasers Aviation Academy",
  description:
    "Train as a pilot in the USA under the FAA. Year-round flying weather, world-class infrastructure, CPL cost and duration, and M-1 visa and SEVIS support.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
