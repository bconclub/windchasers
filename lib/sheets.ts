import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk";

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
  values: (string | number | boolean | null | undefined)[]
) {
  console.log("[SHEETS APPEND] spreadsheetId:", SPREADSHEET_ID);
  console.log("[SHEETS APPEND] tabName:", tabName);
  console.log("[SHEETS APPEND] range:", `${tabName}!${range}`);
  console.log("[SHEETS APPEND] values:", values);

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!${range}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values.map((v) => (v == null ? "" : String(v)))],
    },
  });

  console.log("[SHEETS APPEND] success:", JSON.stringify(result.data));
  return result.data;
}
