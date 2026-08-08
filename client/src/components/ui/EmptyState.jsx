export function EmptyState({ title = "Nothing to show", description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-200 py-10 text-center">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && <p className="text-sm text-slate-400">{description}</p>}
    </div>
  );
}
