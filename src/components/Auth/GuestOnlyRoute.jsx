import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ROLE_REDIRECT = {
  admin: "/app/admin/dashboard",
  doctor: "/app/doctor/dashboard",
  user: "/app/user/dashboard",
};

const GuestOnlyRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = user?.role;

  if (isAuthenticated) {
    return <Navigate to={`${ROLE_REDIRECT[role]}`} replace />;
  }

  return <Outlet />;
};

export default GuestOnlyRoute;