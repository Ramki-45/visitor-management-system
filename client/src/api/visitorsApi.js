import { axiosClient } from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

export const visitorsApi = {
  search: (params = {}) => {
    const name = params.name?.trim() || "";
    const phone = params.phone?.trim() || "";

    // Backend expects a single `search` parameter.
    // Use name when provided; otherwise use phone.
    const search = name || phone;

    if (!search) {
      return Promise.resolve([]);
    }

    return axiosClient
      .get(ENDPOINTS.VISITORS.SEARCH, {
        params: {
          search,
        },
      })
      .then((res) => res.data.data);
  },

  history: (visitorId) =>
    axiosClient
      .get(ENDPOINTS.VISITORS.HISTORY(visitorId))
      .then((res) => res.data.data),
};
