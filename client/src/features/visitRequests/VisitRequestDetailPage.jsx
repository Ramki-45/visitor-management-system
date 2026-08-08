import { Link, useParams } from "react-router-dom";
import { visitRequestsApi } from "../../api/visitRequestsApi";
import { useApi } from "../../hooks/useApi";
import { PageLoader } from "../../components/ui/PageLoader";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate, formatDateTime } from "../../utils/dateHelpers";
import { ActivityItem } from "../dashboard/components/ActivityItem";
import { DetailField } from "./components/DetailField";
import { VisitRequestActions } from "./components/VisitRequestActions";

export function VisitRequestDetailPage() {
  const { id } = useParams();

  const { data, loading, error, refetch } = useApi(
    () =>
      Promise.all([
        visitRequestsApi.getById(id),
        visitRequestsApi.getActivity(id),
      ]).then(([request, activity]) => ({
        request,
        activity,
      })),
    [id],
  );

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const { request, activity = [] } = data ?? {};

  if (!request) {
    return (
      <EmptyState
        title="Visit request not found"
        description="The requested visit request could not be found."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/visit-requests"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to Visit Requests
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {request.visitorId?.name ?? "Unknown visitor"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {request.purpose || "No purpose provided"}
            </p>
          </div>

          <StatusBadge status={request.status} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailField label="Phone" value={request.visitorId?.phone || "—"} />

          <DetailField label="Email" value={request.visitorId?.email || "—"} />

          <DetailField
            label="Company"
            value={request.visitorId?.company || "—"}
          />

          <DetailField
            label="Employee to Visit"
            value={request.employeeId?.name || "—"}
          />

          <DetailField
            label="Department"
            value={request.employeeId?.department || "—"}
          />

          <DetailField
            label="Visit Date"
            value={formatDate(request.visitDate)}
          />

          <DetailField
            label="Expected Arrival"
            value={request.expectedArrivalTime || "—"}
          />

          <DetailField
            label="Checked In At"
            value={formatDateTime(request.checkInTime)}
          />

          <DetailField
            label="Checked Out At"
            value={formatDateTime(request.checkOutTime)}
          />

          {request.remarks && (
            <DetailField label="Remarks" value={request.remarks} />
          )}

          {request.cancelReason && (
            <DetailField
              label="Cancellation Reason"
              value={request.cancelReason}
            />
          )}
        </dl>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <VisitRequestActions request={request} onActionComplete={refetch} />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Activity History
        </h2>

        {activity.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Actions taken on this request will be recorded here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {activity.map((entry, index) => (
              <ActivityItem key={entry._id ?? index} activity={entry} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
