import Employee from "../models/Employee.js";
import VisitRequest from "../models/VisitRequest.js";
import ActivityLog from "../models/ActivityLog.js";

import { VISIT_STATUS, ACTIVE_STATUSES } from "../constants/visitStatus.js";

import { startOfToday } from "../utils/dateHelpers.js";

/**
 * Statuses that count as "Today's Visitors".
 *
 * REJECTED and CANCELLED are excluded because
 * those visitors never actually entered the premises.
 */
const TODAY_VISITOR_STATUSES = [
  VISIT_STATUS.PENDING,
  VISIT_STATUS.APPROVED,
  VISIT_STATUS.CHECKED_IN,
  VISIT_STATUS.CHECKED_OUT,
];

/**
 * Returns today's date range.
 */
const todayRange = () => {
  const start = startOfToday();

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    $gte: start,
    $lt: end,
  };
};

/*Admin Dashboard*/

export const getAdminDashboard = async () => {
  const today = todayRange();

  const [
    totalEmployees,
    todaysVisitors,
    visitorsInside,
    pendingRequests,
    recentActivity,
  ] = await Promise.all([
    Employee.countDocuments({
      isActive: true,
    }),

    VisitRequest.countDocuments({
      visitDate: today,
      status: {
        $in: TODAY_VISITOR_STATUSES,
      },
    }),

    VisitRequest.countDocuments({
      visitDate: today,
      status: VISIT_STATUS.CHECKED_IN,
    }),

    VisitRequest.countDocuments({
      status: VISIT_STATUS.PENDING,
    }),

    ActivityLog.find()
      .populate("performedBy", "name role")
      .populate({
        path: "visitRequestId",
        select: "visitorId employeeId",
        populate: [
          {
            path: "visitorId",
            select: "name",
          },
          {
            path: "employeeId",
            select: "name department",
          },
        ],
      })
      .sort({
        timestamp: -1,
      })
      .limit(10)
      .lean(),
  ]);

  return {
    totalEmployees,
    todaysVisitors,
    visitorsCurrentlyInside: visitorsInside,
    pendingRequests,
    recentActivity,
  };
};

/*Receptionist Dashboard*/

export const getReceptionistDashboard = async () => {
  const today = todayRange();
  const startToday = startOfToday();

  const [todaysVisitors, visitorsInside, scheduledUpcoming] = await Promise.all(
    [
      VisitRequest.find({
        visitDate: today,
        status: {
          $in: TODAY_VISITOR_STATUSES,
        },
      })
        .populate("visitorId", "name phone company")
        .populate("employeeId", "name department")
        .sort({
          expectedArrivalTime: 1,
        })
        .lean(),

      VisitRequest.find({
        visitDate: today,
        status: VISIT_STATUS.CHECKED_IN,
      })
        .populate("visitorId", "name phone company")
        .populate("employeeId", "name department")
        .sort({
          checkInTime: 1,
        })
        .lean(),

      // Scheduled visitors after today
      VisitRequest.find({
        visitDate: {
          $gt: startToday,
        },
        status: {
          $in: ACTIVE_STATUSES,
        },
      })
        .populate("visitorId", "name phone company")
        .populate("employeeId", "name department")
        .sort({
          visitDate: 1,
        })
        .limit(20)
        .lean(),
    ],
  );

  return {
    todaysVisitorsCount: todaysVisitors.length,
    todaysVisitors,

    visitorsCurrentlyInside: visitorsInside,

    scheduledUpcoming,
  };
};

/*Employee Dashboard*/

export const getEmployeeDashboard = async (employeeId) => {
  const startToday = startOfToday();

  const [pendingRequests, approvedUpcoming] = await Promise.all([
    VisitRequest.find({
      employeeId,
      status: VISIT_STATUS.PENDING,
    })
      .populate("visitorId", "name phone company")
      .sort({
        createdAt: -1,
      })
      .lean(),

    VisitRequest.find({
      employeeId,
      status: VISIT_STATUS.APPROVED,
      visitDate: {
        $gte: startToday,
      },
    })
      .populate("visitorId", "name phone company")
      .sort({
        visitDate: 1,
      })
      .lean(),
  ]);

  return {
    pendingRequestsCount: pendingRequests.length,
    pendingRequests,

    approvedUpcoming,
  };
};
