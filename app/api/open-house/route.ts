import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log('ENV CHECK:', {
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      sheetId: process.env.GOOGLE_SHEET_ID,
      tab: process.env.GOOGLE_SHEET_TAB,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    });

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    console.log('Attempting Sheets API call...');

    const result = await sheets.spreadsheets.values.append({
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

    console.log('Sheets API success:', JSON.stringify(result.data));

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error('Sheets error full:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
