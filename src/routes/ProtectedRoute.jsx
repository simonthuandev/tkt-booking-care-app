import ProtectedGate from "../components/Auth/ProtectedGate";
import ProtectedLayout from "../components/Layout/ProtectedLayout";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import DoctorRoute from "./DoctorRoute";

const ProtectedRoute = {
  path: "/app",
  element: <ProtectedGate />,
  children: [
    {
      element: <ProtectedLayout />,
      children: [
        UserRoute,
        AdminRoute,
        DoctorRoute,
      ],
    },
  ],
};

export default ProtectedRoute;