import express from "express";

import * as visitRequestController from "../controllers/visitRequestController.js";

import {
  createVisitRequestValidator,
  visitRequestIdParamValidator,
  rejectValidator,
  cancelValidator,
  listVisitRequestsValidator,
} from "../validators/visitRequestValidator.js";

import validate from "../middleware/validate.js";
import authenticate from "../middleware/auth.js";
import authorize from "../middleware/rbac.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Every visit request endpoint requires authentication.
router.use(authenticate);

/*Create Visit*/

router.post(
  "/",
  authorize([ROLES.RECEPTIONIST]),
  createVisitRequestValidator,
  validate,
  visitRequestController.create,
);

/*Read Visit Requests*/

router.get(
  "/",
  authorize([ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.EMPLOYEE]),
  listVisitRequestsValidator,
  validate,
  visitRequestController.list,
);

router.get(
  "/:id",
  authorize([ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.EMPLOYEE]),
  visitRequestIdParamValidator,
  validate,
  visitRequestController.getById,
);

router.get(
  "/:id/activity",
  authorize([ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.EMPLOYEE]),
  visitRequestIdParamValidator,
  validate,
  visitRequestController.getActivity,
);

/*Employee Actions*/

router.patch(
  "/:id/approve",
  authorize([ROLES.EMPLOYEE]),
  visitRequestIdParamValidator,
  validate,
  visitRequestController.approve,
);

router.patch(
  "/:id/reject",
  authorize([ROLES.EMPLOYEE]),
  rejectValidator,
  validate,
  visitRequestController.reject,
);

/*Receptionist Actions*/

router.patch(
  "/:id/check-in",
  authorize([ROLES.RECEPTIONIST]),
  visitRequestIdParamValidator,
  validate,
  visitRequestController.checkIn,
);

router.patch(
  "/:id/check-out",
  authorize([ROLES.RECEPTIONIST]),
  visitRequestIdParamValidator,
  validate,
  visitRequestController.checkOut,
);

/*Cancel Visit*/

router.patch(
  "/:id/cancel",
  authorize([ROLES.RECEPTIONIST, ROLES.ADMIN]),
  cancelValidator,
  validate,
  visitRequestController.cancel,
);

export default router;
