import { NextRequest, NextResponse } from "next/server";

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
      // UTM + tracking
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

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Integrate with PROXe CRM
    const leadRecord = {
      name,
      email,
      phone,
      source: source || "website",
      message: message || "",
      city: city || "",
      status: status || "",
      parentAttending: parentAttending ?? null,
      timestamp: new Date().toISOString(),
      // UTM parameters (prefer direct params, fallback to utmParams object)
      utm_source: utm_source || utmParams?.utm_source || "",
      utm_medium: utm_medium || utmParams?.utm_medium || "",
      utm_campaign: utm_campaign || utmParams?.utm_campaign || "",
      utm_term: utm_term || utmParams?.utm_term || "",
      utm_content: utm_content || utmParams?.utm_content || "",
      // Tracking
      referrer: referrer || "",
      landing_page: landing_page || "",
      sessionId,
      pageViews,
      formSubmissions,
      userInfo,
    };

    // Send to webhook
    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "lead",
          ...leadRecord,
        }),
      });
    } catch (webhookError) {
      console.error("Error sending to webhook:", webhookError);
      // Don't fail the request if webhook fails
    }

    // TODO: Send to PROXe API

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
