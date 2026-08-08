/**
 * Activity actions recorded in the ActivityLog.
 *
 * A new ActivityLog entry is created whenever a VisitRequest
 * changes state.
 *
 * Example:
 * CREATED
 *    ↓
 * APPROVED
 *    ↓
 * CHECKED_IN
 *    ↓
 * CHECKED_OUT
 */

export const ACTIVITY_ACTIONS = Object.freeze({
  CREATED: "CREATED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
});

export const ALL_ACTIVITY_ACTIONS = Object.freeze(
  Object.values(ACTIVITY_ACTIONS),
);
