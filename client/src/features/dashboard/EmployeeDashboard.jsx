import { dashboardApi } from "../../api/dashboardApi";
import { useApi } from "../../hooks/useApi";
import { PageLoader } from "../../components/ui/PageLoader";
import { ErrorState } from "../../components/ui/ErrorState";
import { StatCard } from "../../components/ui/StatCard";
import { getErrorMessage } from "../../utils/errorMessages";
import { DashboardSection } from "./components/DashboardSection";
import { VisitRequestList } from "./components/VisitRequestList";

export function EmployeeDashboard() {
  const { data, loading, error, refetch } = useApi(
    () => dashboardApi.employee(),
    [],
  );

  if (loading) return <PageLoader />;
  if (error)
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  const {
    pendingRequestsCount,
    pendingRequests = [],
    approvedUpcoming = [],
  } = data ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Employee Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your visitor requests at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Pending Requests"
          value={pendingRequestsCount ?? pendingRequests.length}
        />
        <StatCard label="Approved Upcoming" value={approvedUpcoming.length} />
      </div>

      <DashboardSection title="Pending Requests">
        <VisitRequestList
          requests={pendingRequests}
          emptyTitle="No pending requests"
          emptyDescription="Visitor requests awaiting your approval will appear here."
        />
      </DashboardSection>

      <DashboardSection title="Approved Upcoming">
        <VisitRequestList
          requests={approvedUpcoming}
          emptyTitle="Nothing upcoming"
          emptyDescription="Visitors you've approved will appear here until their visit."
        />
      </DashboardSection>
    </div>
  );
}
