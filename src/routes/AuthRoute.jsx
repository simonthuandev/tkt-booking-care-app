import { Navigate } from "react-router";
import AuthLayout from "../components/Layout/AuthLayout";
import GuestOnlyRoute from "../components/Auth/GuestOnlyRoute";
import * as Auth from "../pages/AuthPages";

const AuthRoute = {
  path: "/auth",
  element: <GuestOnlyRoute />,
  children: [
    {
      element: <AuthLayout />,
      children: [
        { index: true, element: <Navigate to="login" replace /> },
        { path: "login", element: <Auth.LoginPage /> },
        { path: "register", element: <Auth.RegisterPage /> },
        { path: "forgot-password", element: <Auth.ForgotPasswordPage /> },
        { path: "reset-password/:token", element: <Auth.ResetPasswordPage /> },
        { path: "verify-email/:token", element: <Auth.VerifyEmailPage /> },
        { path: "oauth/callback", element: <Auth.OAuthCallbackPage /> },
      ],
    },
  ],
};

export default AuthRoute;
