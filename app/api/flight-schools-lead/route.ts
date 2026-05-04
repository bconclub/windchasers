import { NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

function getTab(): string {
  return process.env.GOOGLE_SHEET_TAB_FLIGHT_SCHOOLS?.trim() || "Flight Schools Lead";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tab = getTab();
    const spreadsheetId = resolveSpreadsheetId("GOOGLE_SHEET_ID");

    await appendToSheet(tab, "A:K", [
      new Date().toISOString(),        // A: Timestamp
      data.name || "",                 // B: Name
      data.phone || "",                // C: Phone
      data.email || "",                // D: Email
      data.schoolInterested || "",     // E: School Interested
      data.schoolCountry || "",        // F: School Country
      data.utmSource || "",            // G: UTM Source
      data.utmMedium || "",            // H: UTM Medium
      data.utmCampaign || "",          // I: UTM Campaign
      data.utmContent || "",           // J: UTM Content
      data.utmTerm || "",              // K: UTM Term
    ], spreadsheetId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Flight schools lead error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
