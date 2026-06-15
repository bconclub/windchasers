import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";
import { forwardLeadToProxe } from "@/lib/proxe";

// Flight-school leads land in their own dedicated spreadsheet (not the main
// leads sheet): docs.google.com/spreadsheets/d/1ioFXsB7MmqAyC0lDwdJvaw6DzD9oTf62xogYWf1sd44
// Override via env if it ever moves. The sheet must be shared with the
// service account (GOOGLE_SERVICE_ACCOUNT_EMAIL) as Editor.
const FLIGHT_SCHOOLS_SPREADSHEET_ID = "1ioFXsB7MmqAyC0lDwdJvaw6DzD9oTf62xogYWf1sd44";

function getTab(): string {
  return process.env.GOOGLE_SHEET_TAB_FLIGHT_SCHOOLS?.trim() || "Flight Schools Lead";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tab = getTab();
    const spreadsheetId =
      process.env.GOOGLE_SHEET_ID_FLIGHT_SCHOOLS?.trim() || FLIGHT_SCHOOLS_SPREADSHEET_ID;

    // Sheets backup (non-blocking) — a Sheets issue must not lose the lead.
    try {
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
    } catch (sheetErr) {
      console.error("Flight schools lead Sheets error:", sheetErr instanceof Error ? sheetErr.message : sheetErr);
    }

    // Forward to PROXe.
    const proxe = await forwardLeadToProxe({
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: "page",
      formType: "flight_school",
      data,
      fields: {
        school_interested: data.schoolInterested,
        school_country: data.schoolCountry,
      },
    });
    if (!proxe.ok) console.error("Flight schools lead PROXe forward failed:", proxe.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Flight schools lead error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
