import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedGate = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedGate;