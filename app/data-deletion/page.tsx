import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/data-deletion";

export const metadata = {
  title: "Data Deletion Request | WindChasers Aviation Academy",
  description:
    "Request deletion of personal data associated with WindChasers, including Instagram, WhatsApp, website chat, and PROXe-powered systems.",
};

export default function Page() {
  return <ProgramPage content={content} slug="data-deletion" />;
}
