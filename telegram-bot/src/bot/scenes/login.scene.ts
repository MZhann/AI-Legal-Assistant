import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { login, ApiError } from "../../api/client.js";
import { saveSession } from "../../db/session.service.js";
import { BotContext, LoginWizardState } from "../types.js";

export const LOGIN_SCENE_ID = "login-wizard";

export const loginScene = new Scenes.WizardScene<BotContext>(
  LOGIN_SCENE_ID,
  async (ctx) => {
    await ctx.reply("Введите email от вашего аккаунта на сайте:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.has(message("text"))) {
      await ctx.reply("Пожалуйста, отправьте email в виде текста.");
      return;
    }
    const email = ctx.message.text.trim();
    (ctx.wizard.state as LoginWizardState).email = email;
    await ctx.reply(
      "Теперь введите пароль.\nСообщение с паролем будет удалено сразу после отправки."
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.has(message("text"))) {
      await ctx.reply("Пожалуйста, отправьте пароль в виде текста.");
      return;
    }
    const password = ctx.message.text.trim();
    const email = (ctx.wizard.state as LoginWizardState).email;

    // Best-effort: remove the password message from the chat history.
    try {
      await ctx.deleteMessage(ctx.message.message_id);
    } catch {
      // Telegram may not allow deletion (e.g. message too old) — ignore.
    }

    if (!email) {
      await ctx.reply("Произошла ошибка, начните заново: /login");
      return ctx.scene.leave();
    }

    try {
      const result = await login(email, password);
      await saveSession(ctx.from!.id, {
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
      });
      await ctx.reply(
        `Вы вошли как ${result.user.firstName} ${result.user.lastName} (${result.user.email}).\n` +
          "Используйте /chats, чтобы выбрать диалог и продолжить переписку с AI."
      );
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Не удалось войти.";
      await ctx.reply(`Ошибка входа: ${msg}\nПопробуйте снова: /login`);
    }

    return ctx.scene.leave();
  }
);
