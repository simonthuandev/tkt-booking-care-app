import { Navigate } from "react-router";
import UserLayout from "../components/Layout/UserLayout";
import RoleRoute from "../components/Auth/RoleRoute";
import * as User from "../pages/AppPages/User";

const UserRoute = {
  path: "user",
  element: <RoleRoute allowedRoles={["user", "patient"]} />,
  children: [
    {
      element: <UserLayout />,
      children: [
        { path: "dashboard", element: <Navigate to="/app/user/appointments" replace /> },
        { path: "booking/:timeSlotId", element: <User.UserBookingPage /> },
        { path: "appointments", element: <User.UserAppointmentsPage /> },
        { path: "patient-profiles", element: <User.UserPatientProfilesPage /> },
        { path: "reviews", element: <User.UserReviewsPage /> },
        { path: "settings", element: <User.UserSettingsPage /> },
      ],
    },
  ],
};

export default UserRoute;
