import axios from "axios";
import { DOMAIN, TOKEN_CYBERSOFT } from "../../Admin/services/config";

export const axiosClient = axios.create({
  baseURL: DOMAIN,
  timeout: 20000,
});

axiosClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (TOKEN_CYBERSOFT) {
    config.headers["TokenCybersoft"] = TOKEN_CYBERSOFT;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.content ||
      error?.response?.data?.message ||
      error?.message ||
      "Có lỗi xảy ra";
    return Promise.reject(new Error(message));
  }
);
