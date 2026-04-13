import { NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("ATC API hit");
    console.log("ATC Form Submission data:", {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      qualification: data.qualification,
      hasUtm: !!data.utmParams,
    });

    let sheetsResult = null;
    let sheetsError = null;

    try {
      sheetsResult = await appendToSheet("ATC", "A:H", [
        data.name || "",               // A: Name
        data.phone || "",              // B: Phone
        data.email || "",              // C: Email
        data.city || "",               // D: City
        data.qualification || "",      // E: Qualification
        "New Lead",                    // F: Status
        "ATC",                         // G: Campaign
        "",                            // H: Ad
      ]);
      console.log("ATC Sheets API success:", JSON.stringify(sheetsResult));
    } catch (sheetErr) {
      sheetsError = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
      console.error("ATC Sheets API error:", sheetsError);
      // Continue to webhook fallback — don't fail the user request
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
