import VisitRequest from "../models/VisitRequest.js";
import Employee from "../models/Employee.js";
import Visitor from "../models/Visitor.js";

import * as visitorService from "./visitorService.js";
import * as activityLogService from "./activityLogService.js";

import AppError from "../utils/AppError.js";

import { VISIT_STATUS, ACTIVE_STATUSES } from "../constants/visitStatus.js";

import { ACTIVITY_ACTIONS } from "../constants/activityActions.js";
import { BUSINESS_RULES } from "../constants/businessRules.js";

import {
  startOfToday,
  isSameDateAsToday,
  timeStringToMinutes,
  currentMinutesOfDay,
} from "../utils/dateHelpers.js";

import { ROLES } from "../constants/roles.js";

/**
 * Returns the MongoDB filter used to identify
 * active visit requests.
 *
 * Rule 1:
 * A visitor cannot have more than one active visit.
 *
 * Active means:
 * - Status is PENDING / APPROVED / CHECKED_IN
 * - Visit date is today or later
 */
const activeStatusAndDateFilter = () => ({
  status: {
    $in: ACTIVE_STATUSES,
  },
  visitDate: {
    $gte: startOfToday(),
  },
});

// CREATE — Rules 1, 2, 3, 4, 5

const createVisitRequest = async (payload, actingUser) => {
  const {
    visitor: visitorInput,
    employeeId,
    purpose,
    visitDate,
    expectedArrivalTime,
  } = payload;

  const parsedVisitDate = new Date(visitDate);
  const today = startOfToday();

  // Rule 3
  // Visit date cannot be earlier than today.
  if (parsedVisitDate < today) {
    throw new AppError(
      "Visit date cannot be earlier than today",
      422,
      "RULE_3_PAST_DATE",
    );
  }

  // Rule 4
  // If the visit is today, arrival time cannot be in the past.
  if (
    isSameDateAsToday(parsedVisitDate) &&
    timeStringToMinutes(expectedArrivalTime) < currentMinutesOfDay()
  ) {
    throw new AppError(
      "Expected arrival time cannot be earlier than the current time",
      422,
      "RULE_4_PAST_TIME",
    );
  }

  // Ensure the selected employee exists and is active.
  const employee = await Employee.findById(employeeId);

  if (!employee || !employee.isActive) {
    throw new AppError(
      "Selected employee is not available",
      422,
      "EMPLOYEE_NOT_FOUND",
    );
  }

  // Rule 5
  // An employee cannot have more than the allowed
  // number of pending visit requests.
  const pendingCount = await VisitRequest.countDocuments({
    employeeId,
    status: VISIT_STATUS.PENDING,
  });

  if (pendingCount >= BUSINESS_RULES.MAX_PENDING_REQUESTS_PER_EMPLOYEE) {
    throw new AppError(
      `This employee already has ${BUSINESS_RULES.MAX_PENDING_REQUESTS_PER_EMPLOYEE} pending requests awaiting approval`,
      422,
      "RULE_5_PENDING_LIMIT",
    );
  }

  // Find an existing visitor by phone or create a new one.
  const visitor = await visitorService.findOrCreateVisitor(visitorInput);

  // Rule 1
  // A visitor cannot have more than one active visit.
  const existingActive = await VisitRequest.findOne({
    visitorId: visitor._id,
    ...activeStatusAndDateFilter(),
  });

  if (existingActive) {
    throw new AppError(
      "This visitor already has an active visit request",
      422,
      "RULE_1_ACTIVE_VISIT_EXISTS",
    );
  }

  // Rule 2
  // Prevent duplicate registrations for the same visitor
  // on the same visit date.
  const sameDayDuplicate = await VisitRequest.findOne({
    visitorId: visitor._id,
    visitDate: parsedVisitDate,
    status: {
      $in: ACTIVE_STATUSES,
    },
  });

  if (sameDayDuplicate) {
    throw new AppError(
      "This visitor already has a request for this date",
      422,
      "RULE_2_DUPLICATE_SAME_DAY",
    );
  }

  let visitRequest;

  try {
    visitRequest = await VisitRequest.create({
      visitorId: visitor._id,
      employeeId,
      purpose,
      visitDate: parsedVisitDate,
      expectedArrivalTime,
      status: VISIT_STATUS.PENDING,
      createdBy: actingUser.id,
    });
  } catch (error) {
    // Handle duplicate-key errors caused by concurrent requests.
    if (error.code === 11000) {
      throw new AppError(
        "This visitor already has a request for this date",
        422,
        "RULE_2_DUPLICATE_SAME_DAY",
      );
    }

    throw error;
  }

  // Record the creation in the audit log.
  await activityLogService.logActivity({
    visitRequestId: visitRequest._id,
    action: ACTIVITY_ACTIONS.CREATED,
    performedBy: actingUser.id,
  });

  return visitRequest;
};

// READ — List / Detail / Role Scoping

const buildListFilter = async (query, actingUser) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.employeeId) {
    filter.employeeId = query.employeeId;
  }

  if (query.visitDate) {
    filter.visitDate = new Date(query.visitDate);
  }

  if (query.dateFrom || query.dateTo) {
    filter.visitDate = {};

    if (query.dateFrom) {
      filter.visitDate.$gte = new Date(query.dateFrom);
    }

    if (query.dateTo) {
      filter.visitDate.$lte = new Date(query.dateTo);
    }
  }

  // Employees can only view their own visit requests.
  if (actingUser.role === ROLES.EMPLOYEE) {
    filter.employeeId = actingUser.employeeId;
  }

  // Search visitor by name.
  if (query.visitorName) {
    const visitors = await Visitor.find({
      name: new RegExp(query.visitorName, "i"),
    }).select("_id");

    filter.visitorId = {
      $in: visitors.map((visitor) => visitor._id),
    };
  }

  return filter;
};

const listVisitRequests = async (query, actingUser) => {
  const filter = await buildListFilter(query, actingUser);

  return VisitRequest.find(filter)
    .populate("visitorId", "name phone company")
    .populate("employeeId", "name department")
    .sort({
      createdAt: -1,
    });
};

const getVisitRequestById = async (id, actingUser) => {
  const visitRequest = await VisitRequest.findById(id)
    .populate("visitorId")
    .populate("employeeId", "name department");

  if (!visitRequest) {
    throw new AppError("Visit request not found", 404, "NOT_FOUND");
  }

  // Employees may only access their own requests.
  if (
    actingUser.role === ROLES.EMPLOYEE &&
    visitRequest.employeeId._id.toString() !== actingUser.employeeId
  ) {
    throw new AppError(
      "You do not have access to this visit request",
      403,
      "FORBIDDEN",
    );
  }

  return visitRequest;
};

/**
 * Fetch a visit request by ID.
 * Throws a 404 error if the request does not exist.
 */
const findRequestOr404 = async (id) => {
  const visitRequest = await VisitRequest.findById(id);

  if (!visitRequest) {
    throw new AppError("Visit request not found", 404, "NOT_FOUND");
  }

  return visitRequest;
};

/**
 * Ensures that only the assigned employee
 * can approve or reject this request.
 */
const assertAssignedEmployee = (visitRequest, actingUser) => {
  if (visitRequest.employeeId.toString() !== actingUser.employeeId) {
    throw new AppError(
      "Only the assigned employee can perform this action",
      403,
      "FORBIDDEN",
    );
  }
};

// APPROVE — PENDING → APPROVED

const approveVisitRequest = async (id, actingUser) => {
  const visitRequest = await findRequestOr404(id);

  assertAssignedEmployee(visitRequest, actingUser);

  if (visitRequest.status !== VISIT_STATUS.PENDING) {
    throw new AppError(
      `Cannot approve a request in ${visitRequest.status} status`,
      422,
      "INVALID_TRANSITION",
    );
  }

  visitRequest.status = VISIT_STATUS.APPROVED;
  visitRequest.approvedBy = actingUser.id;
  visitRequest.approvedAt = new Date();

  await visitRequest.save();

  await activityLogService.logActivity({
    visitRequestId: visitRequest._id,
    action: ACTIVITY_ACTIONS.APPROVED,
    performedBy: actingUser.id,
  });

  return visitRequest;
};

// REJECT — PENDING → REJECTED

const rejectVisitRequest = async (id, actingUser, { remarks = "" } = {}) => {
  const visitRequest = await findRequestOr404(id);

  assertAssignedEmployee(visitRequest, actingUser);

  if (visitRequest.status !== VISIT_STATUS.PENDING) {
    throw new AppError(
      `Cannot reject a request in ${visitRequest.status} status`,
      422,
      "INVALID_TRANSITION",
    );
  }

  visitRequest.status = VISIT_STATUS.REJECTED;
  visitRequest.rejectedBy = actingUser.id;
  visitRequest.rejectedAt = new Date();
  visitRequest.remarks = remarks;

  await visitRequest.save();

  await activityLogService.logActivity({
    visitRequestId: visitRequest._id,
    action: ACTIVITY_ACTIONS.REJECTED,
    performedBy: actingUser.id,
    remarks,
  });

  return visitRequest;
};

// CHECK-IN — APPROVED → CHECKED_IN
// Rules 6 & 7

const checkInVisitRequest = async (id, actingUser) => {
  /*
   * Rule 6:
   * Only APPROVED requests can be checked in.
   *
   * Rule 7:
   * Prevent duplicate check-ins by using an
   * atomic findOneAndUpdate().
   */
  const visitRequest = await VisitRequest.findOneAndUpdate(
    {
      _id: id,
      status: VISIT_STATUS.APPROVED,
    },
    {
      $set: {
        status: VISIT_STATUS.CHECKED_IN,
        checkInTime: new Date(),
        checkedInBy: actingUser.id,
      },
    },
    {
      new: true,
    },
  );

  if (!visitRequest) {
    const exists = await VisitRequest.exists({ _id: id });

    if (!exists) {
      throw new AppError("Visit request not found", 404, "NOT_FOUND");
    }

    throw new AppError(
      "Only approved requests can be checked in",
      422,
      "RULE_6_7_INVALID_CHECKIN",
    );
  }

  await activityLogService.logActivity({
    visitRequestId: visitRequest._id,
    action: ACTIVITY_ACTIONS.CHECKED_IN,
    performedBy: actingUser.id,
  });

  return visitRequest;
};

// CHECK-OUT — CHECKED_IN → CHECKED_OUT
// Rule 8

const checkOutVisitRequest = async (id, actingUser) => {
  const checkOutTime = new Date();

  const visitRequest = await VisitRequest.findOneAndUpdate(
    {
      _id: id,
      status: VISIT_STATUS.CHECKED_IN,
    },
    {
      $set: {
        status: VISIT_STATUS.CHECKED_OUT,
        checkOutTime,
        checkedOutBy: actingUser.id,
      },
    },
    {
      new: true,
    },
  );

  if (!visitRequest) {
    const exists = await VisitRequest.exists({ _id: id });

    if (!exists) {
      throw new AppError("Visit request not found", 404, "NOT_FOUND");
    }

    throw new AppError(
      "Only checked-in visitors can be checked out",
      422,
      "INVALID_TRANSITION",
    );
  }

  // Rule 8
  // Check-out time must always be after check-in time.
  if (visitRequest.checkInTime && checkOutTime <= visitRequest.checkInTime) {
    throw new AppError(
      "Check-out time must be later than check-in time",
      422,
      "RULE_8_INVALID_TIME",
    );
  }

  await activityLogService.logActivity({
    visitRequestId: visitRequest._id,
    action: ACTIVITY_ACTIONS.CHECKED_OUT,
    performedBy: actingUser.id,
  });

  return visitRequest;
};

// CANCEL — PENDING / APPROVED → CANCELLED
// Rule 10

const cancelVisitRequest = async (
  id,
  actingUser,
  { cancelReason = "" } = {},
) => {
  const visitRequest = await findRequestOr404(id);

  if (
    ![VISIT_STATUS.PENDING, VISIT_STATUS.APPROVED].includes(visitRequest.status)
  ) {
    throw new AppError(
      `Cannot cancel a request in ${visitRequest.status} status`,
      422,
      "INVALID_TRANSITION",
    );
  }

  visitRequest.status = VISIT_STATUS.CANCELLED;
  visitRequest.cancelledBy = actingUser.id;
  visitRequest.cancelledAt = new Date();
  visitRequest.cancelReason = cancelReason;

  await visitRequest.save();

  await activityLogService.logActivity({
    visitRequestId: visitRequest._id,
    action: ACTIVITY_ACTIONS.CANCELLED,
    performedBy: actingUser.id,
    remarks: cancelReason,
  });

  return visitRequest;
};

export {
  createVisitRequest,
  listVisitRequests,
  getVisitRequestById,
  approveVisitRequest,
  rejectVisitRequest,
  checkInVisitRequest,
  checkOutVisitRequest,
  cancelVisitRequest,
  activeStatusAndDateFilter,
};
