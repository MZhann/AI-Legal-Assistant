import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isDevelopment = nodeEnv === "development";
const isProduction = nodeEnv === "production";

// In production, require explicit config (no localhost defaults)
if (isProduction) {
  if (!process.env.CORS_ORIGIN?.trim()) {
    throw new Error("CORS_ORIGIN is required in production. Set it to your frontend URL (e.g. https://your-app.vercel.app)");
  }
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is required in production and must be at least 32 characters");
  }
}

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
  nodeEnv,
  mongodbUri:
    process.env.MONGODB_URI ||
    (isDevelopment ? "mongodb://localhost:27017/ai-legal-assistant" : ""),
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  corsOrigin:
    process.env.CORS_ORIGIN ||
    (isDevelopment ? "http://localhost:3000" : ""),
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY || "",
  openaiApiKey: process.env.OPENAI_API_KEY,
  jwtSecret:
    process.env.JWT_SECRET ||
    (isDevelopment ? "your-super-secret-jwt-key-change-in-production" : ""),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export { isDevelopment, isProduction };
