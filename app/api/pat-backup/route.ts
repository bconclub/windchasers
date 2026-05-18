import { NextResponse } from "next/server";
import {
  appendToSheetEnsuringTab,
  extractAttributionCells,
  getPatBackupSheetTab,
} from "@/lib/sheets";

// Backup destination for PAT submissions. PROXe is the system of record for
// PAT leads, but their backend has occasional outages (e.g. taskErr crash on
// 2026-05-18). We mirror every PAT submission here so a 502 from PROXe never
// costs us a lead.
//
// Event Data 2026 spreadsheet by default. Override with
// GOOGLE_SHEET_ID_PAT_BACKUP if PAT backup ever lives in a different workbook.
const PAT_BACKUP_SHEET_ID =
  process.env.GOOGLE_SHEET_ID_PAT_BACKUP?.trim() ||
  process.env.EVENT_DATA_2026_SHEET_ID?.trim() ||
  "145KgARkFGEi4_hjwR5dN6Vv8NJlnmzHhX8I7wvNOc-w";

interface PatBackupBody {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  audience?: string;
  page_url?: string;
  // Scores
  total_score?: number;
  qualification_score?: number;
  aptitude_score?: number;
  readiness_score?: number;
  tier?: string;
  eligible_class_12_pass?: boolean;
  // Raw answers as JSON string (so they fit in a single cell)
  answers?: unknown;
  // PROXe outcome — caller tells us whether the parallel /api/leads call
  // succeeded, so we can flag rows that need manual reconciliation.
  proxe_status?: "success" | "failed" | "pending";
  proxe_lead_id?: string;
  // Attribution — same shape as the sheet routes use
  utmParams?: Record<string, string>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as PatBackupBody;
    const tab = getPatBackupSheetTab();

    // Sheet column layout (matches "PAT Backup"):
    //   A Date  B Name  C Phone  D Email  E City  F Audience
    //   G Total  H Tier  I Qualification  J Aptitude  K Readiness
    //   L Eligible 12th  M PROXe Status  N PROXe Lead ID  O Answers (JSON)
    //   P-V utm_source..utm_content, landing_page, referrer
    const result = await appendToSheetEnsuringTab(
      tab,
      "A:V",
      [
        new Date().toISOString(),                       // A: Date
        data.name || "",                                // B: Name
        data.phone || "",                               // C: Phone
        data.email || "",                               // D: Email
        data.city || "",                                // E: City
        data.audience || "student",                     // F: Audience
        data.total_score ?? "",                         // G: Total Score
        data.tier || "",                                // H: Tier
        data.qualification_score ?? "",                 // I: Qualification
        data.aptitude_score ?? "",                      // J: Aptitude
        data.readiness_score ?? "",                     // K: Readiness
        data.eligible_class_12_pass === true            // L: Eligible
          ? "TRUE"
          : data.eligible_class_12_pass === false
            ? "FALSE"
            : "",
        data.proxe_status || "pending",                 // M: PROXe Status
        data.proxe_lead_id || "",                       // N: PROXe Lead ID
        data.answers ? JSON.stringify(data.answers) : "", // O: Answers
        ...extractAttributionCells(                     // P:V: utm + page
          data as Record<string, unknown>
        ),
      ],
      PAT_BACKUP_SHEET_ID
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    console.error(
      "PAT Backup Sheets error:",
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
