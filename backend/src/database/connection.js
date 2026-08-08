import mongoose from "mongoose";
import env from "../config/env.js";

let connectionPromise = null;

/**
 * Establishes a connection to MongoDB.
 *
 * Reuses the existing connection when running in a
 * serverless environment such as Vercel.
 */
export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Connection already in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  console.log("Attempting MongoDB connection...");
  console.log("Mongo URI configured:", Boolean(env.MONGO_URI));

  connectionPromise = mongoose
    .connect(env.MONGO_URI)
    .then(() => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);

      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;

      console.error("MongoDB Connection Failed:");
      console.error(error.message);

      throw error;
    });

  return connectionPromise;
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    connectionPromise = null;
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error.message);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB Error:", error.message);
});
