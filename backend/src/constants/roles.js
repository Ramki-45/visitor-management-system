/**
 * User roles used throughout the application.
 *
 * Used in:
 * - User model (enum validation)
 * - RBAC middleware
 * - Route authorization
 * - Service-layer role checks
 */

export const ROLES = Object.freeze({
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  EMPLOYEE: "employee",
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));
