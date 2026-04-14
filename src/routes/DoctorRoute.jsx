import DoctorLayout from "../components/Layout/DoctorLayout";
import RoleRoute from "../components/Auth/RoleRoute";
import * as Doctor from "../pages/AppPages/Doctor";

const DoctorRoute = {
  path: "doctor",
  element: <RoleRoute allowedRoles={["doctor"]} />,
  children: [
    {
      element: <DoctorLayout />,
      children: [
        { path: "dashboard", element: <Doctor.DoctorDashboardPage /> },
        { path: "schedule", element: <Doctor.DoctorSchedulePage /> },
        { path: "appointments", element: <Doctor.DoctorAppointmentsPage /> },
        { path: "patients", element: <Doctor.DoctorPatientsPage /> },
        { path: "settings", element: <Doctor.DoctorSettingsPage /> },
      ],
    },
  ],
};

export default DoctorRoute;
