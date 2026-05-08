"use client";

import dynamic from "next/dynamic";
import type { FlightSchool } from "@/types/flight-school";

const FlightSchoolsMap = dynamic(() => import("./FlightSchoolsMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center bg-[#060b14]"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <p className="text-white/30 text-sm tracking-wide">Loading globe...</p>
    </div>
  ),
});

export default function FlightSchoolsClient({ schools }: { schools: FlightSchool[] }) {
  return <FlightSchoolsMap schools={schools} />;
}
