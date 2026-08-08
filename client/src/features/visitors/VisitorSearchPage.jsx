import { useState } from "react";
import { visitorsApi } from "../../api/visitorsApi";
import { useApi } from "../../hooks/useApi";
import { useDebounce } from "../../hooks/useDebounce";
import { Input } from "../../components/ui/Input";
import { PageLoader } from "../../components/ui/PageLoader";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../utils/errorMessages";
import { VisitorResultRow } from "./components/VisitorResultRow";

export function VisitorSearchPage() {
  const [nameQuery, setNameQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const debouncedName = useDebounce(nameQuery, 400);
  const debouncedPhone = useDebounce(phoneQuery, 400);

  const hasQuery = !!(debouncedName.trim() || debouncedPhone.trim());

  const {
    data: visitors,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      hasQuery
        ? visitorsApi.search({
            name: debouncedName.trim(),
            phone: debouncedPhone.trim(),
          })
        : Promise.resolve(null),
    [debouncedName, debouncedPhone],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Visitors</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search visitors by name or phone to view their visit history.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
        <Input
          id="searchName"
          label="Visitor Name"
          placeholder="Search by name"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
        />
        <Input
          id="searchPhone"
          label="Phone Number"
          placeholder="Search by phone"
          value={phoneQuery}
          onChange={(e) => setPhoneQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        {!hasQuery && (
          <EmptyState
            title="Search for a visitor"
            description="Enter a name or phone number above to find a visitor and view their history."
          />
        )}

        {hasQuery && loading && <PageLoader />}

        {hasQuery && !loading && error && (
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        )}

        {hasQuery &&
          !loading &&
          !error &&
          (!visitors || visitors.length === 0) && (
            <EmptyState
              title="No visitors found"
              description="Try a different name or phone number."
            />
          )}

        {hasQuery && !loading && !error && visitors && visitors.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {visitors.map((visitor) => (
              <li key={visitor._id ?? visitor.id}>
                <VisitorResultRow visitor={visitor} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
