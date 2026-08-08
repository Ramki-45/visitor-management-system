import ActivityLog from "../models/ActivityLog.js";

/**
 * Writes one append-only log entry.
 * Never updates, never deletes.
 */
export const logActivity = async ({
  visitRequestId,
  action,
  performedBy,
  remarks = "",
}) => {
  return ActivityLog.create({
    visitRequestId,
    action,
    performedBy,
    remarks,
  });
};

/**
 * Returns the full activity history for a visit request,
 * oldest first so it reads like a timeline.
 */
export const getActivityForRequest = async (visitRequestId) => {
  return ActivityLog.find({ visitRequestId })
    .populate("performedBy", "name role")
    .sort({ timestamp: 1 });
};
