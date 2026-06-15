import { NextResponse } from "next/server";
import { appendToSheet, extractAttributionCells, resolveSpreadsheetId } from "@/lib/sheets";
import { forwardLeadToProxe } from "@/lib/proxe";

const ATC_TAB_FROM_ENV = process.env.GOOGLE_SHEET_TAB_ATC?.trim();

function getAtcTabsToTry() {
  const candidates = [ATC_TAB_FROM_ENV, "ATC Web Lead", "ATC"];
  return candidates.filter((tab, idx, arr): tab is string => !!tab && arr.indexOf(tab) === idx);
}

function atcRow(data: Record<string, unknown>) {
  // A-I form data, then 15 attribution cells (utm + click IDs + channel)
  return [
    (data.name as string) || "",
    (data.phone as string) || "",
    (data.email as string) || "",
    (data.city as string) || "",
    (data.qualification as string) || "",
    "New Lead",
    "",
    "ATC",
    "",
    ...extractAttributionCells(data), // J:X, utm/click/channel
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
        sheetsResult = await appendToSheet(tab, "A1:X1", row, spreadsheetId);
        sheetsError = null;
        console.log("ATC Sheets API success, tab:", tab, JSON.stringify(sheetsResult));
        break;
      } catch (sheetErr) {
        const msg = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
        console.error("ATC Sheets API error (tab " + tab + "):", msg);
        sheetsError = msg;
      }
    }

    // Forward to PROXe (Sheets above is the backup). Non-blocking.
    const proxe = await forwardLeadToProxe({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      source: "page",
      formType: "atc",
      data,
      fields: { qualification: data.qualification },
    });
    if (!proxe.ok) console.error("ATC PROXe forward failed:", proxe.error);

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
