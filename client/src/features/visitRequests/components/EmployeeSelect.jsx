import { employeesApi } from "../../../api/employeesApi";
import { useApi } from "../../../hooks/useApi";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { getErrorMessage } from "../../../utils/errorMessages";

export function EmployeeSelect({ value, onChange, error }) {
  const {
    data: employees,
    loading,
    error: fetchError,
    refetch,
  } = useApi(() => employeesApi.list(), []);

  if (fetchError) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">
          Employee to Visit
        </span>
        <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-sm text-red-700">{getErrorMessage(fetchError)}</p>
          <Button type="button" variant="secondary" onClick={refetch}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const employeeList = employees ?? [];

  return (
    <Select
      id="employeeId"
      label="Employee to Visit"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      disabled={loading}
    >
      <option value="">
        {loading
          ? "Loading employees…"
          : employeeList.length === 0
            ? "No active employees found"
            : "Select an employee"}
      </option>
      {employeeList.map((employee) => (
        <option
          key={employee._id ?? employee.id}
          value={employee._id ?? employee.id}
        >
          {employee.name}
          {employee.department ? ` — ${employee.department}` : ""}
        </option>
      ))}
    </Select>
  );
}
