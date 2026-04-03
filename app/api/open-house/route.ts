import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${process.env.GOOGLE_SHEET_TAB}!A:P`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            data.name || "",
            data.phone || "",
            data.email || "",
            data.status || "",
            data.city || "",
            data.parentAttending || "",
            data.role || "",
            data.utm_source || "",
            data.utm_medium || "",
            data.utm_campaign || "",
            data.utm_term || "",
            data.utm_content || "",
            data.landingPage || "",
            data.sessionId || "",
          ],
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Sheets API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
