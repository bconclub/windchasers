import { NextRequest, NextResponse } from "next/server";

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
      // UTM parameters (direct from form)
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      // Referrer and landing page
      referrer,
      landing_page,
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      assessmentData,
      formSubmissions,
      userInfo,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !scores || !tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save assessment data with full tracking
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
      timestamp: timestamp || new Date().toISOString(),
      source: source || "",
      // UTM parameters (prefer direct params, fallback to utmParams object)
      utm_source: utm_source || utmParams?.utm_source || "",
      utm_medium: utm_medium || utmParams?.utm_medium || "",
      utm_campaign: utm_campaign || utmParams?.utm_campaign || "",
      utm_term: utm_term || utmParams?.utm_term || "",
      utm_content: utm_content || utmParams?.utm_content || "",
      // Referrer and landing page
      referrer: referrer || "",
      landing_page: landing_page || "",
      // Tracking data
      sessionId,
      pageViews,
      formSubmissions,
      userInfo,
      assessmentData,
    };

    // Send to PAT test webhook
    try {
      const webhookPayload = {
        type: "assessment",
        ...assessmentRecord,
      };
      
      console.log("Sending PAT test data to webhook:", JSON.stringify(webhookPayload, null, 2));
      
      const webhookResponse = await fetch("https://build.goproxe.com/webhook/pat-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      });
      
      const responseText = await webhookResponse.text().catch(() => "Could not read response");
      
      if (webhookResponse.ok) {
        console.log("PAT test webhook sent successfully. Response:", responseText);
      } else {
        console.error("PAT test webhook returned error status:", webhookResponse.status);
        console.error("Error response:", responseText);
        console.error("Payload sent:", JSON.stringify(webhookPayload, null, 2));
      }
    } catch (webhookError) {
      console.error("Error sending PAT test to webhook:", webhookError);
      console.error("Error details:", webhookError instanceof Error ? webhookError.message : String(webhookError));
      // Don't fail the request if webhook fails - assessment is still considered successful
    }

    // TODO: Store in database
    // TODO: Send to PROXe CRM with assessment score and tracking data
    // TODO: Trigger email with results and personalized guidance
    // TODO: Store page views, UTM params, session data

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
