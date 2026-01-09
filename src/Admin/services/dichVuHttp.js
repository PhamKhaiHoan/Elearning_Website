import axios from 'axios';
import { DOMAIN, TOKEN_CYBERSOFT,TOKEN_TRUY_CAP } from './config';

export const dichVuHttp = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
});

dichVuHttp.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      TokenCybersoft: TOKEN_CYBERSOFT,
    };

    const token = localStorage.getItem(TOKEN_TRUY_CAP);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);