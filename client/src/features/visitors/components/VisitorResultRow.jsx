import { Link } from "react-router-dom";

export function VisitorResultRow({ visitor }) {
  const visitorId = visitor._id ?? visitor.id;

  return (
    <Link
      to={`/visitors/${visitorId}/history`}
      className="flex items-center justify-between gap-4 rounded-md p-4 transition-colors hover:bg-slate-50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          {visitor.name || "Unknown visitor"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {visitor.phone || "No phone number"}
          {visitor.company && ` · ${visitor.company}`}
        </p>
      </div>

      <span className="shrink-0 text-sm font-medium text-slate-600">
        View History →
      </span>
    </Link>
  );
}
