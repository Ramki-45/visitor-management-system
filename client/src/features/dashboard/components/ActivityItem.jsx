import { formatDateTime } from "../../../utils/dateHelpers";

// Matches the activity actions described in the requirements: Created,
// Approved, Rejected, Checked In, Checked Out, Cancelled.
const ACTION_LABELS = {
  CREATED: "Request created",
  APPROVED: "Request approved",
  REJECTED: "Request rejected",
  CHECKED_IN: "Visitor checked in",
  CHECKED_OUT: "Visitor checked out",
  CANCELLED: "Request cancelled",
};

export function ActivityItem({ activity }) {
  const label = ACTION_LABELS[activity.action] ?? activity.action ?? "Activity";

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">{label}</p>
        <p className="truncate text-xs text-slate-400">
          {activity.performedBy?.name ?? "System"} ·{" "}
          {formatDateTime(activity.timestamp)}
        </p>
      </div>
    </li>
  );
}
