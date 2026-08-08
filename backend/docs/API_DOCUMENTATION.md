Authentication

POST /auth/login

GET /auth/me

---

Visitors

GET /visitors

GET /visitors/:id/history

---

Visit Requests

POST /visit-requests

GET /visit-requests

GET /visit-requests/:id

PATCH /visit-requests/:id/approve

PATCH /visit-requests/:id/reject

PATCH /visit-requests/:id/check-in

PATCH /visit-requests/:id/check-out

PATCH /visit-requests/:id/cancel

GET /visit-requests/:id/activity

---

Dashboard

GET /dashboard/admin

GET /dashboard/receptionist

GET /dashboard/employee

---

Reports

GET /reports/visitors
