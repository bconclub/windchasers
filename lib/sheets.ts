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
 * Extract the 7 attribution cells appended at the end of every form's sheet row:
 * [utm_source, utm_medium, utm_campaign, utm_term, utm_content, landing_page, referrer].
 *
 * Forms POST UTMs either flat (utm_source) or nested (utmParams.utm_source). This
 * helper handles both. The order is stable so sheet columns line up across forms.
 */
export function extractAttributionCells(data: Record<string, unknown>): string[] {
  const utm =
    (data.utmParams as Record<string, unknown> | undefined) ?? data;
  const pick = (k: string): string => {
    const direct = data[k];
    if (typeof direct === "string" && direct) return direct;
    const nested = utm?.[k];
    return typeof nested === "string" ? nested : "";
  };
  return [
    pick("utm_source"),
    pick("utm_medium"),
    pick("utm_campaign"),
    pick("utm_term"),
    pick("utm_content"),
    typeof data.landing_page === "string" ? data.landing_page : "",
    typeof data.referrer === "string" ? data.referrer : "",
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
