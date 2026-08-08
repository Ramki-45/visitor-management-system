import { Link } from "react-router-dom";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { formatDate } from "../../../utils/dateHelpers";

export function VisitRequestListItem({ request }) {
  return (
    <Link
      to={`/visit-requests/${request._id ?? request.id}`}
      className="flex flex-col gap-2 rounded-md p-3 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-medium text-slate-900">
          {request.visitorId?.name ?? "Unknown visitor"}
        </p>

        <p className="text-sm text-slate-500">
          {request.employeeId?.name && `Visiting ${request.employeeId.name}`}

          {request.purpose && ` · ${request.purpose}`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-500">
          {formatDate(request.visitDate)}

          {request.expectedArrivalTime && ` · ${request.expectedArrivalTime}`}
        </p>

        <StatusBadge status={request.status} />
      </div>
    </Link>
  );
}
