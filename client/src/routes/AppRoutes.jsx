import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { RoleRoute } from "../auth/RoleRoute";
import { AppShell } from "../components/layout/AppShell";
import { LoginPage } from "../features/auth/LoginPage";
import { DashboardRouter } from "../features/dashboard/DashboardRouter";
import { RegisterVisitorPage } from "../features/visitRequests/RegisterVisitorPage";
import { VisitRequestListPage } from "../features/visitRequests/VisitRequestListPage";
import { VisitRequestDetailPage } from "../features/visitRequests/VisitRequestDetailPage";
import { VisitorSearchPage } from "../features/visitors/VisitorSearchPage";
import { VisitorHistoryPage } from "../features/visitors/VisitorHistoryPage";
import { ReportsPage } from "../features/reports/ReportsPage";
import { ROLES } from "../utils/constants";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardRouter />} />

          <Route element={<RoleRoute allowedRoles={[ROLES.RECEPTIONIST]} />}>
            <Route
              path="/visit-requests/register"
              element={<RegisterVisitorPage />}
            />
          </Route>

          <Route path="/visit-requests" element={<VisitRequestListPage />} />
          <Route
            path="/visit-requests/:id"
            element={<VisitRequestDetailPage />}
          />

          <Route
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST]} />
            }
          >
            <Route path="/visitors" element={<VisitorSearchPage />} />
            <Route
              path="/visitors/:id/history"
              element={<VisitorHistoryPage />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
