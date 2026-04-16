import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      city,
      parentGuardianName,
      interest, 
      demoType,
      education,
      preferredDate, 
      preferredTime, 
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

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!interest) missingFields.push("interest");
    if (!demoType) missingFields.push("demoType");
    if (!preferredDate) missingFields.push("preferredDate");
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields, "Body received:", body);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const utmSource = utm_source || utmParams?.utm_source || "";
    const utmMedium = utm_medium || utmParams?.utm_medium || "";
    const utmCampaign = utm_campaign || utmParams?.utm_campaign || "";

    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_BOOKING",
      "BOOKING_SHEET_ID",
      "EVENT_DATA_2026_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    // Write to Google Sheets
    const result = await appendToSheet("Booking", "A:N", [
      timestamp,                          // A: Date
      name,                               // B: Name
      phone,                              // C: Phone
      email || "",                        // D: Email
      city || "",                         // E: City
      parentGuardianName || "",           // F: Parent Guardian
      interest,                           // G: Interest
      demoType,                           // H: Demo Type
      education || "",                    // I: Education
      preferredDate,                      // J: Preferred Date
      preferredTime || "",                // K: Preferred Time
      source || "",                       // L: Source
      utmSource,                          // M: UTM Source
      utmCampaign,                        // N: UTM Campaign
    ], spreadsheetId);

    console.log("Booking Sheets API success:", JSON.stringify(result));

    // Backup to Proxe webhook
    const bookingRecord = {
      name,
      email: email || "",
      phone,
      city: city || "",
      parentGuardianName: parentGuardianName || "",
      interest,
      demoType,
      education: education || "",
      preferredDate,
      preferredTime: preferredTime || "",
      source: source || "",
      timestamp,
      utm_source: utmSource,
      utm_medium: utmMedium,
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
      const webhookResponse = await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "booking", ...bookingRecord }),
      });
      
      if (webhookResponse.ok) {
        console.log("Booking webhook sent successfully");
      } else {
        const errorText = await webhookResponse.text().catch(() => "Unknown error");
        console.error("Webhook returned error status:", webhookResponse.status, errorText);
      }
    } catch (webhookError) {
      console.error("Error sending booking to webhook:", webhookError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Demo session booked successfully",
        booking: { demoType, preferredDate },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error booking demo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
