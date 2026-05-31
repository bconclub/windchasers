import ProgramPage from "@/components/ProgramPage";
import content from "@/content/programs/about";

export const metadata = {
  title: "About WindChasers Aviation Academy | Bangalore",
  description:
    "WindChasers started as a mother’s mission to help her daughter become a pilot. Today we guide aspiring aviators in Bangalore from fundamentals to CPL, with loan, visa and accommodation support.",
};

export default function Page() {
  return <ProgramPage content={content} slug="about" />;
}
