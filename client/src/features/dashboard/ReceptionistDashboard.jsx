import { dashboardApi } from "../../api/dashboardApi";
import { useApi } from "../../hooks/useApi";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { ErrorState } from "../../components/ui/ErrorState";
import { StatCard } from "../../components/ui/StatCard";
import { getErrorMessage } from "../../utils/errorMessages";
import { DashboardSection } from "./components/DashboardSection";
import { VisitRequestList } from "./components/VisitRequestList";

export function ReceptionistDashboard() {
  const { data, loading, error, refetch } = useApi(
    () => dashboardApi.receptionist(),
    [],
  );

  if (loading) return <LoadingScreen />;
  if (error)
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  const {
    todaysVisitorsCount,
    todaysVisitors = [],
    visitorsCurrentlyInside = [],
    scheduledUpcoming = [],
  } = data ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Receptionist Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Today's front-desk activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Today's Visitors"
          value={todaysVisitorsCount ?? todaysVisitors.length}
        />
        <StatCard
          label="Currently Inside"
          value={visitorsCurrentlyInside.length}
        />
        <StatCard label="Scheduled Upcoming" value={scheduledUpcoming.length} />
      </div>

      <DashboardSection title="Today's Visitors">
        <VisitRequestList
          requests={todaysVisitors}
          emptyTitle="No visitors expected today"
          emptyDescription="Registered visitors for today will appear here."
        />
      </DashboardSection>

      <DashboardSection title="Currently Inside">
        <VisitRequestList
          requests={visitorsCurrentlyInside}
          emptyTitle="No one is currently checked in"
          emptyDescription="Visitors you check in will appear here until they check out."
        />
      </DashboardSection>

      <DashboardSection title="Scheduled Upcoming">
        <VisitRequestList
          requests={scheduledUpcoming}
          emptyTitle="Nothing scheduled"
          emptyDescription="Approved visits scheduled for later will appear here."
        />
      </DashboardSection>
    </div>
  );
}
