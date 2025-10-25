import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post("/api/v1/auth/refresh", {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
