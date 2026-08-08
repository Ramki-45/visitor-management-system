import { axiosClient } from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

export const dashboardApi = {
  admin: () =>
    axiosClient.get(ENDPOINTS.DASHBOARD.ADMIN).then((res) => res.data.data),
  receptionist: () =>
    axiosClient
      .get(ENDPOINTS.DASHBOARD.RECEPTIONIST)
      .then((res) => res.data.data),
  employee: () =>
    axiosClient.get(ENDPOINTS.DASHBOARD.EMPLOYEE).then((res) => res.data.data),
};
