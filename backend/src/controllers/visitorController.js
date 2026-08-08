import * as visitorService from "../services/visitorService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const search = asyncHandler(async (req, res) => {
  console.log("req.query:", req.query);
  const visitors = await visitorService.searchVisitors(req.query);

  res.status(200).json({
    success: true,
    data: visitors,
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await visitorService.getVisitorHistory(req.params.id);

  res.status(200).json({
    success: true,
    data: history,
  });
});
