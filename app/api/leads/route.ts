import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      source,
      message,
      city,
      status,
      parentAttending,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      utmParams,
      referrer,
      landing_page,
      sessionId,
      pageViews,
      formSubmissions,
      userInfo,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const utmSource = utm_source || utmParams?.utm_source || "";
    const utmCampaign = utm_campaign || utmParams?.utm_campaign || "";

    // Write to Google Sheets
    const result = await appendToSheet("Leads", "A:J", [
      timestamp,                          // A: Date
      name,                               // B: Name
      email,                              // C: Email
      phone,                              // D: Phone
      source || "website",                // E: Source
      message || "",                      // F: Message
      city || "",                         // G: City
      status || "",                       // H: Status
      parentAttending ?? "",              // I: Parent Attending
      utmSource,                          // J: UTM Source
    ]);

    console.log("Leads Sheets API success:", JSON.stringify(result));

    // Backup to Proxe webhook
    const leadRecord = {
      name,
      email,
      phone,
      source: source || "website",
      message: message || "",
      city: city || "",
      status: status || "",
      parentAttending: parentAttending ?? null,
      timestamp,
      utm_source: utmSource,
      utm_medium: utm_medium || utmParams?.utm_medium || "",
      utm_campaign: utmCampaign,
      utm_term: utm_term || utmParams?.utm_term || "",
      utm_content: utm_content || utmParams?.utm_content || "",
      referrer: referrer || "",
      landing_page: landing_page || "",
      sessionId,
      pageViews,
      formSubmissions,
      userInfo,
    };

    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lead", ...leadRecord }),
      });
    } catch (webhookError) {
      console.error("Error sending to webhook:", webhookError);
    }

    return NextResponse.json(
      { success: true, message: "Lead captured successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error capturing lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
