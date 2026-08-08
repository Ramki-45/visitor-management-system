import { ROLES } from "../utils/constants";

// Each entry: { label, path, roles }. The Sidebar filters this list against
// the logged-in user's role — no per-role sidebar components.
//
// Intentionally NOT included, per product decision: Employee management,
// User account management (out of scope for V1, and per instruction, no
// placeholder nav items for out-of-scope features).
//
// Entries are added here exactly when their route is built, feature by
// feature — this file grows alongside the app, not ahead of it.
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.EMPLOYEE],
  },
  {
    label: "Register Visitor",
    path: "/visit-requests/register",
    roles: [ROLES.RECEPTIONIST],
  },
  {
    label: "Visit Requests",
    path: "/visit-requests",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.EMPLOYEE],
  },
  {
    label: "Visitors",
    path: "/visitors",
    roles: [ROLES.ADMIN, ROLES.RECEPTIONIST],
  },
  {
    label: "Reports",
    path: "/reports",
    roles: [ROLES.ADMIN],
  },
];
