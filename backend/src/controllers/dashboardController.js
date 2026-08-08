import * as dashboardService from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";

/*Admin Dashboard*/

export const adminDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAdminDashboard();

  res.status(200).json({
    success: true,
    data,
  });
});

/*Receptionist Dashboard*/

export const receptionistDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getReceptionistDashboard();

  res.status(200).json({
    success: true,
    data,
  });
});

/*Employee Dashboard*/

export const employeeDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getEmployeeDashboard(req.user.employeeId);

  res.status(200).json({
    success: true,
    data,
  });
});
