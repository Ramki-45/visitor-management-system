import env from "./config/env.js";
import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./database/connection.js";

let server;

/**
 * Connect to MongoDB and start the Express server.
 */
const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(env.PORT, () => {
      console.log(
        `Server running in ${env.NODE_ENV} mode on port http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

/**
 * Gracefully shut down the application.
 */
const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      console.log("Database disconnected");
      console.log("Server stopped");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

startServer();
