import { Telegraf, Scenes, session } from "telegraf";
import { env } from "../config/env.js";
import { BotContext } from "./types.js";
import { loginScene } from "./scenes/login.scene.js";
import {
  startHandler,
  helpHandler,
  loginCommand,
  logoutCommand,
  whoamiCommand,
} from "./handlers/commands.js";
import { chatsCommand, newChatCommand, chatSelectCallback } from "./handlers/chats.handler.js";
import { textMessageHandler } from "./handlers/message.handler.js";

export function createBot(): Telegraf<BotContext> {
  const bot = new Telegraf<BotContext>(env.telegramBotToken);

  const stage = new Scenes.Stage<BotContext>([loginScene]);
  bot.use(session());
  bot.use(stage.middleware());

  bot.command("start", startHandler);
  bot.command("help", helpHandler);
  bot.command("login", loginCommand);
  bot.command("logout", logoutCommand);
  bot.command("whoami", whoamiCommand);
  bot.command("chats", chatsCommand);
  bot.command("new", newChatCommand);

  bot.on("callback_query", chatSelectCallback);
  bot.on("text", textMessageHandler);

  bot.catch((err, ctx) => {
    console.error(`[bot] error for ${ctx.updateType}`, err);
  });

  return bot;
}
