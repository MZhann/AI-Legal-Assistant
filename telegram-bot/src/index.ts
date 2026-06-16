import http from "node:http";
import { env } from "./config/env.js";
import { connectDb } from "./db/mongoose.js";
import { createBot } from "./bot/bot.js";

async function main(): Promise<void> {
  await connectDb();

  const bot = createBot();

  // Minimal HTTP server so Railway doesn't flag "no open port" if this
  // service is attached to a domain. The bot itself runs on long polling.
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  });
  server.listen(env.port, () => {
    console.log(`[bot] health server listening on port ${env.port}`);
  });

  // launch() resolves only when the bot stops (it runs the polling loop),
  // so don't await it here — fire it and log readiness once it's underway.
  bot.launch().catch((err) => {
    console.error("[bot] polling stopped with error", err);
    process.exit(1);
  });
  await bot.telegram.getMe();
  console.log("[bot] Telegram bot started (long polling)");

  process.once("SIGINT", () => {
    bot.stop("SIGINT");
    server.close();
  });
  process.once("SIGTERM", () => {
    bot.stop("SIGTERM");
    server.close();
  });
}

main().catch((err) => {
  console.error("[bot] fatal startup error", err);
  process.exit(1);
});
