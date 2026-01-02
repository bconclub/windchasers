import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      score, 
      answers,
      readinessTier,
      readinessStatus,
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      assessmentData,
      formSubmissions,
      userInfo,
    } = body;

    // Validate required fields
    if (!name || !email || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine score tier for follow-up (use provided or calculate)
    let scoreTier = readinessTier || "needs-improvement";
    if (!readinessTier) {
      if (score >= 80) scoreTier = "excellent";
      else if (score >= 60) scoreTier = "good";
      else if (score >= 40) scoreTier = "fair";
    }

    // Save assessment data with full tracking
    const assessmentRecord = {
      name,
      email,
      score,
      scoreTier,
      readinessStatus: readinessStatus || (scoreTier === "excellent" ? "Ready to start" : 
                                          scoreTier === "good" ? "Minor prep needed" :
                                          scoreTier === "fair" ? "Prep required" : "Not ready yet"),
      answersCount: answers?.length || 0,
      answers,
      timestamp: new Date().toISOString(),
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      assessmentData,
      formSubmissions,
      userInfo,
    };

    console.log("Assessment completed with tracking:", JSON.stringify(assessmentRecord, null, 2));

    // TODO: Store in database
    // TODO: Send to PROXe CRM with assessment score and tracking data
    // TODO: Trigger email with results and personalized guidance
    // TODO: Store page views, UTM params, session data

    return NextResponse.json(
      {
        success: true,
        message: "Assessment saved successfully",
        score,
        scoreTier,
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
