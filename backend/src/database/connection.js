import mongoose from "mongoose";
import env from "../config/env.js";

/**
 * Establishes a connection to MongoDB.
 * Called once during application startup.
 */
export const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log("Attempting MongoDB connection...");
    console.log("Mongo URI configured:", Boolean(env.MONGO_URI));

    await mongoose.connect(env.MONGO_URI);

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

/*disconnects from MongoDB.*/

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error("Error disconnecting MongoDB:", error.message);
  }
};

/*MongoDB connection event listeners.*/

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB Error:", error.message);
});
