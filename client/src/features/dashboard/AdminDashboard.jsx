import { dashboardApi } from "../../api/dashboardApi";
import { useApi } from "../../hooks/useApi";
import { PageLoader } from "../../components/ui/PageLoader";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatCard } from "../../components/ui/StatCard";
import { getErrorMessage } from "../../utils/errorMessages";
import { DashboardSection } from "./components/DashboardSection";
import { ActivityItem } from "./components/ActivityItem";

import { Users, Building2, CalendarDays, Clock } from "lucide-react";

export function AdminDashboard() {
  const { data, loading, error, refetch } = useApi(
    () => dashboardApi.admin(),
    [],
  );

  if (loading) return <PageLoader />;
  if (error)
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  const {
    totalEmployees = 0,
    todaysVisitors = 0,
    visitorsCurrentlyInside = 0,
    pendingRequests = 0,
    recentActivity = [],
  } = data ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Organization-wide visitor activity at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Employees" value={totalEmployees} icon={Users} />

        <StatCard
          label="Today's Visitors"
          value={todaysVisitors}
          icon={Building2}
        />

        <StatCard
          label="Currently Inside"
          value={visitorsCurrentlyInside}
          icon={CalendarDays}
        />

        <StatCard
          label="Pending Requests"
          value={pendingRequests}
          icon={Clock}
        />
      </div>

      <DashboardSection title="Recent Activity">
        {recentActivity.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Activity will appear here as visitor requests move through the workflow."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={activity._id ?? index} activity={activity} />
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
