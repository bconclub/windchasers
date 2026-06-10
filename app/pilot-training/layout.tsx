import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training in Bangalore — CPL, DGCA Ground Classes & Exam Coaching | WindChasers",
  description:
    "WindChasers is a Bangalore aviation academy for pilot training programs after 12th — DGCA ground classes & DGCA exam coaching in-house, Commercial Pilot License (CPL) training with DGCA-approved partner FTOs in India and abroad. Learn how to become a pilot in India.",
  alternates: { canonical: "https://windchasers.in/pilot-training" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
