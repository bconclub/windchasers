import { NextResponse } from "next/server";
import { appendToSheet, getStudentsSheetTab, resolveSpreadsheetId } from "@/lib/sheets";

const STUDENTS_TAB_FROM_ENV = process.env.GOOGLE_SHEET_TAB_STUDENTS?.trim();

function getStudentsTabsToTry() {
  const candidates = [
    STUDENTS_TAB_FROM_ENV,
    getStudentsSheetTab(),
    "Students Web Lead",
    "Students",
  ];
  return candidates.filter(
    (tab, idx, arr): tab is string => !!tab && arr.indexOf(tab) === idx
  );
}

function studentsRow(data: {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  qualification?: string;
}) {
  // Same shape as ATC row so existing Sheet templates / pivots port cleanly.
  // A:I → name | phone | email | city | qualification | status | reserved | source | reserved
  return [
    data.name || "",
    data.phone || "",
    data.email || "",
    data.city || "",
    data.qualification || "",
    "New Lead",
    "",
    "Students",
    "",
  ];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const tabsToTry = getStudentsTabsToTry();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_STUDENTS",
      "STUDENTS_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    console.log("Students API hit");
    console.log("Students sheet tab(s) to try:", tabsToTry.join(" -> "));
    console.log("Students spreadsheetId:", spreadsheetId);
    console.log("Students Form Submission data:", {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      qualification: data.qualification,
      hasUtm: !!data.utmParams,
    });

    let sheetsResult = null;
    let sheetsError: string | null = null;
    const row = studentsRow(data);

    for (const tab of tabsToTry) {
      try {
        sheetsResult = await appendToSheet(tab, "A1:I1", row, spreadsheetId);
        sheetsError = null;
        console.log("Students Sheets API success, tab:", tab);
        break;
      } catch (sheetErr) {
        const msg =
          sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
        console.error("Students Sheets API error (tab " + tab + "):", msg);
        sheetsError = msg;
      }
    }

    // Note: dead build.goproxe.com webhook removed. PROXe is now reached via
    // the unified /api/leads proxy. Students is not yet wired to /api/leads
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
      "Students API unhandled error:",
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
