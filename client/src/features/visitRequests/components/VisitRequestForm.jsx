import { useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { EmployeeSelect } from "./EmployeeSelect";
import { validateVisitRequestForm } from "../../../utils/visitRequestValidation";
import {
  getTodayDateString,
  getCurrentTimeString,
  isToday,
} from "../../../utils/dateHelpers";

const INITIAL_VALUES = {
  visitorName: "",
  visitorPhone: "",
  visitorEmail: "",
  visitorCompany: "",
  employeeId: "",
  purpose: "",
  visitDate: "",
  expectedArrivalTime: "",
};

function buildPayload(values) {
  const visitor = {
    name: values.visitorName.trim(),
    phone: values.visitorPhone.trim(),
  };
  if (values.visitorEmail.trim()) visitor.email = values.visitorEmail.trim();
  if (values.visitorCompany.trim())
    visitor.company = values.visitorCompany.trim();

  return {
    visitor,
    employeeId: values.employeeId,
    purpose: values.purpose.trim(),
    visitDate: values.visitDate,
    expectedArrivalTime: values.expectedArrivalTime,
  };
}

export function VisitRequestForm({ onSubmit, isSubmitting, serverError }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});

  const setField = (field) => (eOrValue) => {
    const value =
      typeof eOrValue === "string" ? eOrValue : eOrValue.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    // Clear that field's error the moment the person edits it — errors
    // shouldn't linger once they're being addressed.
    setFieldErrors((errs) =>
      errs[field] ? { ...errs, [field]: undefined } : errs,
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateVisitRequestForm(values);
    setFieldErrors(errors);
    if (!isValid) return;
    onSubmit(buildPayload(values));
  };

  const arrivalMin = isToday(values.visitDate)
    ? getCurrentTimeString()
    : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-slate-900">
          Visitor Details
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="visitorName"
            label="Full Name"
            value={values.visitorName}
            onChange={setField("visitorName")}
            error={fieldErrors.visitorName}
          />
          <Input
            id="visitorPhone"
            label="Phone Number"
            type="tel"
            value={values.visitorPhone}
            onChange={setField("visitorPhone")}
            error={fieldErrors.visitorPhone}
          />
          <Input
            id="visitorEmail"
            label="Email (optional)"
            type="email"
            value={values.visitorEmail}
            onChange={setField("visitorEmail")}
            error={fieldErrors.visitorEmail}
          />
          <Input
            id="visitorCompany"
            label="Company (optional)"
            value={values.visitorCompany}
            onChange={setField("visitorCompany")}
            error={fieldErrors.visitorCompany}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-slate-900">
          Visit Details
        </legend>
        <EmployeeSelect
          value={values.employeeId}
          onChange={setField("employeeId")}
          error={fieldErrors.employeeId}
        />
        <Textarea
          id="purpose"
          label="Purpose of Visit"
          value={values.purpose}
          onChange={setField("purpose")}
          error={fieldErrors.purpose}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="visitDate"
            label="Visit Date"
            type="date"
            min={getTodayDateString()}
            value={values.visitDate}
            onChange={setField("visitDate")}
            error={fieldErrors.visitDate}
          />
          <Input
            id="expectedArrivalTime"
            label="Expected Arrival Time"
            type="time"
            min={arrivalMin}
            value={values.expectedArrivalTime}
            onChange={setField("expectedArrivalTime")}
            error={fieldErrors.expectedArrivalTime}
          />
        </div>
      </fieldset>

      {serverError && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full sm:w-auto"
        >
          Register Visitor
        </Button>
      </div>
    </form>
  );
}
