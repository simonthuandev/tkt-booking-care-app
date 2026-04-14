import axiosInstance from "../api/axiosInstance";

const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register user
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;