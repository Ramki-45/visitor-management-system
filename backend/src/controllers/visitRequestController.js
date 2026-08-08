import * as visitRequestService from "../services/visitRequestService.js";
import * as activityLogService from "../services/activityLogService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.createVisitRequest(
    req.body,
    req.user,
  );

  res.status(201).json({
    success: true,
    data: visitRequest,
  });
});

export const list = asyncHandler(async (req, res) => {
  const visitRequests = await visitRequestService.listVisitRequests(
    req.query,
    req.user,
  );

  res.status(200).json({
    success: true,
    data: visitRequests,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.getVisitRequestById(
    req.params.id,
    req.user,
  );

  res.status(200).json({
    success: true,
    data: visitRequest,
  });
});

export const approve = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.approveVisitRequest(
    req.params.id,
    req.user,
  );

  res.status(200).json({
    success: true,
    data: visitRequest,
  });
});

export const reject = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.rejectVisitRequest(
    req.params.id,
    req.user,
    {
      remarks: req.body.remarks,
    },
  );

  res.status(200).json({
    success: true,
    data: visitRequest,
  });
});

export const checkIn = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.checkInVisitRequest(
    req.params.id,
    req.user,
  );

  res.status(200).json({
    success: true,
    data: visitRequest,
  });
});

export const checkOut = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.checkOutVisitRequest(
    req.params.id,
    req.user,
  );

  res.status(200).json({
    success: true,
    data: visitRequest,
  });
});

export const cancel = asyncHandler(async (req, res) => {
  const visitRequest = await visitRequestService.cancelVisitRequest(
    req.params.id,
    req.user,
    {
      cancelReason: req.body.cancelReason,
    },
  );

  res.status(200).json({
    success: true,
    data: visitRequest,
  });
});

export const getActivity = asyncHandler(async (req, res) => {
  await visitRequestService.getVisitRequestById(req.params.id, req.user);

  const activity = await activityLogService.getActivityForRequest(
    req.params.id,
  );

  res.status(200).json({
    success: true,
    data: activity,
  });
});
