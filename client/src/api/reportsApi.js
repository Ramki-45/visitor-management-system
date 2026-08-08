import { axiosClient } from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

export const reportsApi = {
  getVisitorReport: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== "" && value != null,
      ),
    );
    return axiosClient
      .get(ENDPOINTS.REPORTS.VISITORS, { params: cleanParams })
      .then((res) => res.data.data);
  },
};
