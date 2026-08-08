// Every backend route this app is allowed to call lives here, and only here.
// Feature/API modules import from this file rather than writing path strings
// inline — if the backend ever changes a path, this is the one place to fix.
//
// Source of truth: provided API documentation + Postman collection.
// Employee/User CRUD are intentionally absent — out of scope for V1.

export const ENDPOINTS = {
  HEALTH: "/health",

  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },

  EMPLOYEES: {
    LIST: "/employees", // active employees only; admin + receptionist
  },

  VISITORS: {
    SEARCH: "/visitors", // ?phone=&name=
    HISTORY: (visitorId) => `/visitors/${visitorId}/history`,
  },

  VISIT_REQUESTS: {
    BASE: "/visit-requests",
    LIST: "/visit-requests", // ?status=&employeeId=&visitorName=&visitDate=&dateFrom=&dateTo=
    DETAIL: (id) => `/visit-requests/${id}`,
    ACTIVITY: (id) => `/visit-requests/${id}/activity`,
    APPROVE: (id) => `/visit-requests/${id}/approve`,
    REJECT: (id) => `/visit-requests/${id}/reject`,
    CHECK_IN: (id) => `/visit-requests/${id}/check-in`,
    CHECK_OUT: (id) => `/visit-requests/${id}/check-out`,
    CANCEL: (id) => `/visit-requests/${id}/cancel`,
  },

  DASHBOARD: {
    ADMIN: "/dashboard/admin",
    RECEPTIONIST: "/dashboard/receptionist",
    EMPLOYEE: "/dashboard/employee",
  },

  REPORTS: {
    VISITORS: "/reports/visitors", // ?range=today|week|custom&from=&to=
  },
};
