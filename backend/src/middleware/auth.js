import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

import User from "../models/User.js";

/**
 * Authentication middleware.
 *
 * Verifies the JWT, checks that the user still exists and is active,
 * then attaches the authenticated user to req.user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authentication token is missing.", 401, "NO_TOKEN");
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError("Invalid or expired token.", 401, "INVALID_TOKEN");
  }

  const user = await User.findById(decoded.id).lean();

  if (!user || !user.isActive) {
    throw new AppError(
      "Account not found or deactivated.",
      401,
      "ACCOUNT_INACTIVE",
    );
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    employeeId: decoded.employeeId,
    email: user.email,
  };

  next();
});

export default authenticate;
