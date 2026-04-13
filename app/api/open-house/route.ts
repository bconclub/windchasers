import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const result = await appendToSheet("Open House", "A:H", [
      new Date().toISOString(),      // Date (A)
      data.role || "",               // Type (B)
      data.name || "",               // Name (C)
      data.phone || "",              // Phone (D)
      data.email || "",              // Email (E)
      data.city || "",               // City (F)
      data.parentAttending || "",    // With Someone (G)
      data.status || "",             // Status (H)
    ]);

    console.log("Open House Sheets API success:", JSON.stringify(result));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Open House Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
