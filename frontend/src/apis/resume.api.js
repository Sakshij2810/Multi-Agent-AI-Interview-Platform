import api from "../utils/axios.js";
import { server_base_endpoints } from "../utils/server-base-endpoints";

export const getResume = async () => {
  try {
    const res = await api.get(server_base_endpoints.resume.get_resume);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};
