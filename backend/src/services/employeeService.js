import Employee from "../models/Employee.js";

/**
 * Get all active employees.
 *
 * Used by:
 * - Receptionist (Employee dropdown)
 * - Admin (Employee list)
 */
export const getEmployees = async () => {
  return Employee.find({ isActive: true })
    .select("name department designation")
    .sort({ name: 1 })
    .lean();
};
