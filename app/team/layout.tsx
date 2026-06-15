import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Meet the Team | WindChasers Aviation Academy",
  description:
    "The WindChasers team, ground instructors, CPL and helicopter advisors, and a cabin crew trainer with experience across the FAA, DGCA and international airlines. Bangalore, India.",
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <div className={manrope.variable}>{children}</div>;
}
