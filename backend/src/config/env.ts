import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  apiPrefix: string;
  corsOrigin: string;
  googleAiApiKey: string;
  openaiApiKey?: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/ai-legal-assistant",
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY,
  jwtSecret:
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export const isDevelopment = env.nodeEnv === "development";
export const isProduction = env.nodeEnv === "production";
