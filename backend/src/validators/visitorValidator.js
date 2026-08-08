import { body, query } from "express-validator";

/**
 * Validation rules for visitor details.
 * These validators are reused inside the
 * Visit Request registration endpoint.
 */
export const visitorFieldsValidator = [
  body("visitor.name")
    .trim()
    .notEmpty()
    .withMessage("Visitor name is required."),

  body("visitor.phone")
    .trim()
    .notEmpty()
    .withMessage("Visitor phone is required.")
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Invalid phone number format."),

  body("visitor.email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email address."),

  body("visitor.company").optional({ checkFalsy: true }).trim(),

  body("visitor.idProofType").optional({ checkFalsy: true }).trim(),

  body("visitor.idProofNumber").optional({ checkFalsy: true }).trim(),
];

/**
 * Validation rules for visitor search.
 */
export const visitorSearchValidator = [query("search").optional().trim()];
