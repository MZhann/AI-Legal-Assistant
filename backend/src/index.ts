import { createApp } from "./app.js";
import { env, connectDatabase } from "./config/index.js";

async function bootstrap(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(env.port, () => {
      console.log("🚀 ═══════════════════════════════════════════════════");
      console.log(`🚀 AI Legal Assistant API`);
      console.log(`🚀 Environment: ${env.nodeEnv}`);
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`🚀 API prefix: ${env.apiPrefix}`);
      console.log(`🚀 Health check: http://localhost:${env.port}/health`);
      console.log("🚀 ═══════════════════════════════════════════════════");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
