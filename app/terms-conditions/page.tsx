import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/terms-conditions";

export const metadata = {
  title: "Terms & Conditions | WindChasers Aviation Academy",
  description:
    "The terms governing your use of the WindChasers website and services. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
