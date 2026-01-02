import { NextRequest, NextResponse } from "next/server";

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
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    } = body;

    // Validate required fields (email and city are optional)
    if (!name || !phone || !interest || !demoType || !preferredDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save booking data with full tracking - send ALL form details to webhook
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
      timestamp: new Date().toISOString(),
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    };

    // Send to webhook
    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "booking",
          ...bookingRecord,
        }),
      });
    } catch (webhookError) {
      console.error("Error sending to webhook:", webhookError);
      // Don't fail the request if webhook fails
    }

    // TODO: Store in database
    // TODO: Send to PROXe CRM as a demo booking
    // TODO: Send confirmation email to user
    // TODO: Send notification to admin/sales team
    // TODO: Integrate with calendar system for slot management

    // TODO: Check availability for the preferred date
    // For now, accept all bookings

    return NextResponse.json(
      {
        success: true,
        message: "Demo session booked successfully",
        booking: {
          demoType,
          preferredDate,
        },
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
