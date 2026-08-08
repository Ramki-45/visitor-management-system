import express from "express";

import * as visitorController from "../controllers/visitorController.js";

import { visitorSearchValidator } from "../validators/visitorValidator.js";

import validate from "../middleware/validate.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/rbac.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

// All visitor routes require authentication.
router.use(authenticate);

// Search visitors
router.get(
  "/",
  authorize([ROLES.RECEPTIONIST, ROLES.ADMIN]),
  visitorSearchValidator,
  validate,
  visitorController.search,
);

// Get visitor history
router.get(
  "/:id/history",
  authorize([ROLES.RECEPTIONIST, ROLES.ADMIN]),
  visitorController.getHistory,
);

export default router;
