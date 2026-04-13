import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendToSheet(
  tabName: string,
  range: string,
  values: (string | number | boolean | null | undefined)[]
) {
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

  return result.data;
}
