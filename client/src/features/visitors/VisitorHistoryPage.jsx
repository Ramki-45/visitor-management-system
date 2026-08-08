import { Link, useParams } from "react-router-dom";
import { visitorsApi } from "../../api/visitorsApi";
import { useApi } from "../../hooks/useApi";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../utils/errorMessages";
import { VisitRequestListRow } from "../visitRequests/components/VisitRequestListRow";

export function VisitorHistoryPage() {
  const { id } = useParams();

  const {
    data: history,
    loading,
    error,
    refetch,
  } = useApi(() => visitorsApi.history(id), [id]);

  if (loading) return <LoadingScreen />;
  if (error)
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  const requests = history ?? [];
  // The visitor's own record isn't returned by this endpoint — only their
  // requests — so we derive a display name from the first entry.
  const visitorName = requests[0]?.visitor?.name ?? "Visitor";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          to="/visitors"
          className="text-sm text-accent-600 hover:underline"
        >
          ← Back to Visitors
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">{visitorName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Visit history, most recent first.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        {requests.length === 0 ? (
          <EmptyState
            title="No visit history"
            description="This visitor has no recorded visits yet."
          />
        ) : (
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
