import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

const CABIN_CREW_SHEET_ID = "1duvoUCamcswz72myE2NnGwbRr81-gkuoNDy5uLRYZW8";
const CABIN_CREW_TAB = "Cabin Crew New";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const values = [[
      new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.city || "",
      data.completed12th || "",
      data.age18plus || "",
      data.joiningTimeline || "",
    ]];

    let sheetsResult = null;
    for (const row of values) {
      sheetsResult = await appendToSheet(CABIN_CREW_TAB, "A:H", row, CABIN_CREW_SHEET_ID);
    }

    return NextResponse.json({ success: true, data: sheetsResult });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
