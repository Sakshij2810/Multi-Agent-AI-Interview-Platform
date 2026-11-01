import { server_base_endpoints } from "../utils/server-base-endpoints";
import api from "../utils/axios";

export const getCurrentUser = async () => {
  try {
    const res = await api.get(server_base_endpoints.user.me);

    return res.data;
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong.");
  }
};

export const deductCoins = async (data) => {
  try {
    const res = await api.post(server_base_endpoints.auth.use_coins, data);
    return res.data;
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong.");
  }
};
