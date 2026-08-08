import {
  getTodayDateString,
  getCurrentTimeString,
  isToday,
} from "./dateHelpers";

const PHONE_PATTERN = /^\d{7,15}$/;

export function validateVisitRequestForm(values) {
  const errors = {};

  if (!values.visitorName?.trim()) {
    errors.visitorName = "Visitor name is required.";
  }

  if (!values.visitorPhone?.trim()) {
    errors.visitorPhone = "Phone number is required.";
  } else if (!PHONE_PATTERN.test(values.visitorPhone.trim())) {
    errors.visitorPhone = "Enter a valid phone number (digits only).";
  }

  if (
    values.visitorEmail &&
    !/^\S+@\S+\.\S+$/.test(values.visitorEmail.trim())
  ) {
    errors.visitorEmail = "Enter a valid email address.";
  }

  if (!values.employeeId) {
    errors.employeeId = "Select the employee being visited.";
  }

  if (!values.purpose?.trim()) {
    errors.purpose = "Purpose of visit is required.";
  }

  if (!values.visitDate) {
    errors.visitDate = "Visit date is required.";
  } else if (values.visitDate < getTodayDateString()) {
    // Rule 3
    errors.visitDate = "Visit date cannot be earlier than today.";
  }

  if (!values.expectedArrivalTime) {
    errors.expectedArrivalTime = "Expected arrival time is required.";
  } else if (
    values.visitDate &&
    isToday(values.visitDate) &&
    values.expectedArrivalTime < getCurrentTimeString()
  ) {
    // Rule 4
    errors.expectedArrivalTime =
      "Arrival time can't be earlier than the current time.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
