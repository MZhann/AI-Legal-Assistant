import { Schema, model } from "mongoose";

export interface BotSessionDoc {
  telegramId: number;
  token: string;
  userId: string;
  email: string;
  activeChatId?: string;
  activeChatTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

const botSessionSchema = new Schema<BotSessionDoc>(
  {
    telegramId: { type: Number, required: true, unique: true, index: true },
    token: { type: String, required: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
    activeChatId: { type: String },
    activeChatTitle: { type: String },
  },
  { timestamps: true }
);

export const BotSession = model<BotSessionDoc>("BotSession", botSessionSchema);
