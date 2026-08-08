import express from "express";

import { visitorReport } from "../controllers/reportController.js";

import { visitorReportValidator } from "../validators/reportValidator.js";

import validate from "../middleware/validate.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/rbac.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

/*All report routes require authentication*/

router.use(authenticate);

/*Visitor Analytics Report*/

router.get(
  "/visitors",
  authorize([ROLES.ADMIN]),
  visitorReportValidator,
  validate,
  visitorReport,
);

export default router;
