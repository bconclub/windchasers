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

    // Backup to Proxe webhook even if Sheets fails
    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cabin-crew",
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          city: data.city || "",
          highestEducation: data.highestEducation || "",
          englishCommunication: data.englishCommunication || "",
          age: data.age || "",
          joiningTimeline: data.joiningTimeline || "",
          source: "Cabin Crew Web Lead",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (webhookErr) {
      console.error("Cabin Crew Proxe webhook error:", webhookErr);
    }

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
