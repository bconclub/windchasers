import { Stitch, StitchToolClient } from "@google/stitch-sdk";

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

  console.log("Listing projects...");
  const projects = await stitch.projects();
  console.log("Found", projects.length, "projects\n");

  for (const project of projects) {
    console.log("Project:", project.projectId);
    console.log("Project data keys:", Object.keys(project));
    if (project.data) {
      console.log("Project data:", JSON.stringify(project.data, null, 2).slice(0, 2000));
    }

    const screens = await project.screens();
    for (const screen of screens) {
      console.log("\n  Screen:", screen.screenId);
      console.log("  Screen keys:", Object.keys(screen));
      if (screen.data) {
        console.log("  Screen data:", JSON.stringify(screen.data, null, 2).slice(0, 2000));
      }
    }
    console.log("\n---\n");
  }

  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
