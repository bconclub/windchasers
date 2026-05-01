import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

// =============================================================================
// POST /api/booking — Demo session booking
//
// 1. Writes to the Booking spreadsheet (non-blocking; a Sheets failure no
//    longer kills the booking).
// 2. Forwards to PROXe via the unified /api/leads route as a "demo_booked"
//    event so the lead lands in the dashboard with a first_outreach task.
// =============================================================================

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
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer,
      landing_page,
      sessionId,
      pageViews,
      utmParams,
      formSubmissions,
      userInfo,
      assessmentData,
    } = body;

    const missingFields: string[] = [];
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

    const timestamp = new Date().toISOString();
    const utmSource = utm_source || utmParams?.utm_source || "";
    const utmMedium = utm_medium || utmParams?.utm_medium || "";
    const utmCampaign = utm_campaign || utmParams?.utm_campaign || "";
    const utmTerm = utm_term || utmParams?.utm_term || "";
    const utmContent = utm_content || utmParams?.utm_content || "";

    // ── Sheets backup (non-blocking) ────────────────────────────────────────
    // Wrapped in its own try/catch so a Sheets misconfiguration / quota issue
    // doesn't break the actual booking. PROXe is the source of truth.
    try {
      const spreadsheetId = resolveSpreadsheetId(
        "GOOGLE_SHEET_ID_BOOKING",
        "BOOKING_SHEET_ID",
        "EVENT_DATA_2026_SHEET_ID",
        "GOOGLE_SHEET_ID"
      );

      const result = await appendToSheet(
        "Booking",
        "A:N",
        [
          timestamp,                          // A: Date
          name,                               // B: Name
          phone,                              // C: Phone
          email || "",                        // D: Email
          city || "",                         // E: City
          parentGuardianName || "",           // F: Parent Guardian
          interest,                           // G: Interest
          demoType,                           // H: Demo Type
          education || "",                    // I: Education
          preferredDate,                      // J: Preferred Date
          preferredTime || "",                // K: Preferred Time
          source || "",                       // L: Source
          utmSource,                          // M: UTM Source
          utmCampaign,                        // N: UTM Campaign
        ],
        spreadsheetId
      );

      console.log("Booking Sheets API success:", JSON.stringify(result));
    } catch (sheetsErr) {
      console.error(
        "Booking Sheets append failed (continuing to PROXe):",
        sheetsErr instanceof Error ? sheetsErr.message : sheetsErr
      );
    }

    // ── Forward to PROXe via the unified /api/leads route ───────────────────
    // Booking maps to a "event" type submission with event_name="demo_booked".
    // /api/leads handles auth, normalisation, logging, and the upstream call.
    const audience: "parent" | "student" = parentGuardianName
      ? "parent"
      : "student";

    const leadsPayload = {
      type: "event" as const,
      name,
      phone,
      email: email || undefined,
      city: city || undefined,
      audience,
      page_url: landing_page || undefined,
      utm: {
        source: utmSource || undefined,
        medium: utmMedium || undefined,
        campaign: utmCampaign || undefined,
        term: utmTerm || undefined,
        content: utmContent || undefined,
      },
      data: {
        event_name: "demo_booked",
        interest,
        demo_type: demoType,
        education: education || undefined,
        preferred_date: preferredDate,
        preferred_time: preferredTime || undefined,
        parent_guardian_name: parentGuardianName || undefined,
        source: source || undefined,
        referrer: referrer || undefined,
        session_id: sessionId,
        page_views: pageViews,
        form_submissions: formSubmissions,
        user_info: userInfo,
        assessment_data: assessmentData,
      },
    };

    const leadsUrl = new URL("/api/leads", request.url);
    let proxeRes: Response;
    try {
      proxeRes = await fetch(leadsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadsPayload),
        cache: "no-store",
      });
    } catch (fetchErr) {
      console.error(
        "Booking → /api/leads fetch failed:",
        fetchErr instanceof Error ? fetchErr.message : fetchErr
      );
      return NextResponse.json(
        { error: "Could not reach PROXe; please try again in a moment." },
        { status: 502 }
      );
    }

    let proxeJson:
      | { ok?: boolean; lead_id?: string; message?: string; error?: string }
      | null = null;
    try {
      proxeJson = await proxeRes.json();
    } catch {
      // Empty / non-JSON body — leave proxeJson null and fall through.
    }

    if (!proxeRes.ok) {
      console.error(
        "Booking → /api/leads non-OK:",
        proxeRes.status,
        proxeJson
      );
      return NextResponse.json(
        {
          error:
            proxeJson?.message ||
            proxeJson?.error ||
            "Booking failed at PROXe forward",
        },
        { status: proxeRes.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Demo session booked successfully",
        lead_id: proxeJson?.lead_id,
        booking: { demoType, preferredDate },
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
