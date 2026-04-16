import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      startTimeline,
      interest, 
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer,
      landing_page,
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    } = body;

    if (!name || !phone || !startTimeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const utmSource = utm_source || utmParams?.utm_source || "";
    const utmCampaign = utm_campaign || utmParams?.utm_campaign || "";

    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_PRICING",
      "PRICING_SHEET_ID",
      "EVENT_DATA_2026_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    // Write to Google Sheets
    const result = await appendToSheet("Pricing", "A:J", [
      timestamp,                          // A: Date
      name,                               // B: Name
      phone,                              // C: Phone
      email || "",                        // D: Email
      startTimeline,                      // E: Start Timeline
      interest || "dgca_ground",          // F: Interest
      source || "dgca",                   // G: Source
      utmSource,                          // H: UTM Source
      utmCampaign,                        // I: UTM Campaign
      referrer || "",                     // J: Referrer
    ], spreadsheetId);

    console.log("Pricing Sheets API success:", JSON.stringify(result));

    // Backup to Proxe webhook
    const pricingRecord = {
      name,
      email: email || null,
      phone,
      startTimeline,
      interest: interest || "dgca_ground",
      source: source || "dgca",
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
      assessmentData,
    };

    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pricing", ...pricingRecord }),
      });
    } catch (webhookError) {
      console.error("Error sending to webhook:", webhookError);
    }

    return NextResponse.json(
      { success: true, message: "Pricing inquiry submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting pricing inquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

