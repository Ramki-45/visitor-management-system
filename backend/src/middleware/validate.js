import { validationResult } from "express-validator";

/**
 * Runs after express-validator rules.
 *
 * If validation fails, returns a standard validation response.
 * Otherwise, passes control to the next middleware/controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    success: false,
    error: {
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      details: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    },
  });
};

export default validate;
