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
        { path: "dashboard", element: <User.UserDashboardPage /> },
        { path: "booking/:doctorSlug", element: <User.UserBookingPage /> },
        { path: "appointments", element: <User.UserAppointmentsPage /> },
        { path: "medical-records", element: <User.UserMedicalRecordsPage /> },
        { path: "settings", element: <User.UserSettingsPage /> },
      ],
    },
  ],
};

export default UserRoute;
