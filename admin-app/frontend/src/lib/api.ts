import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log("🔐 [API] Request to:", config.url, "| Token:", token ? "Present" : "Missing");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ [API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("✅ [API] Response from:", response.config.url, "| Status:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("❌ [API] Response error:", error.response?.status, error.response?.data);

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔄 [API] Attempting token refresh...");
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post("/api/v1/auth/refresh", {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        const admin = useAuthStore.getState().admin;

        if (admin) {
          useAuthStore.getState().setAuth(accessToken, newRefreshToken, admin);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ [API] Token refresh failed, redirecting to login");
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

