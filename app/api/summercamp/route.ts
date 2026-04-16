import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, getSummerCampSheetTab, resolveSpreadsheetId } from "@/lib/sheets";

// Helper function to format phone number with +91 prefix
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (phone.startsWith("+")) {
    return phone;
  }
  return `+91${digits}`;
}

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
      return "8-10_years";
  }
}

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

    if (!parentName || !phone || !email || !childAge || !interest || !batchPreference) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "Phone number must be at least 10 digits" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const tab = getSummerCampSheetTab();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_SUMMERCAMP",
      "SUMMERCAMP_SHEET_ID",
      "SUMMER_CAMP_SHEET_ID",
      "CABIN_CREW_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );
    console.log("Summer Camp append tab:", tab);
    console.log("Summer Camp spreadsheetId:", spreadsheetId);

    // Write to Google Sheets
    const result = await appendToSheet(tab, "A:I", [
      timestamp,                          // A: Date
      parentName,                         // B: Name
      formatPhone(phone),                 // C: Phone
      email.toLowerCase().trim(),         // D: Email
      formatAge(childAge),                // E: Age
      formatInterest(interest),           // F: Most Interested
      formatBatch(batchPreference),       // G: Batch
      "New Lead",                         // H: Status
      "Web Lead",                         // I: Source
    ], spreadsheetId);

    console.log("Summer Camp Sheets API success:", JSON.stringify(result));

    // Backup to Proxe webhook
    try {
      await fetch("https://build.goproxe.com/webhook/pilot-windchasers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
