// import { Outlet } from "react-router";
// import SideBar from "../SideBar";

// const ProtectedLayout = () => {
//   return (
//     <main className="d-flex min-vh-100">
//       {/* Sidebar */}
//       <div className="flex-shrink-0">
//         <SideBar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1 bg-light p-3 overflow-auto">
//         <Outlet />
//       </div>
//     </main>
//   );
// };

// export default ProtectedLayout;
import { Outlet } from "react-router";
import SideBar from "../SideBar";
import NavBar from "../NavBar";

const ProtectedLayout = () => {
  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">

      {/* ── Top: NavBar ── */}
      <NavBar />

      {/* ── Bottom: Sidebar + Main content ── */}
      <div className="d-flex flex-grow-1 overflow-hidden">

        {/* Sidebar */}
        <div className="flex-shrink-0">
          <SideBar />
        </div>

        {/* Main Content */}
        <main className="flex-grow-1 bg-light p-3 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ProtectedLayout;