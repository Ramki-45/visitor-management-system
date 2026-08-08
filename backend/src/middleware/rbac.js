import AppError from "../utils/AppError.js";

/**
 * Role-Based Access Control (RBAC).
 *
 * Must be used after the authenticate middleware.
 *
 * Example:
 * router.post(
 *   "/approve",
 *   authenticate,
 *   authorize([ROLES.EMPLOYEE]),
 *   controller
 * );
 */
const authorize = (allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) {
    throw new Error("authorize() expects an array of roles.");
  }

  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication middleware must run before authorization.",
          500,
          "AUTH_MIDDLEWARE_MISSING",
        ),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403,
          "FORBIDDEN",
        ),
      );
    }

    next();
  };
};

export default authorize;
