export const VISIT_STATUS = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
});

export const ALL_VISIT_STATUSES = Object.freeze(Object.values(VISIT_STATUS));

/**
 * Active statuses used for Rule 1.
 *
 * NOTE:
 * "Active" also requires visitDate >= today.
 * The date condition is applied in the service layer because it
 * depends on the current date and cannot be represented as a constant.
 */
export const ACTIVE_STATUSES = Object.freeze([
  VISIT_STATUS.PENDING,
  VISIT_STATUS.APPROVED,
  VISIT_STATUS.CHECKED_IN,
]);

/**
 * Terminal statuses.
 * Once a VisitRequest reaches one of these states,
 * no further state transition is allowed.
 */
export const TERMINAL_STATUSES = Object.freeze([
  VISIT_STATUS.REJECTED,
  VISIT_STATUS.CHECKED_OUT,
  VISIT_STATUS.CANCELLED,
]);
