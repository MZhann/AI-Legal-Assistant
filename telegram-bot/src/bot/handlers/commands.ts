import { getSession, clearSession } from "../../db/session.service.js";
import { BotContext } from "../types.js";
import { LOGIN_SCENE_ID } from "../scenes/login.scene.js";

export async function startHandler(ctx: BotContext): Promise<void> {
  const session = await getSession(ctx.from!.id);
  if (session) {
    await ctx.reply(
      `С возвращением, ${session.email}!\n` +
        "Используйте /chats, чтобы выбрать диалог, или просто напишите сообщение, чтобы продолжить текущий."
    );
    return;
  }
  await ctx.reply(
    "Привет! Это бот AI Legal Assistant.\n\n" +
      "Войдите в свой аккаунт с сайта командой /login, затем выберите диалог через /chats " +
      "и продолжайте переписку с AI прямо здесь — она будет синхронизирована с сайтом."
  );
}

export async function helpHandler(ctx: BotContext): Promise<void> {
  await ctx.reply(
    "Доступные команды:\n" +
      "/login — войти в аккаунт\n" +
      "/logout — выйти из аккаунта\n" +
      "/chats — список ваших диалогов и выбор активного\n" +
      "/new — создать новый диалог\n" +
      "/whoami — текущий пользователь и активный диалог\n\n" +
      "После выбора диалога просто пишите сообщения — они уйдут в AI и появятся в истории на сайте."
  );
}

export async function loginCommand(ctx: BotContext): Promise<void> {
  await ctx.scene.enter(LOGIN_SCENE_ID);
}

export async function logoutCommand(ctx: BotContext): Promise<void> {
  await clearSession(ctx.from!.id);
  await ctx.reply("Вы вышли из аккаунта. Используйте /login, чтобы войти снова.");
}

export async function whoamiCommand(ctx: BotContext): Promise<void> {
  const session = await getSession(ctx.from!.id);
  if (!session) {
    await ctx.reply("Вы не вошли в аккаунт. Используйте /login.");
    return;
  }
  await ctx.reply(
    `Аккаунт: ${session.email}\n` +
      `Активный диалог: ${session.activeChatTitle || "не выбран (используйте /chats)"}`
  );
}
