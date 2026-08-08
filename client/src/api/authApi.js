import { axiosClient } from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

export const authApi = {
  login: (email, password) =>
    axiosClient
      .post(ENDPOINTS.AUTH.LOGIN, { email, password })
      .then((res) => res.data.data),

  me: () => axiosClient.get(ENDPOINTS.AUTH.ME).then((res) => res.data.data),
};
