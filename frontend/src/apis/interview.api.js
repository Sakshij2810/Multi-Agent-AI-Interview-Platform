import api from "../utils/axios.js";
import { server_base_endpoints } from "../utils/server-base-endpoints";

export const startInterview = async (data) => {
  try {
    const response = await api.post(
      server_base_endpoints.interview.start,
      data,
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getInterview = async (id) => {
  try {
    const response = await api.get(
      `${server_base_endpoints.interview.get}/${id}`,
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const submitAnswer = async (data) => {
  try {
    const response = await api.post(
      server_base_endpoints.interview.answer,
      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllInterviews = async () => {
  try {
    const response = await api.get(server_base_endpoints.interview.get_all);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
