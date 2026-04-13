import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("ATC Form Submission:", {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      qualification: data.qualification,
      hasUtm: !!data.utmParams,
    });

    const result = await appendToSheet("ATC Web Lead", "A:F", [
      new Date().toISOString(),      // Timestamp (A)
      data.name || "",               // Name (B)
      data.phone || "",              // Phone (C)
      data.email || "",              // Email (D)
      data.city || "",               // City (E)
      data.qualification || "",      // Qualification (F)
    ]);

    console.log("ATC Sheets API success:", JSON.stringify(result));

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("ATC Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
