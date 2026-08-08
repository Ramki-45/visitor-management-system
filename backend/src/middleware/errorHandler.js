import env from "../config/env.js";
import AppError from "../utils/AppError.js";

/**
 * Send a consistent error response.
 */
const respond = (res, statusCode, code, message, details = null) => {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Global Error Handler
 * Must be the last middleware registered in app.js
 */

const errorHandler = (err, req, res, next) => {
  // 1. Application Errors
  if (err instanceof AppError) {
    return respond(res, err.statusCode, err.code, err.message);
  }

  // 2. Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return respond(res, 422, "VALIDATION_ERROR", "Validation failed", details);
  }

  // 3. MongoDB Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";

    return respond(
      res,
      409,
      "DUPLICATE_KEY",
      `A record with this ${field} already exists`,
    );
  }

  // 4. Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return respond(res, 400, "INVALID_ID", `Invalid value for ${err.path}`);
  }

  // 5. JWT Errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return respond(res, 401, "INVALID_TOKEN", "Invalid or expired token");
  }

  // 6. Unknown Errors
  console.error({
    method: req.method,
    url: req.originalUrl,
    error: err,
  });

  return respond(
    res,
    500,
    "INTERNAL_ERROR",
    env.NODE_ENV === "production" ? "Something went wrong" : err.message,
  );
};

export default errorHandler;
