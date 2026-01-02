import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      interest, 
      demoType, 
      preferredDate, 
      preferredTime, 
      message,
      source,
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !interest || !demoType || !preferredDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save booking data with full tracking
    const bookingRecord = {
      name,
      email,
      phone,
      interest,
      source,
      demoType,
      preferredDate,
      preferredTime,
      message,
      timestamp: new Date().toISOString(),
      // Tracking data
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    };

    console.log("Demo booking with tracking:", JSON.stringify(bookingRecord, null, 2));

    // Send to webhook
    try {
      await fetch("https://build.goproxe.com/webhook-test/pilot-windchasers", {
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
