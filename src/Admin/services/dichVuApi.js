import axios from "axios";
import { DOMAIN, TOKEN_CYBERSOFT, TOKEN_TRUY_CAP } from "./config.js";

export const dichVuHttp = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
});

dichVuHttp.interceptors.request.use(
  (cauHinh) => {
    cauHinh.headers = {
      ...cauHinh.headers,
      TokenCybersoft: TOKEN_CYBERSOFT,
    };

    const token = localStorage.getItem(TOKEN_TRUY_CAP);
    if (token) {
      cauHinh.headers.Authorization = `Bearer ${token}`;
    }

    return cauHinh;
  },
  (loi) => Promise.reject(loi)
);
