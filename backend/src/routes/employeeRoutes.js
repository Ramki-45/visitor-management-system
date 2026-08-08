import express from "express";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/rbac.js";

import { ROLES } from "../constants/roles.js";

import { getEmployees } from "../controllers/employeeController.js";

const router = express.Router();

router.use(authenticate);

/**
 * Get all active employees.
 *
 * Used to populate the employee dropdown
 * during visitor registration.
 */
router.get("/", authorize([ROLES.ADMIN, ROLES.RECEPTIONIST]), getEmployees);

export default router;
