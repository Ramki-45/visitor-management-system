import * as reportService from "../services/reportService.js";
import asyncHandler from "../utils/asyncHandler.js";

/*Visitor Analytics Report*/

export const visitorReport = asyncHandler(async (req, res) => {
  const data = await reportService.getVisitorReport(req.query);

  res.status(200).json({
    success: true,
    data,
  });
});
