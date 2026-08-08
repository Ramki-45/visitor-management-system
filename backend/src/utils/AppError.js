/**
 * Custom application error.
 *
 * Used to throw predictable (operational) errors from services,
 * controllers, and middleware. The global error handler converts
 * these into consistent API responses.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
