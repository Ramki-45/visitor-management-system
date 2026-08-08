import { useAuth } from "../../auth/AuthContext";

// TEMPORARY — Step 1 only proves the authenticated route/shell chain works.
// This file is fully replaced in Step 2 by role-specific dashboards
// (AdminDashboard / ReceptionistDashboard / EmployeeDashboard) wired to
// GET /dashboard/{role}.
export function DashboardPlaceholder() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Welcome, {user.name}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Signed in as {user.role}. Role-specific dashboard content lands in Step
        2.
      </p>
    </div>
  );
}
