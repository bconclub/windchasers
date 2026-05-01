#!/usr/bin/env tsx
/**
 * Stitch MCP Server
 *
 * Exposes Google Stitch tools via Model Context Protocol (MCP).
 * Run this server and point your MCP client (Claude Desktop, Cursor, etc.) to it.
 *
 * Usage:
 *   npx tsx scripts/stitch-mcp-server.ts
 *
 * Environment:
 *   STITCH_API_KEY - Required. Your Stitch API key.
 *   STITCH_HOST    - Optional. Override MCP server URL.
 *
 * @see https://stitch.withgoogle.com/docs/mcp/guide/
 */

import { StitchProxy } from "@google/stitch-sdk";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const apiKey = process.env.STITCH_API_KEY?.trim();
if (!apiKey) {
  console.error("STITCH_API_KEY environment variable is required.");
  process.exit(1);
}

const proxy = new StitchProxy({
  apiKey,
  url: process.env.STITCH_HOST || "https://stitch.googleapis.com/mcp",
});

const transport = new StdioServerTransport();

proxy.start(transport).catch((err: unknown) => {
  console.error("MCP server error:", err);
  process.exit(1);
});

console.error("Stitch MCP server started on stdio");
