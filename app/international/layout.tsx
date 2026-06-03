import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training Abroad | USA, Canada, NZ, Australia | WindChasers",
  description:
    "Pilot training abroad with WindChasers — DGCA-approved partner flight schools in the USA, Canada, New Zealand, Australia and more. Guidance on country choice, costs, visa and licensing for Indian students.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
