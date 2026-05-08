import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { startServer } = require("next/dist/server/lib/start-server");

const portArgIndex = process.argv.findIndex((arg) => arg === "-p" || arg === "--port");
const port = portArgIndex >= 0 ? Number(process.argv[portArgIndex + 1]) : 3000;

await startServer({
  dir: process.cwd(),
  port,
  isDev: true,
  hostname: "127.0.0.1",
  allowRetry: false,
  keepAliveTimeout: undefined,
});
