import { Bell, Search } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const ROLE_LABELS = {
  admin: "Administrator",
  receptionist: "Receptionist",
  employee: "Employee",
};

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        {/* Notification */}

        <button className="relative rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
