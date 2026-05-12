import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training in Bangalore | WindChasers Aviation Academy",
  description:
    "You. In the cockpit. Inside two years. DGCA-aligned ground training in Bengaluru with DGCA-approved flying partners. Real costs, real guidance, no false promises.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
