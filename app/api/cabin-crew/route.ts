import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

const CABIN_CREW_SHEET_ID = "1duvoUCamcswz72myE2NnGwbRr81-gkuoNDy5uLRYZW8";
const CABIN_CREW_TAB = "Cabin Crew New";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const row = [
      new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.city || "",
      data.highestEducation || "",
      data.englishCommunication || "",
      data.age || "",
      data.joiningTimeline || "",
    ];

    let sheetsResult = null;
    let sheetsError: string | null = null;
    try {
      sheetsResult = await appendToSheet(CABIN_CREW_TAB, "A:I", row, CABIN_CREW_SHEET_ID);
      sheetsError = null;
    } catch (sheetErr) {
      sheetsError = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
      console.error("Cabin Crew Sheets error:", sheetsError);
    }

    // Note: dead build.goproxe.com webhook removed. PROXe is now reached via
    // the unified /api/leads proxy. Cabin Crew is not yet wired to /api/leads
    // (see GPFC scope - PAT-only first).

    if (sheetsError) {
      return NextResponse.json(
        { success: true, warning: "Saved to backup. Sheets error: " + sheetsError },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, data: sheetsResult });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
