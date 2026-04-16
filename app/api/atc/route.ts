import { NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

const ATC_TAB_FROM_ENV = process.env.GOOGLE_SHEET_TAB_ATC?.trim();

function atcRow(data: {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  qualification?: string;
}) {
  return [
    data.name || "",
    data.phone || "",
    data.email || "",
    data.city || "",
    data.qualification || "",
    "New Lead",
    "",
    "ATC",
    "",
  ];
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const tabsToTry = ATC_TAB_FROM_ENV
      ? [ATC_TAB_FROM_ENV]
      : ["ATC Web Lead", "ATC"];
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
        sheetsResult = await appendToSheet(tab, "A:I", row, spreadsheetId);
        sheetsError = null;
        console.log("ATC Sheets API success, tab:", tab, JSON.stringify(sheetsResult));
        break;
      } catch (sheetErr) {
        const msg = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
        console.error("ATC Sheets API error (tab " + tab + "):", msg);
        sheetsError = msg;
      }
    }

    // Fallback to Proxe webhook for backup / if Sheets failed
    try {
      const webhookRes = await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "atc-lead",
          name: data.name,
          phone: data.phone,
          email: data.email,
          city: data.city,
          qualification: data.qualification,
          timestamp: new Date().toISOString(),
          source: "ATC Lead",
          sessionId: data.sessionId,
          utmParams: data.utmParams,
          referrer: data.referrer,
          landingPage: data.landingPage,
          pageViews: data.pageViews,
          formSubmissions: data.formSubmissions,
        }),
      });
      console.log("ATC Proxe webhook status:", webhookRes.status);
    } catch (webhookErr) {
      console.error("ATC Proxe webhook error:", webhookErr);
    }

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
