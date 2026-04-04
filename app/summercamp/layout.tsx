import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summer Camp 2025 | WindChasers - Drone & Aviation Camp for Kids Bangalore",
  description: "5-day summer camp for kids aged 8-15. Fly real drones, pilot certified flight simulators, build robots, explore aircraft. STEM learning with DGCA recognized instructors in Bangalore. Enroll now!",
  keywords: ["summer camp", "aviation camp", "drone camp", "STEM camp", "kids summer camp Bangalore", "pilot training kids", "robotics camp", "aerospace camp"],
  openGraph: {
    title: "Summer Camp 2025 | WindChasers - Drone & Aviation Camp for Kids",
    description: "5-day summer camp for kids aged 8-15. Fly real drones, pilot certified flight simulators, build robots, explore aircraft.",
    type: "website",
  },
};

export default function SummerCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
