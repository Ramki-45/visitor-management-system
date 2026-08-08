import jwt from "jsonwebtoken";

import env from "../config/env.js";

/**
 * Generate a JWT for an authenticated user.
 *
 * Payload:
 * - id          : User ID
 * - role        : User role
 * - employeeId  : Linked Employee ID (if applicable)
 * - email       : User email (optional, useful for logging/display)
 */
export const signToken = ({ id, role, employeeId = null, email = null }) => {
  return jwt.sign(
    {
      id,
      role,
      employeeId,
      email,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
};

/**
 * Verify and decode a JWT.
 *
 * Throws JsonWebTokenError or TokenExpiredError
 * if the token is invalid or expired.
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
