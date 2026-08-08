import { body, param, query } from "express-validator";
import { visitorFieldsValidator } from "./visitorValidator.js";

/**
 * Validation rules for creating a visit request.
 *
 * Only validates request structure.
 * Business Rules (Rule 1–10) are handled in the service layer.
 */
export const createVisitRequestValidator = [
  ...visitorFieldsValidator,

  body("employeeId").isMongoId().withMessage("Valid employee ID is required."),

  body("purpose")
    .trim()
    .notEmpty()
    .withMessage("Purpose of visit is required."),

  body("visitDate").isISO8601().withMessage("Valid visit date is required."),

  body("expectedArrivalTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Expected arrival time must be in HH:mm format."),
];

/**
 * Validate Visit Request ID parameter.
 */
export const visitRequestIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid visit request ID."),
];

/**
 * Validate reject request.
 */
export const rejectValidator = [
  ...visitRequestIdParamValidator,

  body("remarks").optional({ checkFalsy: true }).trim(),
];

/**
 * Validate cancel request.
 */
export const cancelValidator = [
  ...visitRequestIdParamValidator,

  body("cancelReason").optional({ checkFalsy: true }).trim(),
];

/**
 * Validate query parameters for listing visit requests.
 */
export const listVisitRequestsValidator = [
  query("status").optional().trim(),

  query("employeeId")
    .optional()
    .isMongoId()
    .withMessage("Invalid employee ID."),

  query("visitorName").optional().trim(),

  query("visitDate").optional().isISO8601().withMessage("Invalid visit date."),

  query("dateFrom").optional().isISO8601().withMessage("Invalid start date."),

  query("dateTo").optional().isISO8601().withMessage("Invalid end date."),
];
