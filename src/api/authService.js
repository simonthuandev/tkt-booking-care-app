import axiosInstance, { API_URL } from "./axiosInstance";

const authService = {
  // Redirect browser sang Google — KHÔNG dùng axios vì cần browser tự redirect
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  register: (data) => axiosInstance.post("/auth/register", data),

  login: (data) => axiosInstance.post("/auth/login", data),

  logout: () => axiosInstance.post("/auth/logout"),

  logoutAll: () => axiosInstance.post("/auth/logout-all"),

  getMe: () => axiosInstance.get("/auth/me"),

  refresh: () => axiosInstance.post("/auth/refresh"),
};

export default authService;
