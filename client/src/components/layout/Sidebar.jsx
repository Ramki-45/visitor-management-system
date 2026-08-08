import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Shield,
  UserPlus,
  ClipboardList,
  Users,
  FileBarChart,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import { NAV_ITEMS } from "../../config/navConfig";

const ICONS = {
  Dashboard: LayoutDashboard,
  "Register Visitor": UserPlus,
  "Visit Requests": ClipboardList,
  Visitors: Users,
  Reports: FileBarChart,
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <Shield size={26} className="text-white" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-white">Visitor Pass</h1>

            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="border-b border-slate-800 px-6 py-5">
        <h3 className="font-medium text-white">{user?.name || "User"}</h3>

        <p className="mt-1 text-sm capitalize text-slate-400">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {items.map((item) => {
          const Icon = ICONS[item.label];

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {Icon && <Icon size={20} />}

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-slate-900 p-2 text-white shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-900 shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation"
          >
            <X size={24} />
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}
