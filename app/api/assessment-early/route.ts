import { NextResponse } from "next/server";
import { appendToSheet, resolveSpreadsheetId } from "@/lib/sheets";

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
    const channel =
      data.utm_source ||
      (data.fbclid ? "facebook_ads" : "") ||
      (data.gclid || data.wbraid || data.gbraid ? "google_ads" : "") ||
      (data.msclkid ? "bing_ads" : "") ||
      (data.ttclid ? "tiktok_ads" : "") ||
      (data.li_fat_id ? "linkedin_ads" : "") ||
      (data.twclid ? "twitter_ads" : "") ||
      data.traffic_source ||
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

    // A:U — existing A:M layout preserved (no shifting old rows) plus 8
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

    // Forward to PROXe via the unified /api/agent/leads/inbound endpoint as a
    // `page` type. Direct fetch (not via /api/leads) because the VPS Node
    // process can't reliably self-fetch its own public hostname through the
    // nginx/SSL layer — same pattern /api/booking uses. Non-blocking: if
    // PROXe is down we still return success because the sheet has the lead.
    const proxeBaseUrl = (process.env.PROXE_BASE_URL ?? "").trim();
    const proxeApiKey = (process.env.PROXE_INBOUND_API_KEY ?? "").trim();
    if (proxeBaseUrl && proxeApiKey) {
      const upstreamPayload = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email || undefined,
        source: "page",
        campaign: data.utm_campaign || null,
        city: data.city || undefined,
        brand: "windchasers",
        notes: "assessment_early",
        custom_fields: {
          form_type: "assessment_early",
          audience,
          page_url: data.landing_page || undefined,
          landing_url: data.landing_page || undefined,
          referrer: data.referrer || undefined,
          channel,
          traffic_source: data.traffic_source || undefined,
          utm_source: data.utm_source || undefined,
          utm_medium: data.utm_medium || undefined,
          utm_campaign: data.utm_campaign || undefined,
          utm_term: data.utm_term || undefined,
          utm_content: data.utm_content || undefined,
          gclid: data.gclid || undefined,
          fbclid: data.fbclid || undefined,
          msclkid: data.msclkid || undefined,
          ttclid: data.ttclid || undefined,
          li_fat_id: data.li_fat_id || undefined,
          twclid: data.twclid || undefined,
          wbraid: data.wbraid || undefined,
          gbraid: data.gbraid || undefined,
          has_click_id: hasClickId,
        },
      };
      const upstreamUrl = `${proxeBaseUrl.replace(/\/+$/, "")}/api/agent/leads/inbound`;
      // Fire-and-forget with a short timeout. If PROXe is sluggish or down,
      // we still finish the request and rely on the sheet write.
      try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(upstreamUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": proxeApiKey,
          },
          body: JSON.stringify(upstreamPayload),
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(t);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.warn(
            "assessment-early → PROXe non-OK:",
            res.status,
            txt.slice(0, 200)
          );
        }
      } catch (proxeErr) {
        console.warn(
          "assessment-early → PROXe fetch failed (sheet still wrote):",
          proxeErr instanceof Error ? proxeErr.message : proxeErr
        );
      }
    } else {
      console.warn(
        "assessment-early: PROXE_BASE_URL or PROXE_INBOUND_API_KEY not set, skipping PROXe forward"
      );
    }

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
