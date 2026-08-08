// Maps backend error codes (see API docs "Error Codes Reference" and the
// per-endpoint tables) to what we show the user. Components should always
// go through getErrorMessage() rather than reading error.response.data
// directly, so new codes only ever need a line added here.

const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: "That email or password is incorrect.",
  VALIDATION_ERROR: "Please check the form and try again.",
  NO_TOKEN: "Your session has ended. Please sign in again.",
  INVALID_TOKEN: "Your session has ended. Please sign in again.",
  ACCOUNT_INACTIVE:
    "This account has been deactivated. Contact an administrator.",

  // Visit request business rules — filled in as each feature lands
  RULE_1_ACTIVE_VISIT_EXISTS:
    "This visitor already has an active visit in progress.",
  RULE_2_DUPLICATE_SAME_DAY:
    "This visitor already has a request for that date.",
  RULE_3_PAST_DATE: "Visit date cannot be earlier than today.",
  RULE_4_PAST_TIME:
    "Arrival time can't be earlier than the current time for today's date.",
  RULE_5_PENDING_LIMIT:
    "This employee already has 3 pending requests awaiting approval.",
  EMPLOYEE_NOT_FOUND: "Select a valid, active employee.",
  RULE_6_7_INVALID_CHECKIN: "This visitor cannot be checked in right now.",
  RULE_8_INVALID_TIME: "Check-out time must be after check-in time.",
  INVALID_TRANSITION: "This request can't be updated from its current status.",

  // Generic fallbacks
  FORBIDDEN: "You don't have permission to do that.",
};

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

export function getErrorMessage(error) {
  const code = error?.response?.data?.error?.code;
  const serverMessage = error?.response?.data?.error?.message;
  return ERROR_MESSAGES[code] || serverMessage || DEFAULT_MESSAGE;
}
