import { createBrowserRouter } from "react-router";

import GuestRoute from "./GuestRoute";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";

import NotFoundPage from "../pages/SystemPages/NotFoundPage";
import ErrorPage from "../pages/SystemPages/ErrorPage";
import UnauthorizedPage from "../pages/SystemPages/UnauthorizedPage";

const router = createBrowserRouter([
  GuestRoute,
  AuthRoute,
  ProtectedRoute,
  {
    path: "/system",
    children: [
      { path: "403", element: <UnauthorizedPage /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "500", element: <ErrorPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
