import { NextRequest, NextResponse } from "next/server";
import { appendToSheet } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      firstName,
      lastName,
      email, 
      phone,
      answers,
      scores,
      tier,
      timestamp,
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
      assessmentData,
      formSubmissions,
      userInfo,
    } = body;

    if (!firstName || !lastName || !email || !phone || !scores || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isoTimestamp = timestamp || new Date().toISOString();
    const utmSource = utm_source || utmParams?.utm_source || "";
    const utmMedium = utm_medium || utmParams?.utm_medium || "";
    const utmCampaign = utm_campaign || utmParams?.utm_campaign || "";

    // Write to Google Sheets
    const result = await appendToSheet("Assessment", "A:L", [
      isoTimestamp,                       // A: Date
      `${firstName} ${lastName}`,         // B: Name
      email,                              // C: Email
      phone,                              // D: Phone
      scores.qualification || 0,          // E: Qualification Score
      scores.aptitude || 0,               // F: Aptitude Score
      scores.readiness || 0,              // G: Readiness Score
      scores.total || 0,                  // H: Total Score
      tier,                               // I: Tier
      answers?.length || 0,               // J: Answers Count
      source || "",                       // K: Source
      utmSource,                          // L: UTM Source
    ]);

    console.log("Assessment Sheets API success:", JSON.stringify(result));

    // Backup to Proxe webhook
    const assessmentRecord = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      scores: {
        qualification: scores.qualification || 0,
        aptitude: scores.aptitude || 0,
        readiness: scores.readiness || 0,
        total: scores.total || 0,
      },
      tier,
      answersCount: answers?.length || 0,
      answers,
      timestamp: isoTimestamp,
      source: source || "",
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
      const webhookResponse = await fetch("https://build.goproxe.com/webhook/pat-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "assessment", ...assessmentRecord }),
      });
      
      const responseText = await webhookResponse.text().catch(() => "Could not read response");
      
      if (webhookResponse.ok) {
        console.log("PAT test webhook sent successfully. Response:", responseText);
      } else {
        console.error("PAT test webhook returned error status:", webhookResponse.status);
        console.error("Error response:", responseText);
      }
    } catch (webhookError) {
      console.error("Error sending PAT test to webhook:", webhookError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Assessment saved successfully",
        scores: assessmentRecord.scores,
        tier: assessmentRecord.tier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
