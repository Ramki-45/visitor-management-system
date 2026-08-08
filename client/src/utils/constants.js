// Single source of truth for values that appear across many features.
// Feature code should import from here, never hardcode these strings.

export const ROLES = Object.freeze({
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  EMPLOYEE: "employee",
});

export const VISIT_STATUS = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
});

export const AUTH_TOKEN_STORAGE_KEY = "vpms_token";
