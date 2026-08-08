import { query } from "express-validator";

/**
 * Validation rules for visitor analytics report.
 *
 * Supported:
 * GET /api/reports/visitors?range=today
 * GET /api/reports/visitors?range=week
 * GET /api/reports/visitors?range=custom&from=2026-08-01&to=2026-08-07
 */
export const visitorReportValidator = [
  query("range")
    .optional()
    .isIn(["today", "week", "custom"])
    .withMessage("range must be one of: today, week, custom"),

  query("from")
    .optional()
    .isISO8601()
    .withMessage("from must be a valid ISO date (YYYY-MM-DD)"),

  query("to")
    .optional()
    .isISO8601()
    .withMessage("to must be a valid ISO date (YYYY-MM-DD)"),

  query("range").custom((value, { req }) => {
    if (value === "custom") {
      if (!req.query.from || !req.query.to) {
        throw new Error("from and to are required when range=custom");
      }
    }

    return true;
  }),
];
