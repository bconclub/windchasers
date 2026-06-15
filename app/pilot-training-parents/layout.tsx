import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training for Parents | WindChasers Aviation Academy",
  description:
    "Your child wants to be a pilot. Here's what that actually means. Cost, timeline, faculty, financing, no dream-selling. From one parent to another.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
