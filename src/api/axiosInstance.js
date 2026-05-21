import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // BẮT BUỘC để browser gửi kèm httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
