import express from "express";

import {
  adminDashboard,
  receptionistDashboard,
  employeeDashboard,
} from "../controllers/dashboardController.js";

import authenticate from "../middleware/auth.js";
import authorize from "../middleware/rbac.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

/*All dashboard routes require authentication*/

router.use(authenticate);

/*Admin Dashboard*/

router.get("/admin", authorize([ROLES.ADMIN]), adminDashboard);

/*Receptionist Dashboard*/

router.get(
  "/receptionist",
  authorize([ROLES.RECEPTIONIST]),
  receptionistDashboard,
);

/*Employee Dashboard*/

router.get("/employee", authorize([ROLES.EMPLOYEE]), employeeDashboard);

export default router;
