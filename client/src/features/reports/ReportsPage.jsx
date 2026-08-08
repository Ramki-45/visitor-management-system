import { useState } from "react";
import { reportsApi } from "../../api/reportsApi";
import { useApi } from "../../hooks/useApi";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Input } from "../../components/ui/Input";
import { getErrorMessage } from "../../utils/errorMessages";
import { formatDate, getTodayDateString } from "../../utils/dateHelpers";
import { DashboardSection } from "../dashboard/components/DashboardSection";
import { RangeSelector } from "./components/RangeSelector";
import { BreakdownList } from "./components/BreakdownList";

export function ReportsPage() {
  const [range, setRange] = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const isCustomReady = range !== "custom" || (customFrom && customTo);
  const activeParams =
    range === "custom" ? { range, from: customFrom, to: customTo } : { range };

  const { data, loading, error, refetch } = useApi(
    () =>
      isCustomReady
        ? reportsApi.getVisitorReport(activeParams)
        : Promise.resolve(null),
    [range, customFrom, customTo],
  );

  const handleRangeChange = (nextRange) => {
    setRange(nextRange);
    if (nextRange !== "custom") {
      setCustomFrom("");
      setCustomTo("");
    }
  };

  const byStatusItems = (data?.byStatus ?? []).map((entry) => ({
    key: entry.status,
    label: <StatusBadge status={entry.status} />,
    count: entry.count,
  }));

  const byDepartmentItems = (data?.byDepartment ?? []).map((entry) => ({
    key: entry.department,
    label: entry.department,
    count: entry.count,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Visitor Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Summary statistics for visits across a selected date range.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <RangeSelector value={range} onChange={handleRangeChange} />

        {range === "custom" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="customFrom"
              label="From"
              type="date"
              max={customTo || getTodayDateString()}
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
            <Input
              id="customTo"
              label="To"
              type="date"
              min={customFrom}
              max={getTodayDateString()}
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>
        )}
      </div>

      {!isCustomReady && (
        <EmptyState
          title="Select a date range"
          description="Choose both a from and to date to generate the report."
        />
      )}

      {isCustomReady && loading && <LoadingScreen />}

      {isCustomReady && !loading && error && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {isCustomReady && !loading && !error && data && (
        <>
          <p className="text-sm text-slate-500">
            {formatDate(data.range?.start)} – {formatDate(data.range?.end)}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Total Visits" value={data.totalVisits ?? 0} />
            <StatCard
              label="Average Visit Duration"
              value={
                data.averageVisitDurationMinutes == null
                  ? "No data"
                  : `${data.averageVisitDurationMinutes} min`
              }
              hint={
                data.averageVisitDurationMinutes == null
                  ? "No visits in this range have both a check-in and check-out"
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardSection title="By Status">
              <BreakdownList
                items={byStatusItems}
                emptyText="No visits in this range"
              />
            </DashboardSection>

            <DashboardSection title="By Department">
              <BreakdownList
                items={byDepartmentItems}
                emptyText="No department data"
              />
            </DashboardSection>
          </div>
        </>
      )}
    </div>
  );
}
