import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const sheetUrl = process.env.OPEN_HOUSE_SHEET_URL;

  if (!sheetUrl) {
    console.error("OPEN_HOUSE_SHEET_URL is not defined");
    return NextResponse.json({ success: false }, { status: 500 });
  }

  try {
    const payload = await request.json();

    const res = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Sheet submission failed:", res.status, await res.text());
      return NextResponse.json({ success: false }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/open-house:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
