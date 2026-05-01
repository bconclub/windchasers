/**
 * Stitch client wrapper for server-side usage.
 * Requires STITCH_API_KEY environment variable.
 * @see https://github.com/google-labs-code/stitch-sdk
 */

import { Stitch, StitchToolClient, stitch } from "@google/stitch-sdk";

let _stitchInstance: Stitch | null = null;
let _toolClient: StitchToolClient | null = null;

function getApiKey(): string {
  const key = process.env.STITCH_API_KEY?.trim();
  if (!key) {
    throw new Error("STITCH_API_KEY is not set in environment variables.");
  }
  return key;
}

/** Lazy-initialized Stitch SDK singleton. */
export function getStitch(): Stitch {
  if (!_stitchInstance) {
    const apiKey = getApiKey();
    _toolClient = new StitchToolClient({
      apiKey,
      baseUrl: process.env.STITCH_HOST || "https://stitch.googleapis.com/mcp",
      timeout: 300_000,
    });
    _stitchInstance = new Stitch(_toolClient);
  }
  return _stitchInstance;
}

/** Low-level tool client for MCP-style direct access. */
export function getStitchToolClient(): StitchToolClient {
  if (!_toolClient) {
    getStitch();
  }
  return _toolClient!;
}

/** Reset cached clients (useful in tests or after config changes). */
export function resetStitchClient() {
  _stitchInstance = null;
  _toolClient = null;
}
