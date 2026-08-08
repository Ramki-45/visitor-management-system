import { body } from "express-validator";

/**
 * Validation rules for user login.
 *
 * Only validates the request format.
 * Authentication logic (checking credentials)
 * belongs in auth.service.js.
 */
export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isString()
    .withMessage("Password must be a string."),
];
