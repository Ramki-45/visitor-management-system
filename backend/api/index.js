// backend/api/index.js
import app from "../src/app.js";
import { connectDatabase } from "../src/database/connection.js";

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database initialization failed:", error);
    return res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Database connection unavailable",
      },
    });
  }
}
