import { VISIT_STATUS } from "../../utils/constants";

const STATUS_STYLES = {
  [VISIT_STATUS.PENDING]: "bg-amber-50 text-amber-700 ring-amber-600/20",
  [VISIT_STATUS.APPROVED]: "bg-blue-50 text-blue-700 ring-blue-600/20",
  [VISIT_STATUS.REJECTED]: "bg-red-50 text-red-700 ring-red-600/20",
  [VISIT_STATUS.CHECKED_IN]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  [VISIT_STATUS.CHECKED_OUT]: "bg-slate-100 text-slate-600 ring-slate-500/20",
  [VISIT_STATUS.CANCELLED]: "bg-slate-100 text-slate-400 ring-slate-400/20",
};

const STATUS_LABELS = {
  [VISIT_STATUS.PENDING]: "Pending",
  [VISIT_STATUS.APPROVED]: "Approved",
  [VISIT_STATUS.REJECTED]: "Rejected",
  [VISIT_STATUS.CHECKED_IN]: "Checked In",
  [VISIT_STATUS.CHECKED_OUT]: "Checked Out",
  [VISIT_STATUS.CANCELLED]: "Cancelled",
};

export function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 ring-slate-400/20";
  const label = STATUS_LABELS[status] ?? status ?? "Unknown";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  );
}
