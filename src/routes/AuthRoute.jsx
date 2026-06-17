import { Navigate } from "react-router";
import AuthLayout from "../components/Layout/AuthLayout";
import GuestOnlyRoute from "../components/Auth/GuestOnlyRoute";
import * as Auth from "../pages/AuthPages";

const AuthRoute = {
  path: "/auth",
  children: [
    {
      element: <GuestOnlyRoute />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            { index: true, element: <Navigate to="login" replace /> },
            { path: "login", element: <Auth.LoginPage /> },
            { path: "register", element: <Auth.RegisterPage /> },
            { path: "forgot-password", element: <Auth.ForgotPasswordPage /> },
            { path: "oauth/callback", element: <Auth.OAuthCallbackPage /> },
          ],
        },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: "reset-password/:token", element: <Auth.ResetPasswordPage /> },
        { path: "verify-email/:token", element: <Auth.VerifyEmailPage /> },
      ],
    },
  ],
};

export default AuthRoute;
