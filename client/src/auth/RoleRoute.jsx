import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Restricts a route subtree to specific roles. Must be nested inside
 * ProtectedRoute (assumes user is already authenticated).
 *
 * Usage: <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
 */
export function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    // Wrong role for this page — send them to their own dashboard rather
    // than a dead-end error page.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
