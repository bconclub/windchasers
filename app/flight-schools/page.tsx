import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getPublicFlightSchools } from "@/lib/flight-schools/queries";
import FlightSchoolsClient from "./components/FlightSchoolsClient";

export const metadata: Metadata = {
  title: "International Flight Schools | WindChasers",
  description:
    "Explore certified flight academies worldwide. Compare costs, certifications, fleet size, and duration. Connect with schools that match your goals.",
};

// Render on every request so admin curation (verification flips, new
// imports) shows up immediately. Switch back to ISR (revalidate = 300)
// + on-demand revalidation once the curation workflow stabilizes.
export const dynamic = "force-dynamic";

export default async function FlightSchoolsPage() {
  // Don't fail the route if Supabase is briefly unreachable — render with
  // an empty list and let the next revalidation backfill.
  let schools: Awaited<ReturnType<typeof getPublicFlightSchools>> = [];
  try {
    schools = await getPublicFlightSchools();
  } catch (err) {
    console.error("[/flight-schools] Supabase fetch failed:", err);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#060b14]">
      <Navbar />
      <div className="pt-[80px] h-full">
        <FlightSchoolsClient schools={schools} />
      </div>
    </main>
  );
}
