import { NextRequest, NextResponse } from "next/server";

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
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    } = body;

    // Validate required fields (email is optional)
    if (!name || !phone || !startTimeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save pricing inquiry data with full tracking
    const pricingRecord = {
      name,
      email: email || null, // Email is optional
      phone,
      startTimeline,
      interest: interest || "dgca_ground", // Default to DGCA since pricing is only for DGCA
      source: source || "dgca",
      timestamp: new Date().toISOString(),
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    };

    console.log("Pricing inquiry with tracking:", JSON.stringify(pricingRecord, null, 2));

    // TODO: Store in database
    // TODO: Send to PROXe CRM as a pricing inquiry
    // TODO: Send confirmation email to user with pricing details
    // TODO: Send notification to admin/sales team

    return NextResponse.json(
      {
        success: true,
        message: "Pricing inquiry submitted successfully",
      },
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

