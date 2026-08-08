import { EmptyState } from "../../../components/ui/EmptyState";

export function BreakdownList({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <EmptyState title={emptyText} />;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => (
        <li key={item.key} className="flex items-center justify-between py-2.5">
          <div className="text-sm text-slate-700">{item.label}</div>
          <span className="text-sm font-medium text-slate-900">
            {item.count}
          </span>
        </li>
      ))}
    </ul>
  );
}
