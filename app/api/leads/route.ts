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
      qualification,
      role,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      utmParams,
      referrer,
      landing_page,
      landingPage,
      sessionId,
      pageViews,
      formSubmissions,
      userInfo,
    } = body;

    const timestamp = new Date().toISOString();
    const utmSource = utm_source || utmParams?.utm_source || "";
    const utmCampaign = utm_campaign || utmParams?.utm_campaign || "";
    const resolvedLandingPage = landing_page || landingPage || "";
    const resolvedReferrer = referrer || "";

    let sheetsResult = null;
    let sheetsError = null;

    // Route to correct tab based on source
    const normalizedSource = String(source || "").trim();
    console.log("[LEADS API] source:", normalizedSource);
    console.log("[LEADS API] body:", JSON.stringify(body, null, 2));

    try {
      if (normalizedSource === "ATC Web Lead" || normalizedSource === "ATC") {
        sheetsResult = await appendToSheet("ATC Web Lead", "A:H", [
          name || "",               // A: Name
          phone || "",              // B: Phone
          email || "",              // C: Email
          city || "",               // D: City
          qualification || "",      // E: Qualification
          "New Lead",               // F: Status
          "ATC Web Lead",           // G: Campaign
          "",                       // H: Ad
        ]);
      } else if (normalizedSource === "Open House" || normalizedSource === "open-house") {
        sheetsResult = await appendToSheet("Open House", "A:H", [
          timestamp,
          role || "",
          name || "",
          phone || "",
          email || "",
          city || "",
          parentAttending ?? "",
          status || "",
        ]);
      } else {
        // Default Leads tab
        if (!name || !email || !phone) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }
        sheetsResult = await appendToSheet("Leads", "A:J", [
          timestamp,
          name,
          email,
          phone,
          normalizedSource || "website",
          message || "",
          city || "",
          status || "",
          parentAttending ?? "",
          utmSource,
        ]);
      }
      console.log("[LEADS API] Sheets success:", JSON.stringify(sheetsResult));
    } catch (sheetErr) {
      sheetsError = sheetErr instanceof Error ? sheetErr.message : String(sheetErr);
      console.error("[LEADS API] Sheets error:", sheetsError);
    }

    // Backup to Proxe webhook
    const leadRecord = {
      name: name || "",
      email: email || "",
      phone: phone || "",
      source: normalizedSource || "website",
      message: message || "",
      city: city || "",
      status: status || "",
      qualification: qualification || "",
      parentAttending: parentAttending ?? null,
      timestamp,
      utm_source: utmSource,
      utm_medium: utm_medium || utmParams?.utm_medium || "",
      utm_campaign: utmCampaign,
      utm_term: utm_term || utmParams?.utm_term || "",
      utm_content: utm_content || utmParams?.utm_content || "",
      referrer: resolvedReferrer,
      landing_page: resolvedLandingPage,
      sessionId,
      pageViews,
      formSubmissions,
      userInfo,
    };

    try {
      const webhookRes = await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lead", ...leadRecord }),
      });
      console.log("[LEADS API] Proxe webhook status:", webhookRes.status);
    } catch (webhookError) {
      console.error("[LEADS API] Proxe webhook error:", webhookError);
    }

    if (sheetsError) {
      return NextResponse.json(
        { success: true, warning: "Saved to backup. Sheets error: " + sheetsError },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Lead captured successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LEADS API] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
