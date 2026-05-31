import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/contact-us";

export const metadata = {
  title: "Contact WindChasers Aviation Academy | Bangalore",
  description:
    "Contact WindChasers in Kothanur, Bengaluru. Call +91 90350 98425 or +91 95910 04043, email aviators@windchasers.in, or visit us. Pilot training guidance and demo sessions.",
};

export default function Page() {
  return <ProgramPage content={content} slug="contact-us" />;
}
