import { Markup } from "telegraf";
import { getChats, createChat, ApiError } from "../../api/client.js";
import { getSession, setActiveChat, clearSession } from "../../db/session.service.js";
import { BotContext } from "../types.js";

const CHAT_CALLBACK_PREFIX = "chat:";
const NEW_CHAT_CALLBACK = "newchat";

async function requireSession(ctx: BotContext) {
  const session = await getSession(ctx.from!.id);
  if (!session) {
    await ctx.reply("Сначала войдите в аккаунт: /login");
    return null;
  }
  return session;
}

export async function chatsCommand(ctx: BotContext): Promise<void> {
  const session = await requireSession(ctx);
  if (!session) return;

  try {
    const chats = await getChats(session.token);
    const buttons = chats.map((chat) => [
      Markup.button.callback(
        `${chat.title} (${chat.messageCount})`,
        `${CHAT_CALLBACK_PREFIX}${chat.id}`
      ),
    ]);
    buttons.push([Markup.button.callback("+ Новый диалог", NEW_CHAT_CALLBACK)]);

    if (chats.length === 0) {
      await ctx.reply(
        "У вас пока нет диалогов на сайте.",
        Markup.inlineKeyboard(buttons)
      );
      return;
    }

    await ctx.reply("Выберите диалог, чтобы продолжить его здесь:", Markup.inlineKeyboard(buttons));
  } catch (err) {
    await handleApiError(ctx, err);
  }
}

export async function newChatCommand(ctx: BotContext): Promise<void> {
  const session = await requireSession(ctx);
  if (!session) return;

  try {
    const chat = await createChat(session.token);
    await setActiveChat(ctx.from!.id, chat.id, chat.title);
    await ctx.reply(`Создан новый диалог «${chat.title}». Можете писать сообщения.`);
  } catch (err) {
    await handleApiError(ctx, err);
  }
}

export async function chatSelectCallback(ctx: BotContext): Promise<void> {
  const callbackQuery = ctx.callbackQuery;
  if (!callbackQuery || !("data" in callbackQuery) || !callbackQuery.data) return;

  const session = await requireSession(ctx);
  if (!session) {
    await ctx.answerCbQuery();
    return;
  }

  if (callbackQuery.data === NEW_CHAT_CALLBACK) {
    try {
      const chat = await createChat(session.token);
      await setActiveChat(ctx.from!.id, chat.id, chat.title);
      await ctx.answerCbQuery("Создан новый диалог");
      await ctx.editMessageText(`Создан новый диалог «${chat.title}». Можете писать сообщения.`);
    } catch (err) {
      await ctx.answerCbQuery("Ошибка");
      await handleApiError(ctx, err);
    }
    return;
  }

  if (!callbackQuery.data.startsWith(CHAT_CALLBACK_PREFIX)) return;
  const chatId = callbackQuery.data.slice(CHAT_CALLBACK_PREFIX.length);

  try {
    const chats = await getChats(session.token);
    const chat = chats.find((c) => c.id === chatId);
    await setActiveChat(ctx.from!.id, chatId, chat?.title || "Диалог");
    await ctx.answerCbQuery("Диалог выбран");
    await ctx.editMessageText(
      `Активный диалог: «${chat?.title || "Диалог"}».\nТеперь пишите сообщения — они будут отправлены AI и сохранены на сайте.`
    );
  } catch (err) {
    await ctx.answerCbQuery("Ошибка");
    await handleApiError(ctx, err);
  }
}

export async function handleApiError(ctx: BotContext, err: unknown): Promise<void> {
  if (err instanceof ApiError && err.status === 401) {
    await clearSession(ctx.from!.id);
    await ctx.reply("Сессия истекла. Войдите снова: /login");
    return;
  }
  const message = err instanceof ApiError ? err.message : "Произошла ошибка. Попробуйте позже.";
  await ctx.reply(`Ошибка: ${message}`);
}
