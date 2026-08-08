/**
 * Business rule constants.
 *
 * Centralizes configurable business limits used by the service layer.
 * Keeping these values here avoids hardcoded "magic numbers" throughout
 * the application and makes future changes easier.
 */

export const BUSINESS_RULES = Object.freeze({
  /**
   * Rule 5:
   * An employee cannot have more than this many
   * pending visitor requests awaiting approval.
   */
  MAX_PENDING_REQUESTS_PER_EMPLOYEE: 3,
});
