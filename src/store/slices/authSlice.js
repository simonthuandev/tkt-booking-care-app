import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../api/authService";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe();
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Chưa đăng nhập");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      await authService.login(data);
      const me = await authService.getMe();
      return me.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Email hoặc mật khẩu không chính xác"
      );
    }
  }
);

export const exchangeOAuthCode = createAsyncThunk(
  "auth/exchangeOAuthCode",
  async (code, { rejectWithValue }) => {
    try {
      const res = await authService.exchangeOAuthCode(code);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Đăng nhập Google thất bại"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      await authService.register(data);
      const me = await authService.getMe();
      return me.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Đăng ký thất bại"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Đăng xuất thất bại");
    }
  }
);

export const logoutAll = createAsyncThunk(
  "auth/logoutAll",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutAll();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message ?? "Đăng xuất thất bại");
    }
  }
);

export const updateCurrentUserProfile = createAsyncThunk(
  "auth/updateCurrentUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.updateMeProfile(data);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ?? "Cập nhật thông tin thất bại"
      );
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,           // { id, email, firstName, lastName, role }
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true, // true khi app mới load, chờ check session
    error: null,
  },
  reducers: {
    // Dùng sau khi Google OAuth redirect về và đã fetch được user
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchCurrentUser ──────────────────────────────────────────────────
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isInitializing = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
        // Không set error ở đây — 401 là trạng thái bình thường khi chưa login
      });

    // ── login ─────────────────────────────────────────────────────────────
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // ── Google OAuth exchange ─────────────────────────────────────────────
    builder
      .addCase(exchangeOAuthCode.pending, (state) => {
        state.isLoading = true;
        state.isInitializing = true;
        state.error = null;
      })
      .addCase(exchangeOAuthCode.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isInitializing = false;
      })
      .addCase(exchangeOAuthCode.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isInitializing = false;
        state.error = action.payload;
      });

    // ── register ──────────────────────────────────────────────────────────
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    // ── logout + logoutAll ────────────────────────────────────────────────
    const handleLogout = (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    };
    builder
      .addCase(logout.pending, (state) => { state.isLoading = true; })
      .addCase(logout.fulfilled, handleLogout)
      .addCase(logout.rejected, handleLogout); // Dù lỗi vẫn clear user ở client

    builder
      .addCase(logoutAll.pending, (state) => { state.isLoading = true; })
      .addCase(logoutAll.fulfilled, handleLogout)
      .addCase(logoutAll.rejected, handleLogout);

    // ── update profile ───────────────────────────────────────────────────
    builder
      .addCase(updateCurrentUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrentUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(updateCurrentUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsInitializing = (state) => state.auth.isInitializing;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
