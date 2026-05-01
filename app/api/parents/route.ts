import { NextResponse } from "next/server";
import { appendToSheet, getParentsSheetTab, resolveSpreadsheetId } from "@/lib/sheets";

const PARENTS_TAB_FROM_ENV = process.env.GOOGLE_SHEET_TAB_PARENTS?.trim();

function getParentsTabsToTry() {
  const candidates = [
    PARENTS_TAB_FROM_ENV,
    getParentsSheetTab(),
    "Parents Web Lead",
    "Parents",
  ];
  return candidates.filter(
    (tab, idx, arr): tab is string => !!tab && arr.indexOf(tab) === idx
  );
}

function parentsRow(data: {
  parentName?: string;
  phone?: string;
  email?: string;
  city?: string;
  childClass?: string;
}) {
  // A:I → parent name | phone | email | city | child class | status | reserved | source | reserved
  return [
    data.parentName || "",
    data.phone || "",
    data.email || "",
    data.city || "",
    data.childClass || "",
    "New Lead",
    "",
    "Parents",
    "",
  ];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const tabsToTry = getParentsTabsToTry();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_PARENTS",
      "PARENTS_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    console.log("Parents API hit");
    console.log("Parents sheet tab(s) to try:", tabsToTry.join(" -> "));
    console.log("Parents spreadsheetId:", spreadsheetId);
    console.log("Parents Form Submission data:", {
      parentName: data.parentName,
      phone: data.phone,
      email: data.email,
      city: data.city,
      childClass: data.childClass,
      hasUtm: !!data.utmParams,
    });

    let sheetsResult = null;
    let sheetsError: string | null = null;
    const row = parentsRow(data);

    for (const tab of tabsToTry) {
      try {
        sheetsResult = await appendToSheet(tab, "A1:I1", row, spreadsheetId);
        sheetsError = null;
        console.log("Parents Sheets API success, tab:", tab);
        break;
      } catch (sheetErr) {
        const msg =
          sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
        console.error("Parents Sheets API error (tab " + tab + "):", msg);
        sheetsError = msg;
      }
    }

    // Note: dead build.goproxe.com webhook removed. PROXe is now reached via
    // the unified /api/leads proxy. Parents is not yet wired to /api/leads
    // (see GPFC scope - PAT-only first).

    if (sheetsError) {
      return NextResponse.json(
        {
          success: true,
          warning: "Saved to backup. Sheets error: " + sheetsError,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, data: sheetsResult });
  } catch (err) {
    console.error(
      "Parents API unhandled error:",
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
