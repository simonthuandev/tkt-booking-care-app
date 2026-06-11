import AdminLayout from "../components/Layout/AdminLayout";
import RoleRoute from "../components/Auth/RoleRoute";
import * as Admin from "../pages/AppPages/Admin";

const AdminRoute = {
  path: "admin",
  element: <RoleRoute allowedRoles={["admin"]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: "dashboard", element: <Admin.AdminDashboardPage /> },
        { path: "doctors", element: <Admin.AdminDoctorsPage /> },
        { path: "schedules", element: <Admin.AdminSchedulesPage /> },
        { path: "appointments", element: <Admin.AdminAppointmentsPage /> },
        { path: "specialties", element: <Admin.AdminSpecialtiesPage /> },
        { path: "hospitals", element: <Admin.AdminHospitalsPage /> },
        { path: "users", element: <Admin.AdminUsersPage /> },
        { path: "reviews", element: <Admin.AdminReviewsPage /> },
        { path: "reports", element: <Admin.AdminReportsPage /> },
        { path: "settings", element: <Admin.AdminSettingsPage /> },
      ],
    },
  ],
};

export default AdminRoute;
