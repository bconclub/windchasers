import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DGCA Ground Classes in Bangalore | WindChasers Aviation Academy",
  description:
    "DGCA ground classes in Bangalore covering all six DGCA papers — Air Navigation, Aviation Meteorology, Air Regulations, Aircraft Technical (General & Specific) and Radio Telephony. Live classes, mock tests, expert instructors.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
