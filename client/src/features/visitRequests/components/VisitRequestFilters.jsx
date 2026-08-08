import { useAuth } from "../../../auth/AuthContext";
import { ROLES, VISIT_STATUS } from "../../../utils/constants";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { EmployeeFilterSelect } from "./EmployeeFilterSelect";

const STATUS_OPTIONS = Object.values(VISIT_STATUS);

export function VisitRequestFilters({ filters, onChange }) {
  const { user } = useAuth();
  const showEmployeeFilter = user.role !== ROLES.EMPLOYEE;

  const setFilter = (key) => (value) => onChange({ ...filters, [key]: value });

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <Input
        id="filterVisitorName"
        label="Visitor Name"
        placeholder="Search by name"
        value={filters.visitorName}
        onChange={(e) => setFilter("visitorName")(e.target.value)}
      />

      {showEmployeeFilter && (
        <EmployeeFilterSelect
          value={filters.employeeId}
          onChange={setFilter("employeeId")}
        />
      )}

      <Input
        id="filterVisitDate"
        label="Visit Date"
        type="date"
        value={filters.visitDate}
        onChange={(e) => setFilter("visitDate")(e.target.value)}
      />

      <Select
        id="filterStatus"
        label="Status"
        value={filters.status}
        onChange={(e) => setFilter("status")(e.target.value)}
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </Select>
    </div>
  );
}
