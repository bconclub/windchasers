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

  // Accept project + screen IDs from CLI args, fall back to defaults.
  const projectId = process.argv[2] || "11599633216802750147";
  const screenId = process.argv[3] || "b824dad9b47b439bba7f5252b3d652f8";
  const outFile =
    process.argv[4] || `scripts/stitch-${screenId.slice(0, 8)}.html`;

  const project = stitch.project(projectId);
  const screen = await project.getScreen(screenId);

  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();

  console.log("HTML URL:", htmlUrl);
  console.log("Image URL:", imageUrl);

  // Download HTML
  const htmlRes = await fetch(htmlUrl);
  const html = await htmlRes.text();
  fs.writeFileSync(outFile, html);
  console.log("Saved HTML to", outFile);

  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
