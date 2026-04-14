import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const normalizeRoles = (roleValue) => {
  if (!roleValue) return [];
  if (Array.isArray(roleValue)) return roleValue;
  return [roleValue];
};

const RoleRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const userRoles = normalizeRoles(user?.roles || user?.role);
  const canAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!canAccess) {
    return <Navigate to="/system/403" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
