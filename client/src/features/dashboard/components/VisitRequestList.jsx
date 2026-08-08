import { EmptyState } from "../../../components/ui/EmptyState";
import { VisitRequestListItem } from "./VisitRequestListItem";

export function VisitRequestList({ requests, emptyTitle, emptyDescription }) {
  if (!requests || requests.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {requests.map((request) => (
        <VisitRequestListItem
          key={request._id ?? request.id}
          request={request}
        />
      ))}
    </ul>
  );
}
