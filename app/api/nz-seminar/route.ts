import { NextResponse } from "next/server";
import {
  appendToSheet,
  extractAttributionCells,
  getNzSeminarSheetTab,
} from "@/lib/sheets";

// Event Data 2026 spreadsheet — same workbook as Open House. NZ leads drop
// into the "29 NZ Webinar Confirms" tab. Override with an env var if the
// sheet ever moves: GOOGLE_SHEET_ID_NZ_SEMINAR.
const NZ_SEMINAR_SHEET_ID =
  process.env.GOOGLE_SHEET_ID_NZ_SEMINAR?.trim() ||
  process.env.EVENT_DATA_2026_SHEET_ID?.trim() ||
  "145KgARkFGEi4_hjwR5dN6Vv8NJlnmzHhX8I7wvNOc-w";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tab = getNzSeminarSheetTab();
    const spreadsheetId = NZ_SEMINAR_SHEET_ID;
    console.log("NZ Seminar append tab:", tab);
    console.log("NZ Seminar spreadsheetId:", spreadsheetId);

    // Sheet column layout (matches "29 NZ Webinar Confirms"):
    //   A Date  B Type  C Name  D Phone  E Email  F City  G With +1
    //   H Current Status  I Stage  J Remarks  K-Y 15 attribution cells
    const result = await appendToSheet(tab, "A:Y", [
      new Date().toISOString(),      // Date (A)
      data.role || "",               // Type (B)
      data.name || "",               // Name (C)
      data.phone || "",              // Phone (D)
      data.email || "",              // Email (E)
      data.city || "",               // City (F)
      data.parentAttending || "",    // With +1 (G)
      data.status || "",             // Current Status (H)
      "",                            // Stage (I) — filled manually by counsellor
      "",                            // Remarks (J) — filled manually by counsellor
      ...extractAttributionCells(data), // K:Y — utm/click/channel
    ], spreadsheetId);

    console.log("NZ Seminar Sheets API success:", JSON.stringify(result));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("NZ Seminar Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
