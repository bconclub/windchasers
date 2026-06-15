import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/with-the-founder";

export const metadata = {
  title: "With the Founder, Sumaiya Ali | WindChasers Aviation Academy",
  description:
    "Book a one-to-one with WindChasers founder Sumaiya Ali at our Bengaluru HQ. Honest, no-pressure guidance on eligibility, training, funding and the path to becoming a pilot.",
};

export default function Page() {
  return <ProgramPage content={content} slug="with-the-founder" />;
}
