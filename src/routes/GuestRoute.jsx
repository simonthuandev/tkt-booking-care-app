import PublicLayout from "../components/Layout/PublicLayout";
import * as Guest from "../pages/GuestPages";

const GuestRoute = {
  path: "/",
  children: [
    {
      index: true,
      element: <Guest.HomePage />,
    },
    {
      element: <PublicLayout />,
      children: [
        { path: "doctors", element: <Guest.DoctorsPage /> },
        { path: "doctors/:doctorSlug", element: <Guest.DoctorDetailPage /> },
        { path: "specialties", element: <Guest.SpecialtiesPage /> },
        { path: "specialties/:specialtySlug", element: <Guest.SpecialtyDetailPage /> },
        { path: "hospitals", element: <Guest.HospitalsPage /> },
        { path: "hospitals/:hospitalSlug", element: <Guest.HospitalDetailPage /> },
        { path: "search", element: <Guest.SearchPage /> },
        { path: "about", element: <Guest.AboutPage /> },
        { path: "contact", element: <Guest.ContactPage /> },
        { path: "payment-result", element: <Guest.PaymentResult /> },
      ],
    },
  ]
};

export default GuestRoute;
