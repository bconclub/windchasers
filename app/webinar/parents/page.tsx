import type { Metadata } from "next";
import WebinarLanding from "@/components/webinar/WebinarLanding";

export const metadata: Metadata = {
  title: "Parents Webinar · April 25, 2026 · WindChasers",
  description:
    "Free Zoom webinar for parents: aviation career paths, planning for 2026, and how to support your child.",
  openGraph: {
    title: "Parents Webinar · WindChasers",
    description: "Free live webinar for parents - aviation careers and planning.",
    type: "website",
  },
};

const LEARN = [
  "Indian aviation careers explained for families - what paths exist and how they differ",
  "Training timelines, costs, and what to expect at each stage",
  "Stable PSU-style roles vs airline/CPL routes - when each makes sense",
  "How you can support your child’s preparation and decisions",
  "Live Q&A on your questions",
] as const;

export default function WebinarParentsPage() {
  return (
    <WebinarLanding
      webinarTitle="Parents - plan your child’s aviation career with clarity"
      heroSubtitle="Free Zoom webinar for parents: career paths, realistic timelines, and how to plan for 2026 together."
      learnItems={LEARN}
      learnColumnTitle="What you'll learn"
      heroVisualSrc="/open%20house/WC%20Open%20house%20April%2015.jpg"
      heroVisualAlt="WindChasers session for parents and students"
      visualTagline="Clear answers for families navigating aviation careers."
    />
  );
}
