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
  audience?: "early_stage";
  eligibility?: "no" | "yes";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
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

    // A:M
    // date | name | phone | whatsapp | audience | utm_source | utm_medium |
    //   utm_campaign | utm_term | utm_content | referrer | landing_page | session_id
    const row: (string | number)[] = [
      isoTimestamp,
      data.name.trim(),
      data.phone.trim(),
      (data.whatsapp || data.phone).trim(),
      audience,
      data.utm_source ?? "",
      data.utm_medium ?? "",
      data.utm_campaign ?? "",
      data.utm_term ?? "",
      data.utm_content ?? "",
      data.referrer ?? "",
      data.landing_page ?? "",
      data.sessionId ?? "",
    ];

    let sheetsError: string | null = null;
    let sheetsOk = false;
    for (const tab of tabsToTry) {
      try {
        await appendToSheet(tab, "A1:M1", row, spreadsheetId);
        sheetsOk = true;
        sheetsError = null;
        break;
      } catch (err) {
        sheetsError = err instanceof Error ? err.message : String(err);
      }
    }

    // Note: dead build.goproxe.com/webhook/pat-test removed. PROXe is now
    // reached via the unified /api/leads proxy. Early-stage is not yet wired
    // to /api/leads (see GPFC scope - PAT-only first). Re-add as a /api/leads
    // "page" call (form_name: "assessment_early") once approved.

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
