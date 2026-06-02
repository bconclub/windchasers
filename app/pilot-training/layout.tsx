import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training in Bangalore | CPL & DGCA Ground Classes | WindChasers",
  description:
    "Pilot training in Bangalore for aspirants after 12th. DGCA ground classes in-house, commercial pilot license (CPL) training with DGCA-approved partner FTOs in India and abroad. Real costs, real guidance, no false promises.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
