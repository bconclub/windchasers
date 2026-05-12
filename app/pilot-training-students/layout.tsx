import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training for Students | WindChasers Aviation Academy",
  description:
    "DGCA-aligned ground classes in Bengaluru. Flight training with DGCA-approved partner schools in India or abroad. Real costs, real timelines, no false promises.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
