import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, demoType, preferredDate, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !demoType || !preferredDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save booking data
    console.log("Demo booking:", {
      name,
      email,
      phone,
      demoType,
      preferredDate,
      message,
      timestamp: new Date().toISOString(),
    });

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
