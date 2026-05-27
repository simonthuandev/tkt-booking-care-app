import axiosInstance from "../api/axiosInstance";
import authService from "../api/authService";

// Route loại trừ — 401 ở đây là bình thường, không cần redirect
const EXCLUDED_PATHS = ["/", "/doctors", "/specialties", "/hospitals",
"/services", "/news", "/search", "/about", "/contact", "/auth",
"/test-payment", "/payment-result"
];

const isExcludedPage = () => {
  const pathname = window.location.pathname;
  
  return EXCLUDED_PATHS.some((p) => {
    if (p === "/") return pathname === "/";
    return pathname.startsWith(p);
  });
};

const setupInterceptors = (store) => {
  let isRefreshing = false;
  let failedQueue = [];
  let isRedirectingToLogin = false;

  const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) =>
      error ? reject(error) : resolve(null)
    );
    failedQueue = [];
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};
      const status = error.response?.status;
      const url = originalRequest.url || "";

      // Những endpoint này KHÔNG BAO GIỜ trigger refresh để tránh loop
      // /auth/me được phép trigger refresh — xem giải thích bên dưới
      const isHardSkip =
        url.includes("/auth/refresh") ||
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i); // Bypass resource URLs

      if (status === 401 && !originalRequest._retry && !isHardSkip) {
        if (isRefreshing) {
          // Có request khác đang refresh — xếp hàng chờ
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => axiosInstance(originalRequest));
        }

        originalRequest._retry = true; // Chặn retry lần 2 — tránh loop
        isRefreshing = true;

        try {
          await authService.refresh();
          processQueue(null);
          return axiosInstance(originalRequest); // Retry request gốc
        } catch (refreshError) {
          processQueue(refreshError);

          const { logout } = await import("../store/slices/authSlice");
          store.dispatch(logout());

          if (!isRedirectingToLogin && !isExcludedPage()) {
            isRedirectingToLogin = true;
            window.location.replace("/auth/login");
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          setTimeout(() => { isRedirectingToLogin = false; }, 2000);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
