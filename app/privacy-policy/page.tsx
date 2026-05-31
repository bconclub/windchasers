import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/privacy-policy";

export const metadata = {
  title: "Privacy Policy | WindChasers Aviation Academy",
  description:
    "How WindChasers collects, uses, and protects your data. Read our privacy policy. Bangalore, India.",
};

export default function Page() {
  return <ProgramPage content={content} />;
}
