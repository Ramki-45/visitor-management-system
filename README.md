# Visitor Management System

A full-stack Visitor Pass Management System built on the MERN stack. The system lets front-desk staff register visitors, routes each visit request to the relevant employee for approval, and tracks the visitor through check-in and check-out — with a complete, auditable activity trail at every step.

## What Problem It Solves

Manual visitor logbooks make it hard to know who is on-site, who approved a visit, or when someone actually checked in or out. This system replaces that with a structured workflow: every visitor request has an owner (the employee being visited), a defined lifecycle (pending → approved/rejected → checked in → checked out), and a recorded history of who did what and when.

## Main Objectives

- Give each role (Admin, Receptionist, Employee) exactly the tools their job requires, and nothing more.
- Enforce visit-related business rules consistently and centrally, rather than relying on manual checks.
- Keep a reliable, timestamped activity record for every visit request, from creation to close.
- Provide a clean, responsive interface usable on a front-desk workstation or a tablet.

---

## Features

The following are implemented and working end-to-end against the live backend API.

- **Authentication** — email/password login, session persistence, and automatic sign-out on an expired or invalid session.
- **Role-based access control** — every route and every navigation item is filtered by the logged-in user's role, both in the UI and by the backend's own authorization checks.
- **Role-aware dashboards** — Admin, Receptionist, and Employee each see a dashboard populated from their own dedicated backend endpoint, with different summary statistics for each role.
- **Visitor registration** — Receptionist registers a visitor against a specific employee, purpose, date, and expected arrival time.
- **Visit request management** — a filterable list (by visitor name, employee, visit date, status) and a detail view showing the full record plus its activity trail.
- **Approve / Reject** — Employee actions on requests assigned to them, with an optional remark on rejection.
- **Check-in / Check-out** — Receptionist actions, gated by the request's current status.
- **Cancel visit request** — available to Receptionist and Admin, with an optional cancellation reason.
- **Visitor search** — search by name or phone (Admin, Receptionist).
- **Visitor history** — full visit history for a single visitor, most recent first.
- **Visitor reports** — summary statistics (total visits, status breakdown, department breakdown, average visit duration) over Today / This Week / a custom date range (Admin only).
- **Activity/audit history** — every visit request exposes its own activity log (created, approved, rejected, checked in, checked out, cancelled), each entry attributed to the user who performed it and timestamped.

Employee management and user account management are **explicitly out of scope** for this version. `GET /employees` (a simple active-employee list, used to populate the employee picker on visitor registration) is the only employee-related endpoint implemented; there is no employee or user CRUD.

---

## Role-Based Access

| Capability | Admin | Receptionist | Employee |
|---|:---:|:---:|:---:|
| View own dashboard | Yes | Yes | Yes |
| Register a visitor | No | Yes | No |
| View visit requests | Yes (all) | Yes (all) | Yes (own only, enforced by the backend) |
| View a visit request's detail & activity | Yes | Yes | Own only |
| Approve / reject a visit request | No | No | Yes (own only) |
| Check in a visitor | No | Yes | No |
| Check out a visitor | No | Yes | No |
| Cancel a visit request | Yes | Yes | No |
| Search visitors | Yes | Yes | No |
| View visitor history | Yes | Yes | No |
| View visitor reports | Yes | No | No |
| Manage employees | Not implemented (out of scope) | — | — |
| Manage user accounts | Not implemented (out of scope) | — | — |

This table reflects the routing and navigation configuration actually implemented in the frontend (`src/config/navConfig.js`, `src/routes/AppRoutes.jsx`), which restricts each route with a `RoleRoute` guard matching the access rules documented for each backend endpoint. The frontend's role checks are a UX convenience; the backend independently enforces the same rules (visible in its `401`/`403` responses), so a restricted action cannot be performed by calling the API directly with the wrong role either.

---

## System Workflow

```
Receptionist registers visitor  →  Employee reviews  →  Approve / Reject
                                                              │
                                                     (if approved)
                                                              ▼
                                          Receptionist checks visitor in
                                                              │
                                                              ▼
                                          Receptionist checks visitor out
                                                              │
                                                              ▼
                                              Visitor history recorded
```

- **Receptionist** owns registration and the physical check-in/check-out steps.
- **Employee** owns the approval decision for requests where they are the visit's host, and may leave a remark when rejecting.
- **Admin** does not participate in the day-to-day workflow but can view every request, cancel a request, and pull reports across the organization.
- A request can be **cancelled** by Receptionist or Admin at any point before check-in, and cancelled requests are excluded from active visitor lists.

---

## Technology Stack

### Frontend (inspected directly — `package.json`)
- **React 18** — UI library
- **Vite 5** — build tool and dev server
- **React Router 6** — client-side routing and route guards
- **Axios** — HTTP client, with a shared instance handling auth headers and 401 handling
- **Tailwind CSS 3** — utility-first styling
- **Context API** — global authentication state (`AuthContext`)
- **ESLint** — linting (React + React Hooks plugins)

### Backend, Database, Authentication
The backend was provided as a **pre-built, frozen service** — this project connects to it as a client but the backend's own source code was not made available for direct inspection. What's documented here is the API contract the frontend was built against: a REST API under `/api`, JWT bearer-token authentication (`Authorization: Bearer <token>`), and a consistent `{ success, data }` / `{ success: false, error: { message, code } }` response envelope. Per the original project brief the stack is MongoDB, Express.js, and Node.js — this is stated as the specified requirement, not something verified from backend source in this repository.

### API Communication
- REST over HTTP, JSON payloads
- Centralized Axios client (`src/api/axiosClient.js`) with a request interceptor for the bearer token and a response interceptor that clears the session on `401`
- All endpoint paths centralized in `src/api/endpoints.js` — no inline URL strings in feature code

---

## Project Architecture

Only the frontend is present in this repository. The backend is a separately hosted service consumed via the documented REST API.

```
visitor-pass-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
├── README.md
└── src/
    ├── api/
    ├── auth/
    ├── components/
    ├── config/
    ├── features/
    ├── hooks/
    ├── routes/
    ├── utils/
    ├── assets/
    ├── App.jsx
    └── main.jsx
```

## Frontend Architecture

- **`api/`** — one module per backend resource (`authApi`, `dashboardApi`, `employeesApi`, `visitRequestsApi`, `visitorsApi`, `reportsApi`), each a thin wrapper around Axios calls, plus `endpoints.js` as the single source of truth for every path and `axiosClient.js` for the shared HTTP instance.
- **`auth/`** — `AuthContext` (session state, login/logout, session validation on load), `ProtectedRoute` (requires authentication), `RoleRoute` (requires a specific role, redirects otherwise).
- **`components/`** — presentational building blocks with no business logic, split into `ui/` (Button, Input, Select, Textarea, Modal, ConfirmDialog, StatusBadge, StatCard, EmptyState, ErrorState, PageLoader, Spinner) and `layout/` (AppShell, Sidebar, Topbar). Built once and reused across every feature.
- **`config/`** — `navConfig.js`, the single list driving the sidebar; each entry declares which roles can see it, so there is one `Sidebar` component rather than a per-role variant.
- **`features/`** — one folder per business feature (`auth`, `dashboard`, `visitRequests`, `visitors`, `reports`), each containing its page(s) and a `components/` subfolder for feature-specific pieces. This is a feature-based architecture: a feature's page, its supporting components, and its API calls live together, while generic UI stays in `components/ui`.
- **`hooks/`** — `useApi` (standardized loading/error/data/refetch for any API call) and `useDebounce` (debounced search inputs), both used across multiple features.
- **`routes/`** — `AppRoutes.jsx`, the single place every route is registered, nesting `ProtectedRoute` and `RoleRoute` guards as needed.
- **`utils/`** — `constants.js` (role and status enums), `dateHelpers.js`, `errorMessages.js` (maps backend error codes to user-facing text), `visitRequestValidation.js` (client-side pre-checks for the two business rules that don't require a server round trip).

## Backend Architecture

Backend source code was not provided for this project and is not part of this repository, so no internal folder structure (controllers, services, models, middleware, etc.) can be documented here without guessing. What can be stated reliably, from the API's documented behavior, is:

- The API is organized around clear resources — auth, employees, visitors, visit requests, dashboard, reports — each under its own `/api/...` path prefix.
- Authentication is JWT-based, checked on every route except login and the health check.
- Authorization is role-based per endpoint (documented per-endpoint in the section below) and, for visit requests, additionally ownership-based for the Employee role.
- Business-rule validation (see below) happens server-side and is returned as structured `422` errors with a specific `code`, which this frontend maps to user-facing messages.

---

## API Documentation

Base URL: `{VITE_API_BASE_URL}` (e.g. `http://localhost:5000/api`). All endpoints below are the ones this frontend actually calls.

### Authentication
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/auth/login` | Log in with email and password, returns a JWT and user profile | Public |
| GET | `/auth/me` | Validate the current token and return the logged-in user | Any authenticated user |

### Dashboard
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/dashboard/admin` | Org-wide stats: total employees, today's visitors, visitors currently inside, pending requests, recent activity | Admin |
| GET | `/dashboard/receptionist` | Today's visitors, who's currently inside, upcoming scheduled visitors | Receptionist |
| GET | `/dashboard/employee` | Pending requests awaiting the employee, their upcoming approved visitors | Employee |

### Employees
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/employees` | List active employees, used to populate the employee picker on visitor registration | Admin, Receptionist |

### Visit Requests
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/visit-requests` | Register a visitor and create a visit request in `PENDING` | Receptionist |
| GET | `/visit-requests` | List visit requests, filterable by status, employee, visitor name, visit date | Admin, Receptionist, Employee (auto-scoped to their own requests) |
| GET | `/visit-requests/:id` | Full detail of one visit request | Admin, Receptionist, Employee (own only) |
| GET | `/visit-requests/:id/activity` | Activity/audit trail for one visit request | Admin, Receptionist, Employee (own only) |
| PATCH | `/visit-requests/:id/approve` | Approve a pending request | Employee (must be the assigned employee) |
| PATCH | `/visit-requests/:id/reject` | Reject a pending request, with optional remarks | Employee (must be the assigned employee) |
| PATCH | `/visit-requests/:id/check-in` | Check in an approved visitor | Receptionist |
| PATCH | `/visit-requests/:id/check-out` | Check out a checked-in visitor | Receptionist |
| PATCH | `/visit-requests/:id/cancel` | Cancel a pending or approved request, with optional reason | Receptionist, Admin |

### Visitors
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/visitors` | Search visitors by name and/or phone | Admin, Receptionist |
| GET | `/visitors/:id/history` | All visit requests for one visitor, most recent first | Admin, Receptionist |

### Reports
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/reports/visitors` | Visit statistics for a range (`today`, `week`, or `custom` with `from`/`to`): total visits, breakdown by status, breakdown by department, average visit duration | Admin |

---

## Business Rules

These are the rules documented by the API and relied upon by the frontend (client-side pre-checks exist only where noted; all rules are enforced server-side regardless):

| Rule | Description | Client-side pre-check |
|---|---|---|
| Rule 1 | A visitor cannot have more than one active visit at the same time | No — requires knowledge of the visitor's existing visits, which is only known server-side |
| Rule 2 | Duplicate visitor registrations on the same date are not allowed | No |
| Rule 3 | Visit date cannot be earlier than the current date | Yes — the date picker's minimum is today |
| Rule 4 | For today's registrations, expected arrival time cannot be earlier than the current time | Yes — the time picker's minimum updates live when today is selected |
| Rule 5 | An employee cannot have more than three pending requests awaiting approval | No — requires the employee's current pending count, not available before submit |
| Rule 6 | Visitors can only be checked in after approval | Enforced by only showing the Check In action when status is `APPROVED` |
| Rule 7 | A visitor already checked in cannot be checked in again until checked out | Enforced by the same status-gated action visibility as Rule 6 |
| Rule 8 | Check-out time must always be later than check-in time | No — timestamps are set server-side at the moment of the action |
| Rule 9 | Rejected visitor requests cannot be checked in | Enforced by only showing the Check In action when status is `APPROVED` (never `REJECTED`) |
| Rule 10 | Cancelled visits do not appear in active visitor lists | Enforced server-side in list responses |

Where a rule is violated, the API returns a specific error `code` (e.g. `RULE_1_ACTIVE_VISIT_EXISTS`, `RULE_5_PENDING_LIMIT`), which the frontend maps to a plain-language message via `src/utils/errorMessages.js`.

---

## Visit Request Status Flow

```
PENDING
   │
   ├──► APPROVED ──► CHECKED_IN ──► CHECKED_OUT
   │
   └──► REJECTED

PENDING or APPROVED ──► CANCELLED
```

This is the exact transition set the frontend enforces when deciding which action buttons to show (`src/features/visitRequests/components/VisitRequestActions.jsx`):

- Approve / Reject: only when status is `PENDING`
- Check In: only when status is `APPROVED`
- Check Out: only when status is `CHECKED_IN`
- Cancel: only when status is `PENDING` or `APPROVED`

`REJECTED`, `CHECKED_OUT`, and `CANCELLED` are terminal states with no further actions available.

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd visitor-pass-frontend

# 2. Install frontend dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then edit .env and set VITE_API_BASE_URL to your running backend

# 4. Start the frontend dev server
npm run dev
```

The backend is a separate, already-running service and is not part of this repository — start it according to its own setup instructions and ensure `VITE_API_BASE_URL` points to it.

## Environment Variables

Frontend (`.env`, based on `.env.example`):

```
VITE_API_BASE_URL=your_backend_api_base_url
```

No other environment variables are read by the frontend. Backend environment variables (e.g. a MongoDB connection string, JWT secret) are not documented here as the backend's configuration was not part of this project's scope.

## Running the Project

```bash
npm run dev       # start the Vite dev server (default: http://localhost:5173)
npm run build     # production build, output to dist/
npm run preview   # locally preview the production build
```

---

## Testing / Verification

Manual verification steps, in the order a new reviewer would naturally exercise the app:

1. **Login** — sign in with valid Admin, Receptionist, and Employee credentials; confirm an invalid password shows an inline error.
2. **Role-based dashboard** — confirm each role lands on `/` and sees its own dashboard content (the URL does not change between roles).
3. **Visitor registration** — as Receptionist, register a visitor; confirm the employee dropdown is populated from `/employees` and the form rejects a past date/time.
4. **Visit request list/detail** — confirm the list is filterable and that each role only sees what the access table above allows; open a request to see its full detail and activity trail.
5. **Approve/reject** — as Employee, approve one pending request and reject another with a remark; confirm both actions are only offered while status is `PENDING`.
6. **Check-in/check-out** — as Receptionist, check in an approved visitor, then check them out; confirm the actions disappear once no longer applicable.
7. **Cancel** — as Receptionist or Admin, cancel a pending or approved request and confirm it no longer appears in active lists.
8. **Visitor search/history** — as Admin or Receptionist, search a visitor by name or phone and open their history.
9. **Reports** — as Admin, switch between Today / This Week / Custom Range and confirm the statistics update accordingly.

---

## Error Handling and Security

- **JWT authentication** — a bearer token is attached to every request; `AuthContext` validates it against `/auth/me` on app load rather than trusting a stored token blindly.
- **Protected routes** — every route except `/login` requires an authenticated session (`ProtectedRoute`); unauthenticated visits redirect to `/login` and return afterward.
- **Role-based route protection** — routes restricted to specific roles use `RoleRoute`, which redirects an unauthorized role back to their own dashboard rather than showing a dead-end error page.
- **Centralized API error handling** — every error code documented by the API is mapped to a user-facing message in one place (`errorMessages.js`), so components never handle raw error shapes individually.
- **Unauthorized/session-expiry handling** — a `401` response anywhere in the app clears the stored session and returns the user to login via a shared Axios response interceptor.
- **Server-side business-rule validation** — all ten business rules are enforced by the backend regardless of what the frontend does; the two rules that can be usefully pre-checked client-side (visit date and arrival time) are, purely for UX, not as a substitute for server enforcement.
- **Audit/activity logging** — every visit request exposes an activity trail via `/visit-requests/:id/activity`, shown on its detail page.

---

## Responsive UI

The layout uses Tailwind's responsive utilities throughout: the sidebar collapses on narrow viewports, filter and detail grids drop from multi-column to single-column below the `sm` breakpoint, and all list/table views reflow to stacked cards on mobile widths rather than requiring horizontal scrolling.

## Design / UI

The login screen is a centered, single-card form on a neutral background. The authenticated app uses a persistent sidebar (role-filtered navigation) and top bar (current user and sign-out) around a content area built from a small set of reused card, list, badge, and form primitives — kept deliberately neutral (Tailwind's slate palette, a single accent color, Inter typeface) pending branding to be supplied separately.

---

## Future Improvements

Not implemented, and not claimed as implemented above:

- Employee and user account management (create/edit/deactivate)
- Password reset / forgot-password flow
- Email or push notifications on approval, rejection, or check-in
- Pagination for large visit request or visitor lists
- Exporting reports (CSV/PDF)
- Advanced analytics beyond the current status/department/duration breakdown
- Visitor photo or ID-proof capture
- Deployment configuration

## Project Status

The scope defined for this project — Authentication, role-based dashboards, visitor registration, full visit request lifecycle management (approve/reject/check-in/check-out/cancel), visitor search and history, reports, and activity/audit history — is **complete** and integrated against the live backend API. Employee and user account management were explicitly agreed as out of scope for this version.

---

## Interview Highlights

- **Role-based architecture end to end** — a single set of routes and components adapts to three distinct roles via one `navConfig` and one `RoleRoute` guard, rather than duplicated per-role code paths.
- **Reusable component library** — every list, form, dialog, and status indicator in the app is built from ~15 generic primitives in `components/ui/`, reused across five feature areas.
- **Centralized API and error handling** — one Axios instance, one endpoint registry, one error-code-to-message map; adding a new backend error code is a one-line change.
- **Business-rule-aware UI** — the interface actively reflects the backend's state machine (which actions are valid for a given status) rather than showing actions and letting the server reject them.
- **Activity/audit trail surfaced in the UI** — not just logged, but visible per-request to every role permitted to see it.
- **Status-based workflow modeling** — the visit request lifecycle (`PENDING → APPROVED → CHECKED_IN → CHECKED_OUT`, with `REJECTED`/`CANCELLED` branches) is modeled explicitly and drives UI behavior directly.
- **Responsive, professional UI** — built with a consistent design token set (Tailwind config) rather than ad hoc styling per page.

---

## Screenshots

Screenshots have not yet been captured for this project. Placeholders for future addition:

```
docs/screenshots/login.png
docs/screenshots/admin-dashboard.png
docs/screenshots/visitor-registration.png
docs/screenshots/visit-requests.png
docs/screenshots/visitor-history.png
docs/screenshots/reports.png
```

## Deployment

Deployment configuration is not included yet.

## License

No license has been added yet. This project is currently intended for portfolio/interview demonstration purposes.
