import { NextResponse } from "next/server";
import {
  appendToSheet,
  extractAttributionCells,
  getNzSeminarSheetTab,
  resolveSpreadsheetId,
} from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tab = getNzSeminarSheetTab();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_NZ_SEMINAR",
      "NZ_SEMINAR_SHEET_ID",
      "EVENT_DATA_2026_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );
    console.log("NZ Seminar append tab:", tab);
    console.log("NZ Seminar spreadsheetId:", spreadsheetId);

    const result = await appendToSheet(tab, "A:O", [
      new Date().toISOString(),      // Date (A)
      data.role || "",               // Type (B)
      data.name || "",               // Name (C)
      data.phone || "",              // Phone (D)
      data.email || "",              // Email (E)
      data.city || "",               // City (F)
      data.parentAttending || "",    // With Someone (G)
      data.status || "",             // Status (H)
      ...extractAttributionCells(data), // utm_source..referrer (I:O)
    ], spreadsheetId);

    console.log("NZ Seminar Sheets API success:", JSON.stringify(result));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("NZ Seminar Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
