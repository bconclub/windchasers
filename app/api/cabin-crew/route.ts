import { NextResponse } from "next/server";
import { appendToSheet, extractAttributionCells } from "@/lib/sheets";
import { forwardLeadToProxe } from "@/lib/proxe";

const CABIN_CREW_SHEET_ID = "1duvoUCamcswz72myE2NnGwbRr81-gkuoNDy5uLRYZW8";
const CABIN_CREW_TAB = "Cabin Crew New";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // A-I form data, then 15 attribution cells (utm + click IDs + channel)
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
      ...extractAttributionCells(data), // J:X, utm/click/channel
    ];

    let sheetsResult = null;
    let sheetsError: string | null = null;
    try {
      sheetsResult = await appendToSheet(CABIN_CREW_TAB, "A:X", row, CABIN_CREW_SHEET_ID);
      sheetsError = null;
    } catch (sheetErr) {
      sheetsError = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
      console.error("Cabin Crew Sheets error:", sheetsError);
    }

    // Forward to PROXe (Sheets above is the backup). Non-blocking.
    const proxe = await forwardLeadToProxe({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      source: "page",
      formType: "cabin_crew",
      data,
      fields: {
        audience: "student",
        highest_education: data.highestEducation,
        english_communication: data.englishCommunication,
        age: data.age,
        joining_timeline: data.joiningTimeline,
      },
    });
    if (!proxe.ok) console.error("Cabin Crew PROXe forward failed:", proxe.error);

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
