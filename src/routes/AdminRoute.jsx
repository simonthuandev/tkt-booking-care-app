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
        {
          path: "doctors",
          children: [
            { index: true, element: <Admin.AdminDoctorsPage /> },
            { path: "create", element: <Admin.AdminDoctorCreatePage /> },
            { path: ":doctorId", element: <Admin.AdminDoctorDetailPage /> },
            { path: ":doctorId/edit", element: <Admin.AdminDoctorEditPage /> },
          ],
        },
        {
          path: "schedules",
          children: [
            { index: true, element: <Admin.AdminSchedulesPage /> },
            { path: "doctor/:doctorId", element: <Admin.AdminDoctorSchedulePage /> },
          ],
        },
        {
          path: "appointments",
          children: [
            { index: true, element: <Admin.AdminAppointmentsPage /> },
            { path: ":appointmentId", element: <Admin.AdminAppointmentDetailPage /> },
          ],
        },
        { path: "patients", element: <Admin.AdminPatientsPage /> },
        { path: "specialties", element: <Admin.AdminSpecialtiesPage /> },
        { path: "hospitals", element: <Admin.AdminHospitalsPage /> },
        { path: "users", element: <Admin.AdminUsersPage /> },
        { path: "services", element: <Admin.AdminServicesPage /> },
        { path: "news", element: <Admin.AdminNewsPage /> },
        { path: "reports", element: <Admin.AdminReportsPage /> },
        { path: "settings", element: <Admin.AdminSettingsPage /> },
      ],
    },
  ],
};

export default AdminRoute;
