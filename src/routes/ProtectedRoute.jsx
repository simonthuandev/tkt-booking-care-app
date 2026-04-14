import { Navigate } from "react-router";
import ProtectedGate from "../components/Auth/ProtectedGate";
import ProtectedLayout from "../components/Layout/ProtectedLayout";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";

const ProtectedRoute = {
  path: "/app",
  element: <ProtectedGate />,
  children: [
    {
      element: <ProtectedLayout />,
      children: [
        UserRoute,
        AdminRoute,
      ],
    },
  ],
};

export default ProtectedRoute;