import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, source, message } = body;

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
      message,
      timestamp: new Date().toISOString(),
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
