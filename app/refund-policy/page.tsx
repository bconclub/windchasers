import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/refund-policy";

export const metadata = {
  title: "Refund Policy | WindChasers Aviation Academy",
  description:
    "WindChasers cancellation and refund policy, including reporting timeframes and refund processing times. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
