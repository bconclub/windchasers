import { NextResponse } from "next/server";
import { appendToSheet, getOpenHouseSheetTab, resolveSpreadsheetId } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tab = getOpenHouseSheetTab();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_OPEN_HOUSE",
      "OPEN_HOUSE_SHEET_ID",
      "EVENT_DATA_2026_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );
    console.log("Open House append tab:", tab);
    console.log("Open House spreadsheetId:", spreadsheetId);

    const result = await appendToSheet(tab, "A:H", [
      new Date().toISOString(),      // Date (A)
      data.role || "",               // Type (B)
      data.name || "",               // Name (C)
      data.phone || "",              // Phone (D)
      data.email || "",              // Email (E)
      data.city || "",               // City (F)
      data.parentAttending || "",    // With Someone (G)
      data.status || "",             // Status (H)
    ], spreadsheetId);

    console.log("Open House Sheets API success:", JSON.stringify(result));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Open House Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
