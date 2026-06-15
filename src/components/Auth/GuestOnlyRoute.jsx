import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { getRoleLandingPath } from "../../utils/rolePaths";

const GuestOnlyRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = user?.role;

  if (isAuthenticated) {
    return <Navigate to={getRoleLandingPath(role)} replace />;
  }

  return <Outlet />;
};

export default GuestOnlyRoute;
