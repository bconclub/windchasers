import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, score, answers } = body;

    // Validate required fields
    if (!name || !email || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save assessment data
    console.log("Assessment completed:", {
      name,
      email,
      score,
      answersCount: answers?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // TODO: Store in database
    // TODO: Send to PROXe CRM with assessment score
    // TODO: Trigger email with results and personalized guidance

    // Determine score tier for follow-up
    let scoreTier = "needs-improvement";
    if (score >= 80) scoreTier = "excellent";
    else if (score >= 60) scoreTier = "good";
    else if (score >= 40) scoreTier = "fair";

    // TODO: Send personalized email based on score tier
    console.log(`Assessment tier: ${scoreTier} for ${email}`);

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
