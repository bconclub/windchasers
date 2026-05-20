import { google } from "googleapis";

const DEFAULT_SPREADSHEET_ID =
  process.env.GOOGLE_SHEET_ID || "1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk";

/** Open House registrations - many VPS `.env` files use `GOOGLE_SHEET_TAB` for this. */
export function getOpenHouseSheetTab(): string {
  return (
    process.env.GOOGLE_SHEET_TAB_OPEN_HOUSE?.trim() ||
    process.env.GOOGLE_SHEET_TAB?.trim() ||
    "9th May Open Confirms"
  );
}

/** Summer Camp registrations - set `GOOGLE_SHEET_TAB_SUMMERCAMP` if the tab is not literally "Summer Camp". */
export function getSummerCampSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_SUMMERCAMP?.trim() || "Summer Camp";
}

/** Webinar registrations - set `GOOGLE_SHEET_TAB_WEBINAR` if the tab name differs. */
export function getWebinarSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_WEBINAR?.trim() || "Webinar";
}

/** NZ Seminar registrations - matches the "29 NZ Webinar Confirms" tab in
 * Event Data 2026. Override with `GOOGLE_SHEET_TAB_NZ_SEMINAR` if renamed. */
export function getNzSeminarSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_NZ_SEMINAR?.trim() || "29 NZ Webinar Confirms";
}

/** PAT backup tab. PROXe is the system of record but flaky; we mirror every
 * PAT submission here so a backend outage never costs us a lead. */
export function getPatBackupSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_PAT_BACKUP?.trim() || "PAT Backup";
}

/**
 * Extract the 15 attribution cells appended at the end of every form's sheet row:
 *   utm_source, utm_medium, utm_campaign, utm_term, utm_content,
 *   landing_page, referrer,
 *   gclid, fbclid, msclkid, ttclid, li_fat_id,
 *   traffic_source, channel, has_click_id
 *
 * Order is stable so sheet columns line up across every form. Click IDs
 * matter because Meta auto-tags ad URLs with `fbclid` (not `utm_*`) and
 * Google Ads with `gclid` — without these columns ad-driven leads look
 * like organic / DIRECT traffic in reports.
 *
 * Forms POST these either flat (`utm_source` / `fbclid`) or nested
 * (`utmParams.utm_source` / `clickIds.fbclid`). This helper handles both.
 */
export function extractAttributionCells(data: Record<string, unknown>): string[] {
  const utm =
    (data.utmParams as Record<string, unknown> | undefined) ?? data;
  const clickIds =
    (data.clickIds as Record<string, unknown> | undefined) ??
    (data.click_ids as Record<string, unknown> | undefined) ??
    data;
  const pick = (
    obj: Record<string, unknown> | undefined,
    k: string
  ): string => {
    const v = obj?.[k];
    if (typeof v === "string" && v) return v;
    return "";
  };
  const utmPick = (k: string) => pick(data, k) || pick(utm, k);
  const clickPick = (k: string) => pick(data, k) || pick(clickIds, k);

  // Compute channel + has_click_id at write time so the sheet has the
  // resolved value even if the client didn't pre-compute one.
  const utmSource = utmPick("utm_source");
  const trafficSource = pick(data, "traffic_source");
  const gclid = clickPick("gclid");
  const fbclid = clickPick("fbclid");
  const msclkid = clickPick("msclkid");
  const ttclid = clickPick("ttclid");
  const liFatId = clickPick("li_fat_id");
  // Discard client-supplied channel values that are platform tags (e.g.
  // "whatsapp" from the WA capture modal) — those belong in form_type, not
  // here. Only honour an explicit `channel` when it looks like a marketing
  // source value the client already resolved.
  const PLATFORM_BLOCKLIST = new Set([
    "whatsapp",
    "web",
    "voice",
    "call",
    "form",
  ]);
  const explicitChannelRaw = pick(data, "channel").toLowerCase();
  const explicitChannel = PLATFORM_BLOCKLIST.has(explicitChannelRaw)
    ? ""
    : pick(data, "channel");
  // Order: explicit channel → utm_source → click-IDs (Meta/Google auto-tag
  // with these and they win over a referrer-only signal) → traffic_source
  // (referrer-derived) → "direct".
  const wbraid = clickPick("wbraid");
  const gbraid = clickPick("gbraid");
  const twclid = clickPick("twclid");
  const channel =
    explicitChannel ||
    utmSource ||
    (fbclid ? "facebook_ads" : "") ||
    (gclid || wbraid || gbraid ? "google_ads" : "") ||
    (msclkid ? "bing_ads" : "") ||
    (ttclid ? "tiktok_ads" : "") ||
    (liFatId ? "linkedin_ads" : "") ||
    (twclid ? "twitter_ads" : "") ||
    trafficSource ||
    "direct";
  const hasClickId = !!(
    gclid ||
    fbclid ||
    msclkid ||
    ttclid ||
    liFatId ||
    wbraid ||
    gbraid ||
    twclid
  );

  return [
    utmSource,                                                       // K utm_source
    utmPick("utm_medium"),                                           // L utm_medium
    utmPick("utm_campaign"),                                         // M utm_campaign
    utmPick("utm_term"),                                             // N utm_term
    utmPick("utm_content"),                                          // O utm_content
    typeof data.landing_page === "string" ? data.landing_page : "",  // P landing_page
    typeof data.referrer === "string" ? data.referrer : "",          // Q referrer
    gclid,                                                           // R gclid
    fbclid,                                                          // S fbclid
    msclkid,                                                         // T msclkid
    ttclid,                                                          // U ttclid
    liFatId,                                                         // V li_fat_id
    trafficSource,                                                   // W traffic_source
    channel,                                                         // X channel
    hasClickId ? "TRUE" : "FALSE",                                   // Y has_click_id
  ];
}

/** Students CPL funnel - set `GOOGLE_SHEET_TAB_STUDENTS` once the tab is created. */
export function getStudentsSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_STUDENTS?.trim() || "Students Web Lead";
}

/** Parents CPL funnel - set `GOOGLE_SHEET_TAB_PARENTS` once the tab is created. */
export function getParentsSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_PARENTS?.trim() || "Parents Web Lead";
}

/** First non-empty env key wins; fallback is DEFAULT_SPREADSHEET_ID. */
export function resolveSpreadsheetId(...envKeys: string[]): string {
  for (const key of envKeys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return DEFAULT_SPREADSHEET_ID;
}

/** A1 range with tab name - quote tab if it has spaces/special chars (Sheets API requirement). */
export function formatSheetA1Range(tabName: string, a1Range: string): string {
  const normalizedTab = tabName.trim().replace(/^'(.*)'$/, "$1");
  const escaped = normalizedTab.replace(/'/g, "''");
  return `'${escaped}'!${a1Range}`;
}

function normalizePrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n").replace(/\n/g, "\n").trim();
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

  console.log("[SHEETS AUTH] clientEmail present:", !!clientEmail);
  console.log("[SHEETS AUTH] privateKey present:", !!privateKey);
  console.log("[SHEETS AUTH] privateKey starts with:", privateKey?.slice(0, 27));

  if (!clientEmail || !privateKey) {
    throw new Error(
      `Missing Google Sheets credentials. clientEmail=${!!clientEmail}, privateKey=${!!privateKey}`
    );
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendToSheet(
  tabName: string,
  range: string,
  values: (string | number | boolean | null | undefined)[],
  spreadsheetId?: string
) {
  const resolvedSpreadsheetId = spreadsheetId || DEFAULT_SPREADSHEET_ID;
  const fullRange = formatSheetA1Range(tabName, range);
  console.log("[SHEETS APPEND] spreadsheetId:", resolvedSpreadsheetId);
  console.log("[SHEETS APPEND] tabName:", tabName);
  console.log("[SHEETS APPEND] range:", fullRange);
  console.log("[SHEETS APPEND] values:", values);

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId: resolvedSpreadsheetId,
    range: fullRange,
    valueInputOption: "USER_ENTERED",
    // INSERT_ROWS forces the API to add a new row below the detected table
    // instead of trying to find empty cells (OVERWRITE default). Without
    // this, sheets that have gap-columns mid-row (e.g. blank Stage/Remarks)
    // confuse the table detector and new rows can land shifted to the right.
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values.map((v) => (v == null ? "" : String(v)))],
    },
  });

  console.log("[SHEETS APPEND] success:", JSON.stringify(result.data));
  return result.data;
}

/** Returns true if the error indicates the named tab doesn't exist yet. */
function isMissingTabError(err: unknown): boolean {
  if (!err) return false;
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : (err as { message?: string })?.message || JSON.stringify(err);
  return (
    /Unable to parse range/i.test(msg) ||
    /not found/i.test(msg) ||
    /No such sheet/i.test(msg) ||
    /sheet name/i.test(msg)
  );
}

/** Creates the named tab in the given spreadsheet. Idempotent: if the tab
 * already exists, the Google API returns 400 with `already exists`, which we
 * swallow. */
async function ensureSheetTab(
  tabName: string,
  spreadsheetId: string
): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: tabName },
            },
          },
        ],
      },
    });
    console.log("[SHEETS] created tab:", tabName);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/already exists/i.test(msg)) {
      console.log("[SHEETS] tab already exists, skipping create:", tabName);
      return;
    }
    throw err;
  }
}

/**
 * Like `appendToSheet`, but auto-creates the named tab on the first write
 * if it doesn't exist yet. Use this for surfaces where we control the tab
 * lifecycle (e.g. PAT Backup) and don't want to require manual setup in
 * the spreadsheet.
 */
export async function appendToSheetEnsuringTab(
  tabName: string,
  range: string,
  values: (string | number | boolean | null | undefined)[],
  spreadsheetId: string
) {
  try {
    return await appendToSheet(tabName, range, values, spreadsheetId);
  } catch (err) {
    if (!isMissingTabError(err)) throw err;
    console.warn(
      "[SHEETS] tab missing, creating it then retrying:",
      tabName,
      err instanceof Error ? err.message : String(err)
    );
    await ensureSheetTab(tabName, spreadsheetId);
    return await appendToSheet(tabName, range, values, spreadsheetId);
  }
}
