import axiosInstance, { API_URL } from "./axiosInstance";

const authService = {
  // Redirect browser sang Google — KHÔNG dùng axios vì cần browser tự redirect
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  register: (data) => axiosInstance.post("/auth/register", data),

  login: (data) => axiosInstance.post("/auth/login", data),

  exchangeOAuthCode: (code) => axiosInstance.post("/auth/oauth/exchange", { code }),

  logout: () => axiosInstance.post("/auth/logout"),

  logoutAll: () => axiosInstance.post("/auth/logout-all"),

  getMe: () => axiosInstance.get("/auth/me"),

  updateMeProfile: (data) => axiosInstance.patch("/auth/me", data),

  changePassword: (data) => axiosInstance.patch("/auth/me/password", data),

  requestEmailVerification: () => axiosInstance.post("/auth/email-verification/request"),

  confirmEmailVerification: (data) => axiosInstance.post("/auth/email-verification/confirm", data),

  requestPasswordReset: (data) => axiosInstance.post("/auth/password-reset/request", data),

  confirmPasswordReset: (data) => axiosInstance.post("/auth/password-reset/confirm", data),

  refresh: () => axiosInstance.post("/auth/refresh"),
};

export default authService;
