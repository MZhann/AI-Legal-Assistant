import { BotSession, BotSessionDoc } from "./bot-session.model.js";

export async function getSession(telegramId: number): Promise<BotSessionDoc | null> {
  return BotSession.findOne({ telegramId }).lean();
}

export async function saveSession(
  telegramId: number,
  data: { token: string; userId: string; email: string }
): Promise<void> {
  await BotSession.findOneAndUpdate(
    { telegramId },
    { ...data, $unset: { activeChatId: 1, activeChatTitle: 1 } },
    { upsert: true }
  );
}

export async function setActiveChat(
  telegramId: number,
  chatId: string,
  chatTitle: string
): Promise<void> {
  await BotSession.findOneAndUpdate(
    { telegramId },
    { activeChatId: chatId, activeChatTitle: chatTitle }
  );
}

export async function clearSession(telegramId: number): Promise<void> {
  await BotSession.deleteOne({ telegramId });
}
