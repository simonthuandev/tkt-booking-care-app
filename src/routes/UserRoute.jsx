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
        { path: "profile-setup", element: <User.ProfileSetupPage /> },
        {
          path: "booking",
          children: [
            { path: ":doctorId/confirm", element: <User.BookingConfirmPage /> },
            { path: ":doctorId/payment", element: <User.BookingPaymentPage /> },
            { path: "success/:appointmentId", element: <User.BookingSuccessPage /> },
          ],
        },
        {
          path: "appointments",
          children: [
            { path: "upcoming", element: <User.UserAppointmentsUpcomingPage /> },
            { path: "history", element: <User.UserAppointmentsHistoryPage /> },
            { path: ":appointmentId", element: <User.UserAppointmentDetailPage /> },
            {
              path: ":appointmentId/reschedule",
              element: <User.UserAppointmentReschedulePage />,
            },
            { path: ":appointmentId/cancel", element: <User.UserAppointmentCancelPage /> },
          ],
        },
        { path: "medical-records", element: <User.UserMedicalRecordsPage /> },
        { path: "notifications", element: <User.UserNotificationsPage /> },
        { path: "favorites/doctors", element: <User.UserFavoriteDoctorsPage /> },
        { path: "settings", element: <User.UserSettingsPage /> },
      ],
    },
  ],
};

export default UserRoute;
