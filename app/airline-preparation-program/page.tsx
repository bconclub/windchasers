import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/airline-preparation-program";

export const metadata = {
  title: "Airline Preparation Program | WindChasers Aviation Academy",
  description:
    "Bridge the gap from CPL to airline cockpit. WindChasers Airline Preparation Program covers written-exam coaching, group discussions, CASS training, and interview success strategies. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
