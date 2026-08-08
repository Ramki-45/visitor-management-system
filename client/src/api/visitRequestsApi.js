import { axiosClient } from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

export const visitRequestsApi = {
  // Registers a visitor: finds-or-creates the Visitor by phone, then
  // creates a VisitRequest in PENDING. Enforces Rules 1–5 server-side.
  create: (payload) =>
    axiosClient
      .post(ENDPOINTS.VISIT_REQUESTS.BASE, payload)
      .then((res) => res.data.data),

  // Role-scoped list with optional filters. Employee's results are always
  // scoped to their own employeeId server-side, regardless of params sent.
  list: (params = {}) => {
    // Drop empty-string/undefined filters so we don't send noisy query
    // params like ?visitorName=&status= to the API.
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value != null,
      ),
    );
    return axiosClient
      .get(ENDPOINTS.VISIT_REQUESTS.LIST, { params: cleanParams })
      .then((res) => res.data.data);
  },

  getById: (id) =>
    axiosClient
      .get(ENDPOINTS.VISIT_REQUESTS.DETAIL(id))
      .then((res) => res.data.data),

  getActivity: (id) =>
    axiosClient
      .get(ENDPOINTS.VISIT_REQUESTS.ACTIVITY(id))
      .then((res) => res.data.data),

  // Employee only, must be the assigned employee (server-enforced).
  approve: (id) =>
    axiosClient
      .patch(ENDPOINTS.VISIT_REQUESTS.APPROVE(id))
      .then((res) => res.data.data),

  reject: (id, remarks) =>
    axiosClient
      .patch(ENDPOINTS.VISIT_REQUESTS.REJECT(id), remarks ? { remarks } : {})
      .then((res) => res.data.data),

  // Receptionist only.
  checkIn: (id) =>
    axiosClient
      .patch(ENDPOINTS.VISIT_REQUESTS.CHECK_IN(id))
      .then((res) => res.data.data),

  checkOut: (id) =>
    axiosClient
      .patch(ENDPOINTS.VISIT_REQUESTS.CHECK_OUT(id))
      .then((res) => res.data.data),

  // Receptionist, Admin.
  cancel: (id, cancelReason) =>
    axiosClient
      .patch(
        ENDPOINTS.VISIT_REQUESTS.CANCEL(id),
        cancelReason ? { cancelReason } : {},
      )
      .then((res) => res.data.data),
};
