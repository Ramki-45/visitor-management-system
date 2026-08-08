export function Select({
  label,
  id,
  error,
  children,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rounded-md border bg-white px-3 py-2 text-sm text-slate-900
          focus:border-accent-500 disabled:bg-slate-50 disabled:text-slate-400
          ${error ? "border-red-400" : "border-slate-300"} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
