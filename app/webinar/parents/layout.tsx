import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parents Webinar · April 25, 2026 · WindChasers",
  description:
    "Free Zoom webinar for parents: aviation career paths, costs, cadet vs CPL, and how to plan 2026 with your child.",
  openGraph: {
    title: "Parents Webinar · WindChasers",
    description: "Free live webinar for parents: aviation careers, costs, and planning together.",
    type: "website",
  },
};

export default function WebinarParentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
