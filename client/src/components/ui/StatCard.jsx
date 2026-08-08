export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-slate-100",
  valueColor = "text-slate-900",
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>

        <h2 className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</h2>
      </div>

      {Icon && (
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className="h-6 w-6 text-slate-700" />
        </div>
      )}
    </div>
  );
}
