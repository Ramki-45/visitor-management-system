import { axiosClient } from "./axiosClient";
import { ENDPOINTS } from "./endpoints";

export const employeesApi = {
  // Returns all active employees. Used by Receptionist (and Admin, per
  // docs) to populate the employee picker on visitor registration.
  list: () =>
    axiosClient.get(ENDPOINTS.EMPLOYEES.LIST).then((res) => res.data.data),
};
