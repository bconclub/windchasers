import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("ATC Form Submission:", {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      qualification: data.qualification,
      hasUtm: !!data.utmParams,
    });

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: "1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk",
      range: "ATC Web Lead!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),      // Timestamp (A)
            data.name || "",               // Name (B)
            data.phone || "",              // Phone (C)
            data.email || "",              // Email (D)
            data.city || "",               // City (E)
            data.qualification || "",      // Qualification (F)
          ],
        ],
      },
    });

    console.log("ATC Sheets API success:", JSON.stringify(result.data));

    return NextResponse.json({ success: true, data: result.data });
  } catch (err) {
    console.error("ATC Sheets error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
