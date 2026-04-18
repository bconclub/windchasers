import { NextResponse } from "next/server";
import { appendToSheet, getWebinarSheetTab, resolveSpreadsheetId } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tab = getWebinarSheetTab();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_WEBINAR",
      "WEBINAR_SHEET_ID",
      "GOOGLE_SHEET_ID_OPEN_HOUSE",
      "OPEN_HOUSE_SHEET_ID",
      "EVENT_DATA_2026_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    const result = await appendToSheet(tab, "A:I", [
      new Date().toISOString(),
      data.webinarSlug || "",
      data.webinarTitle || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.city || "",
      data.role || "",
      data.status || "",
    ], spreadsheetId);

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Webinar Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
