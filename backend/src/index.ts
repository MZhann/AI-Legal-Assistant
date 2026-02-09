import { createServer } from "http";
import { createApp } from "./app.js";
import { env, connectDatabase, isDevelopment } from "./config/index.js";
import { socketService } from "./services/socket.service.js";

async function bootstrap(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const server = createServer(app);

    // Initialize Socket.io
    socketService.initialize(server);

    // Start server
    server.listen(env.port, () => {
      console.log("🚀 ═══════════════════════════════════════════════════");
      console.log(`🚀 AI Legal Assistant API`);
      console.log(`🚀 Environment: ${env.nodeEnv}`);
      console.log(`🚀 Server running on port ${env.port}`);
      console.log(`🚀 API prefix: ${env.apiPrefix}`);
      if (isDevelopment) {
        console.log(`🚀 Health check: http://localhost:${env.port}/health`);
        console.log(`🚀 WebSocket: ws://localhost:${env.port}`);
      } else {
        console.log(`🚀 Health check: /health`);
      }
      console.log("🚀 ═══════════════════════════════════════════════════");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
