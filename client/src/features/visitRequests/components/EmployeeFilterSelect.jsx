import { employeesApi } from "../../../api/employeesApi";
import { useApi } from "../../../hooks/useApi";
import { Select } from "../../../components/ui/Select";

export function EmployeeFilterSelect({ value, onChange }) {
  const { data: employees, loading } = useApi(() => employeesApi.list(), []);
  const employeeList = employees ?? [];

  return (
    <Select
      id="filterEmployee"
      label="Employee"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
    >
      <option value="">All employees</option>
      {employeeList.map((employee) => (
        <option
          key={employee._id ?? employee.id}
          value={employee._id ?? employee.id}
        >
          {employee.name}
        </option>
      ))}
    </Select>
  );
}
