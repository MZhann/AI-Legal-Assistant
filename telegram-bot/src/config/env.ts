import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

interface EnvConfig {
  nodeEnv: string;
  telegramBotToken: string;
  backendApiUrl: string;
  mongodbUri: string;
  port: number;
}

export const env: EnvConfig = {
  nodeEnv,
  telegramBotToken: required("TELEGRAM_BOT_TOKEN"),
  backendApiUrl: required("BACKEND_API_URL").replace(/\/+$/, ""),
  mongodbUri: required("MONGODB_URI"),
  port: parseInt(process.env.PORT || "8080", 10),
};

export { isProduction };
