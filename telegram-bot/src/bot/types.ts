import { Scenes, Context } from "telegraf";

export interface LoginWizardState {
  email?: string;
}

export type BotContext = Context & Scenes.WizardContext<Scenes.WizardSessionData>;
