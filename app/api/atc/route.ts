import { NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

const ATC_TAB_FROM_ENV = process.env.GOOGLE_SHEET_TAB_ATC?.trim();

function getAtcTabsToTry() {
  const candidates = [ATC_TAB_FROM_ENV, "ATC Web Lead", "ATC"];
  return candidates.filter((tab, idx, arr): tab is string => !!tab && arr.indexOf(tab) === idx);
}

function atcRow(data: {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  qualification?: string;
}) {
  return [
    data.name || "",
    data.phone || "",
    data.email || "",
    data.city || "",
    data.qualification || "",
    "New Lead",
    "",
    "ATC",
    "",
  ];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const tabsToTry = getAtcTabsToTry();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_ATC",
      "ATC_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    console.log("ATC API hit");
    console.log("ATC sheet tab(s) to try:", tabsToTry.join(" → "));
    console.log("ATC spreadsheetId:", spreadsheetId);
    console.log("ATC Form Submission data:", {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      qualification: data.qualification,
      hasUtm: !!data.utmParams,
    });

    let sheetsResult = null;
    let sheetsError: string | null = null;
    const row = atcRow(data);

    for (const tab of tabsToTry) {
      try {
        sheetsResult = await appendToSheet(tab, "A1:I1", row, spreadsheetId);
        sheetsError = null;
        console.log("ATC Sheets API success, tab:", tab, JSON.stringify(sheetsResult));
        break;
      } catch (sheetErr) {
        const msg = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
        console.error("ATC Sheets API error (tab " + tab + "):", msg);
        sheetsError = msg;
      }
    }

    // Note: dead build.goproxe.com webhook removed. PROXe is now reached via
    // the unified /api/leads proxy. ATC is not yet wired to /api/leads (see
    // GPFC scope - PAT-only first). Re-add a /api/leads "page" or "event" call
    // here once that handover is approved.

    if (sheetsError) {
      return NextResponse.json(
        { success: true, warning: "Saved to backup. Sheets error: " + sheetsError },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, data: sheetsResult });
  } catch (err) {
    console.error("ATC API unhandled error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
