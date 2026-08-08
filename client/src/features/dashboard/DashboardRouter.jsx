import { useAuth } from "../../auth/AuthContext";
import { ROLES } from "../../utils/constants";
import { AdminDashboard } from "./AdminDashboard";
import { ReceptionistDashboard } from "./ReceptionistDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";

export function DashboardRouter() {
  const { user } = useAuth();

  switch (user.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.RECEPTIONIST:
      return <ReceptionistDashboard />;
    case ROLES.EMPLOYEE:
      return <EmployeeDashboard />;
    default:
      // Backend only issues these three roles; this guards against an
      // unexpected value rather than silently rendering nothing.
      return (
        <p className="text-sm text-slate-500">
          No dashboard is configured for your role. Contact an administrator.
        </p>
      );
  }
}
