import * as authService from "../services/authService.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({
    email,
    password,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * GET /api/auth/me
 */

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser({
    id: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
