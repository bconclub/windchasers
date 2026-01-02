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
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!interest) missingFields.push("interest");
    if (!demoType) missingFields.push("demoType");
    if (!preferredDate) missingFields.push("preferredDate");
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields, "Body received:", body);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
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
      const webhookResponse = await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "booking",
          ...bookingRecord,
        }),
      });
      
      if (webhookResponse.ok) {
        console.log("Booking webhook sent successfully");
      } else {
        const errorText = await webhookResponse.text().catch(() => "Unknown error");
        console.error("Webhook returned error status:", webhookResponse.status, errorText);
      }
    } catch (webhookError) {
      console.error("Error sending booking to webhook:", webhookError);
      // Don't fail the request if webhook fails - booking is still considered successful
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
