import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "International Flight Schools | WindChasers",
  description:
    "Explore certified flight academies worldwide. Compare costs, certifications, fleet size, and duration. Connect with schools that match your goals.",
};

const FlightSchoolsMap = dynamic(
  () => import("./components/FlightSchoolsMap"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full flex items-center justify-center bg-[#060b14]"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <p className="text-white/30 text-sm tracking-wide">Loading globe...</p>
      </div>
    ),
  }
);

export default function FlightSchoolsPage() {
  return (
    <main className="h-screen overflow-hidden bg-[#060b14]">
      <Navbar />
      {/* Map fills exactly the remaining viewport — no scroll, no footer */}
      <div className="pt-[80px] h-full">
        <FlightSchoolsMap />
      </div>
    </main>
  );
}
