import { useState } from "react";
import { visitRequestsApi } from "../../api/visitRequestsApi";
import { useApi } from "../../hooks/useApi";
import { useDebounce } from "../../hooks/useDebounce";
import { PageLoader } from "../../components/ui/PageLoader";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../utils/errorMessages";
import { VisitRequestFilters } from "./components/VisitRequestFilters";
import { VisitRequestListRow } from "./components/VisitRequestListRow";

const INITIAL_FILTERS = {
  visitorName: "",
  employeeId: "",
  visitDate: "",
  status: "",
};

export function VisitRequestListPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const debouncedVisitorName = useDebounce(filters.visitorName, 400);

  const activeParams = {
    visitorName: debouncedVisitorName,
    employeeId: filters.employeeId,
    visitDate: filters.visitDate,
    status: filters.status,
  };

  const {
    data: requests,
    loading,
    error,
    refetch,
  } = useApi(
    () => visitRequestsApi.list(activeParams),
    [
      debouncedVisitorName,
      filters.employeeId,
      filters.visitDate,
      filters.status,
    ],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Visit Requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search and track visitor requests through their workflow.
        </p>
      </div>

      <VisitRequestFilters filters={filters} onChange={setFilters} />

      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        {loading && <PageLoader />}

        {!loading && error && (
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        )}

        {!loading && !error && (!requests || requests.length === 0) && (
          <EmptyState
            title="No visit requests found"
            description="Try adjusting your filters, or check back once new visitors are registered."
          />
        )}

        {!loading && !error && requests && requests.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {requests.map((request) => (
              <li key={request._id ?? request.id}>
                <VisitRequestListRow request={request} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
