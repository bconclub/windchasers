import { NextRequest, NextResponse } from "next/server";

// Helper function to format phone number with +91 prefix
function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // If already has country code (starts with 91 and has 12 digits)
  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }
  
  // If 10 digits, add +91 prefix
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // Return as-is if already has + prefix
  if (phone.startsWith("+")) {
    return phone;
  }
  
  // Fallback: prepend +91
  return `+91${digits}`;
}

// Helper function to convert age to required format
function formatAge(age: string): string {
  switch (age) {
    case "8-9":
    case "10-11":
      return "8-10_years";
    case "12-13":
      return "11-12_years";
    case "14-15":
      return "13-15_years";
    default:
      return "8-10_years"; // Default fallback
  }
}

// Helper function to convert interest to snake_case
function formatInterest(interest: string): string {
  const interestMap: Record<string, string> = {
    drones: "flying_drones",
    simulators: "flight_simulators",
    robots: "robotics",
    aircraft: "aircraft_visit",
    all: "all_above",
  };
  return interestMap[interest] || interest;
}

// Helper function to convert batch preference to snake_case
function formatBatch(batch: string): string {
  const batchMap: Record<string, string> = {
    "April 6-10": "april_6-10",
    "April 20-24": "april_20-24",
    "Either works": "either_works",
  };
  return batchMap[batch] || batch.toLowerCase().replace(/\s+/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      parentName,
      phone,
      email,
      childAge,
      interest,
      batchPreference,
    } = body;

    // Validate required fields
    if (!parentName || !phone || !email || !childAge || !interest || !batchPreference) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone (must be at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "Phone number must be at least 10 digits" },
        { status: 400 }
      );
    }

    // Prepare the row data for Google Sheets
    const timestamp = new Date().toISOString();
    const rowData = {
      sheetName: "Summer Camp",
      values: [
        timestamp,                          // Column A: Date
        parentName,                         // Column B: Name
        formatPhone(phone),                 // Column C: Phone
        email.toLowerCase().trim(),         // Column D: Email
        formatAge(childAge),                // Column E: Age
        formatInterest(interest),           // Column F: Most Interested
        formatBatch(batchPreference),       // Column G: Batch
        "New Lead",                         // Column H: Status
        "Web Lead",                         // Column I: Source
      ],
    };

    // Send to Google Sheets webhook
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rowData),
        }
      );

      if (!response.ok) {
        console.error("Google Sheets webhook error:", await response.text());
        // Continue anyway - don't fail the user request
      }
    } catch (webhookError) {
      console.error("Error sending to Google Sheets:", webhookError);
      // Don't fail the request if webhook fails - we'll handle retries separately
    }

    // Also send to existing Proxe webhook for backup
    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "summer-camp",
          parentName,
          phone: formatPhone(phone),
          email: email.toLowerCase().trim(),
          childAge: formatAge(childAge),
          interest: formatInterest(interest),
          batchPreference: formatBatch(batchPreference),
          timestamp,
          source: "Web Lead",
        }),
      });
    } catch (proxeError) {
      console.error("Error sending to Proxe webhook:", proxeError);
    }

    return NextResponse.json(
      { success: true, message: "Registration successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing summer camp registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
