import { message } from "telegraf/filters";
import { sendMessage } from "../../api/client.js";
import { getSession } from "../../db/session.service.js";
import { BotContext } from "../types.js";
import { handleApiError } from "./chats.handler.js";

const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

function splitIntoChunks(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > maxLength) {
    let cut = rest.lastIndexOf("\n", maxLength);
    if (cut <= 0) cut = maxLength;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest.length > 0) chunks.push(rest);
  return chunks;
}

export async function textMessageHandler(ctx: BotContext): Promise<void> {
  if (!ctx.has(message("text"))) return;
  const text = ctx.message.text.trim();
  if (!text || text.startsWith("/")) return;

  const session = await getSession(ctx.from!.id);
  if (!session) {
    await ctx.reply("Сначала войдите в аккаунт: /login");
    return;
  }
  if (!session.activeChatId) {
    await ctx.reply("Сначала выберите диалог: /chats");
    return;
  }

  const typingInterval = setInterval(() => {
    ctx.sendChatAction("typing").catch(() => undefined);
  }, 4000);
  await ctx.sendChatAction("typing");

  try {
    const result = await sendMessage(session.token, session.activeChatId, text);
    for (const chunk of splitIntoChunks(result.response, TELEGRAM_MAX_MESSAGE_LENGTH)) {
      await ctx.reply(chunk);
    }
  } catch (err) {
    await handleApiError(ctx, err);
  } finally {
    clearInterval(typingInterval);
  }
}
