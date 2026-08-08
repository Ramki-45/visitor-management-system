import * as employeeService from "../services/employeeService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.getEmployees();

  res.status(200).json({
    success: true,
    data: employees,
  });
});
