import { useState } from "react";
import { visitRequestsApi } from "../../api/visitRequestsApi";
import { getErrorMessage } from "../../utils/errorMessages";
import { VisitRequestForm } from "./components/VisitRequestForm";
import { Button } from "../../components/ui/Button";

export function RegisterVisitorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successRequest, setSuccessRequest] = useState(null);
  // Bumping this key forces VisitRequestForm to remount with fresh internal
  // state — simplest reliable way to reset a self-contained form.
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const created = await visitRequestsApi.create(payload);
      setSuccessRequest(created);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setSuccessRequest(null);
    setSubmitError("");
    setFormKey((k) => k + 1);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Register Visitor
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a visit request for employee approval.
        </p>
      </div>

      {successRequest ? (
        <div className="flex flex-col gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Visitor registered
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {successRequest.visitor?.name ?? "The visitor"} has been
              registered and the request is now pending employee approval.
            </p>
          </div>
          <div>
            <Button variant="secondary" onClick={handleRegisterAnother}>
              Register Another Visitor
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <VisitRequestForm
            key={formKey}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            serverError={submitError}
          />
        </div>
      )}
    </div>
  );
}
