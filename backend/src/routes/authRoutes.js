import express from "express";

import { login, getMe } from "../controllers/authController.js";
import { loginValidator } from "../validators/authValidator.js";

import validate from "../middleware/validate.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
router.post("/login", loginValidator, validate, login);

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
router.get("/me", authenticate, getMe);

export default router;
