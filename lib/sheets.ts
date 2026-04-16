import { google } from "googleapis";

const DEFAULT_SPREADSHEET_ID =
  process.env.GOOGLE_SHEET_ID || "1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk";

/** Open House registrations — many VPS `.env` files use `GOOGLE_SHEET_TAB` for this. */
export function getOpenHouseSheetTab(): string {
  return (
    process.env.GOOGLE_SHEET_TAB_OPEN_HOUSE?.trim() ||
    process.env.GOOGLE_SHEET_TAB?.trim() ||
    "Open House"
  );
}

/** Summer Camp registrations — set `GOOGLE_SHEET_TAB_SUMMERCAMP` if the tab is not literally "Summer Camp". */
export function getSummerCampSheetTab(): string {
  return process.env.GOOGLE_SHEET_TAB_SUMMERCAMP?.trim() || "Summer Camp";
}

/** First non-empty env key wins; fallback is DEFAULT_SPREADSHEET_ID. */
export function resolveSpreadsheetId(...envKeys: string[]): string {
  for (const key of envKeys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return DEFAULT_SPREADSHEET_ID;
}

/** A1 range with tab name — quote tab if it has spaces/special chars (Sheets API requirement). */
export function formatSheetA1Range(tabName: string, a1Range: string): string {
  const escaped = tabName.replace(/'/g, "''");
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
    requestBody: {
      values: [values.map((v) => (v == null ? "" : String(v)))],
    },
  });

  console.log("[SHEETS APPEND] success:", JSON.stringify(result.data));
  return result.data;
}
