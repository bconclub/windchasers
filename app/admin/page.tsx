import FlightSchoolsAdmin from "./components/FlightSchoolsAdmin";
import schoolsJson from "@/data/flight-schools.generated.json";
import summaryJson from "@/data/imports/flight-schools-summary.json";
import type { FlightSchool } from "@/types/flight-school";

export const metadata = {
  title: "Admin | Flight Schools",
};

export default function AdminPage() {
  return (
    <FlightSchoolsAdmin
      schools={schoolsJson as FlightSchool[]}
      summary={summaryJson}
    />
  );
}
