import axios from "axios";

// TODO: thay baseURL cho đúng server của bạn
// ví dụ cybersoft thường dùng: https://elearningnew.cybersoft.edu.vn
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://elearningnew.cybersoft.edu.vn";

// TokenCybersoft bạn đang dùng (JWT cybersoft). Nên bỏ vào .env
const TOKEN_CYBERSOFT = import.meta.env.VITE_TOKEN_CYBERSOFT || "";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

axiosClient.interceptors.request.use((config) => {
  // Header TokenCybersoft
  config.headers = config.headers || {};
  if (TOKEN_CYBERSOFT) {
    config.headers["TokenCybersoft"] = TOKEN_CYBERSOFT;
  }

  // Authorization Bearer (accessToken user)
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
