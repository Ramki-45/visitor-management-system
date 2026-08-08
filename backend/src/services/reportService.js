import VisitRequest from "../models/VisitRequest.js";

import AppError from "../utils/AppError.js";
import { startOfToday } from "../utils/dateHelpers.js";

/**
 * Resolves the requested report date range.
 *
 * Supported ranges:
 * - today
 * - week (rolling last 7 days)
 * - custom
 */
const resolveDateRange = ({ range = "today", from, to }) => {
  const startToday = startOfToday();

  if (range === "today") {
    const end = new Date(startToday);
    end.setDate(end.getDate() + 1);

    return {
      start: startToday,
      end,
    };
  }

  if (range === "week") {
    const start = new Date(startToday);
    start.setDate(start.getDate() - 6);

    const end = new Date(startToday);
    end.setDate(end.getDate() + 1);

    return {
      start,
      end,
    };
  }

  // Custom range
  const start = new Date(from);
  const end = new Date(to);

  end.setDate(end.getDate() + 1);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError("Invalid custom date range.", 422, "INVALID_DATE_RANGE");
  }

  if (start > end) {
    throw new AppError(
      '"from" must be before "to".',
      422,
      "INVALID_DATE_RANGE",
    );
  }

  return {
    start,
    end,
  };
};

/**
 * Visitor analytics report.
 */
export const getVisitorReport = async (query) => {
  const { start, end } = resolveDateRange(query);

  const matchStage = {
    visitDate: {
      $gte: start,
      $lt: end,
    },
  };

  const [result] = await VisitRequest.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        totalVisits: [
          {
            $count: "count",
          },
        ],

        byStatus: [
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ],

        byDepartment: [
          {
            $lookup: {
              from: "employees",
              localField: "employeeId",
              foreignField: "_id",
              as: "employee",
            },
          },
          {
            $unwind: "$employee",
          },
          {
            $group: {
              _id: "$employee.department",
              count: {
                $sum: 1,
              },
            },
          },
        ],

        avgDuration: [
          {
            $match: {
              checkInTime: {
                $ne: null,
              },
              checkOutTime: {
                $ne: null,
              },
            },
          },
          {
            $project: {
              durationMinutes: {
                $divide: [
                  {
                    $subtract: ["$checkOutTime", "$checkInTime"],
                  },
                  60000,
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgDurationMinutes: {
                $avg: "$durationMinutes",
              },
            },
          },
        ],
      },
    },
  ]);

  return {
    range: {
      start,
      end,
    },

    totalVisits: result.totalVisits[0]?.count ?? 0,

    byStatus: result.byStatus.map((item) => ({
      status: item._id,
      count: item.count,
    })),

    byDepartment: result.byDepartment.map((item) => ({
      department: item._id,
      count: item.count,
    })),

    averageVisitDurationMinutes:
      result.avgDuration.length > 0
        ? Math.round(result.avgDuration[0].avgDurationMinutes)
        : null,
  };
};
