import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { LoginLeftPanel } from "./components/LoginLeftPanel";
import { LoginHeader } from "./components/LoginHeader";
import { LoginForm } from "./components/LoginForm";

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname ?? "/";

    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-white md:flex">
      {/* Left branding panel */}
      <LoginLeftPanel />

      {/* Right login area */}
      <main className="flex min-h-screen w-full items-center justify-center px-6 py-10 md:w-1/2 lg:px-16">
        <div className="w-full max-w-md">
          <LoginHeader />

          <LoginForm
            onSuccess={() => {
              const redirectTo = location.state?.from?.pathname ?? "/";
              navigate(redirectTo, { replace: true });
            }}
          />

          <p className="mt-8 text-center text-xs text-slate-400">
            Visitor Pass Management System
          </p>
        </div>
      </main>
    </div>
  );
}
