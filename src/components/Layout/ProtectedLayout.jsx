import { Outlet } from "react-router";
import SideBar from "../SideBar";

const ProtectedLayout = () => {
  return (
    <main className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-3 overflow-auto">
        <Outlet />
      </div>
    </main>
  );
};

export default ProtectedLayout;
