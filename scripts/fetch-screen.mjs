import { Stitch, StitchToolClient } from "@google/stitch-sdk";
import fs from "fs";

async function main() {
  const apiKey = process.env.STITCH_API_KEY;
  if (!apiKey) {
    throw new Error(
      "STITCH_API_KEY env var not set. Export it from .env.local before running this script."
    );
  }

  const client = new StitchToolClient({
    apiKey,
    timeout: 300_000,
  });
  const stitch = new Stitch(client);

  const project = stitch.project("11599633216802750147");
  const screen = await project.getScreen("b824dad9b47b439bba7f5252b3d652f8");

  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();

  console.log("HTML URL:", htmlUrl);
  console.log("Image URL:", imageUrl);

  // Download HTML
  const htmlRes = await fetch(htmlUrl);
  const html = await htmlRes.text();
  fs.writeFileSync("scripts/stitch-windchasers-landing.html", html);
  console.log("Saved HTML to scripts/stitch-windchasers-landing.html");

  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
