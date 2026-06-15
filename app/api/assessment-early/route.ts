import { NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";
import { forwardLeadToProxe } from "@/lib/proxe";

const EARLY_TAB_FROM_ENV = process.env.GOOGLE_SHEET_TAB_ASSESSMENT_EARLY?.trim();

function getEarlyTabsToTry(): string[] {
  const candidates = [EARLY_TAB_FROM_ENV, "Assessment Early", "Early Stage"];
  return candidates.filter(
    (tab, idx, arr): tab is string => !!tab && arr.indexOf(tab) === idx
  );
}

interface EarlyBody {
  name?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  audience?: "early_stage";
  eligibility?: "no" | "yes";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  // Ad-network click IDs (Meta/Google auto-tag with these instead of utm_*).
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  li_fat_id?: string;
  twclid?: string;
  wbraid?: string;
  gbraid?: string;
  traffic_source?: string;
  referrer?: string;
  landing_page?: string;
  sessionId?: string;
  timestamp?: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as EarlyBody;

    if (!data.name?.trim() || !data.phone?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required." },
        { status: 400 }
      );
    }

    const isoTimestamp = data.timestamp || new Date().toISOString();
    const audience = data.audience ?? "early_stage";

    const tabsToTry = getEarlyTabsToTry();
    const spreadsheetId = resolveSpreadsheetId(
      "GOOGLE_SHEET_ID_ASSESSMENT_EARLY",
      "ASSESSMENT_EARLY_SHEET_ID",
      "GOOGLE_SHEET_ID_ASSESSMENT",
      "ASSESSMENT_SHEET_ID",
      "GOOGLE_SHEET_ID"
    );

    // Resolved channel. Order: utm_source → click-IDs (auto-tagged ads beat
    // referrer-derived guesses) → traffic_source → "direct".
    // Reject legacy `referral:<host>` strings from older sessionStorage.
    const safeTrafficSource =
      typeof data.traffic_source === "string" &&
      !data.traffic_source.toLowerCase().startsWith("referral:")
        ? data.traffic_source
        : "";
    const channel =
      data.utm_source ||
      (data.fbclid ? "facebook_ads" : "") ||
      (data.gclid || data.wbraid || data.gbraid ? "google_ads" : "") ||
      (data.msclkid ? "bing_ads" : "") ||
      (data.ttclid ? "tiktok_ads" : "") ||
      (data.li_fat_id ? "linkedin_ads" : "") ||
      (data.twclid ? "twitter_ads" : "") ||
      safeTrafficSource ||
      "direct";
    const hasClickId = !!(
      data.gclid ||
      data.fbclid ||
      data.msclkid ||
      data.ttclid ||
      data.li_fat_id ||
      data.twclid ||
      data.wbraid ||
      data.gbraid
    );

    // A:U, existing A:M layout preserved (no shifting old rows) plus 8
    // new attribution columns appended at N:U so paid traffic can be
    // attributed without breaking historical rows.
    const row: (string | number)[] = [
      isoTimestamp,                               // A date
      data.name.trim(),                           // B name
      data.phone.trim(),                          // C phone
      (data.whatsapp || data.phone).trim(),       // D whatsapp
      audience,                                   // E audience
      data.utm_source ?? "",                      // F utm_source
      data.utm_medium ?? "",                      // G utm_medium
      data.utm_campaign ?? "",                    // H utm_campaign
      data.utm_term ?? "",                        // I utm_term
      data.utm_content ?? "",                     // J utm_content
      data.referrer ?? "",                        // K referrer
      data.landing_page ?? "",                    // L landing_page
      data.sessionId ?? "",                       // M session_id
      data.gclid ?? "",                           // N gclid
      data.fbclid ?? "",                          // O fbclid
      data.msclkid ?? "",                         // P msclkid
      data.ttclid ?? "",                          // Q ttclid
      data.li_fat_id ?? "",                       // R li_fat_id
      data.traffic_source ?? "",                  // S traffic_source
      channel,                                    // T channel
      hasClickId ? "TRUE" : "FALSE",              // U has_click_id
    ];

    let sheetsError: string | null = null;
    let sheetsOk = false;
    for (const tab of tabsToTry) {
      try {
        await appendToSheet(tab, "A1:U1", row, spreadsheetId);
        sheetsOk = true;
        sheetsError = null;
        break;
      } catch (err) {
        sheetsError = err instanceof Error ? err.message : String(err);
      }
    }

    // Early-stage leads now ALSO forward to PROXe (every lead inquiry goes to
    // PROXe; Sheets above is the backup). Non-blocking.
    const proxe = await forwardLeadToProxe({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      source: "page",
      formType: "early_stage",
      data: data as unknown as Record<string, unknown>,
      fields: {
        audience: "early_stage",
        eligibility: data.eligibility,
        whatsapp: data.whatsapp || data.phone,
      },
    });
    if (!proxe.ok) console.error("Early-stage PROXe forward failed:", proxe.error);

    if (sheetsError && !sheetsOk) {
      return NextResponse.json(
        {
          success: true,
          warning: "Saved to backup. Sheets error: " + sheetsError,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Early-stage API unhandled error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
