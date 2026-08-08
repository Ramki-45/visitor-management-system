import User from "../models/User.js";
import Employee from "../models/Employee.js";

import AppError from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";

/**
 * Authenticate user and generate JWT.
 */
export const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user || !user.isActive) {
    throw new AppError(
      "Invalid email or password.",
      401,
      "INVALID_CREDENTIALS",
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password.",
      401,
      "INVALID_CREDENTIALS",
    );
  }

  const employee = await Employee.findOne({
    userId: user._id,
  })
    .select("_id")
    .lean();

  const employeeId = employee?._id?.toString() || null;

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
    employeeId,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId,
    },
  };
};

/**
 * Get the currently authenticated user's profile.
 */
export const getCurrentUser = async ({ id }) => {
  const user = await User.findById(id).lean();

  if (!user || !user.isActive) {
    throw new AppError(
      "Account not found or deactivated.",
      401,
      "ACCOUNT_INACTIVE",
    );
  }

  const employee = await Employee.findOne({
    userId: user._id,
  })
    .select("_id")
    .lean();

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    employeeId: employee?._id?.toString() || null,
  };
};
