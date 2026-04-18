import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training after +2 Complete Roadmap 2026 · WindChasers",
  description:
    "Free Zoom webinar: pilot training after Class 12, DGCA pathway, costs, cadet vs CPL, and your full 2026 roadmap.",
  openGraph: {
    title: "Pilot Training after +2 Complete Roadmap 2026 · WindChasers",
    description:
      "Live webinar on pilot training after +2 - the complete roadmap for 2026.",
    type: "website",
  },
};

export default function WebinarStudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
