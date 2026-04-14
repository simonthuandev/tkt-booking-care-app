import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isAuthenticated: !!localStorage.getItem("rememberMe"),
//   user: localStorage.getItem("user2")
//     ? JSON.parse(localStorage.getItem("user2"))
//     : null,
// };

const initialState = {
  isAuthenticated: true,
  user: {
    name: "huynh hoang khoa",
    role: "admin",
  }
};

// const initialState = {
//   isAuthenticated: true,
//   user: {
//     name: "pham minh tuan",
//     role: "user",
//   }
// };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login success
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // Login failure
    loginFailure: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("user");
    },

    // Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("user");
    },
    resetAuth: (state) => {
      if (!localStorage.getItem("rememberMe")) {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { loginSuccess, loginFailure, logout, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
