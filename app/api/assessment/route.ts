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
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      assessmentData,
      formSubmissions,
      userInfo,
    };

    // Send to webhook
    try {
      await fetch("https://build.goproxe.com/webhook-test/pilot-windchasers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "assessment",
          ...assessmentRecord,
        }),
      });
    } catch (webhookError) {
      console.error("Error sending to webhook:", webhookError);
      // Don't fail the request if webhook fails
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
