import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBars,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaFileMedical,
  FaHospitalUser,
  FaNewspaper,
  FaStethoscope,
  FaTachometerAlt,
  FaUserInjured,
  FaUsers,
  FaThList,
} from "react-icons/fa";

const MENU_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    getPathByRole: (role) => {
      if (role === "admin") return "/app/admin/dashboard";
      if (role === "doctor") return "/app/doctor/dashboard";
      return "/app/user/dashboard";
    },
    icon: FaTachometerAlt,
    roles: ["user", "admin", "doctor"],
  },

  // User
  {
    key: "user-appointments",
    label: "Appointments",
    path: "/app/user/appointments/upcoming",
    icon: FaCalendarAlt,
    roles: ["user"],
  },
  {
    key: "user-records",
    label: "Medical Records",
    path: "/app/user/medical-records",
    icon: FaFileMedical,
    roles: ["user"],
  },
  {
    key: "user-settings",
    label: "Settings",
    path: "/app/user/settings",
    icon: FaCog,
    roles: ["user"],
  },

  // Admin
  {
    key: "admin-doctors",
    label: "Doctors",
    path: "/app/admin/doctors",
    icon: FaStethoscope,
    roles: ["admin"],
  },
  {
    key: "admin-patients",
    label: "Patients",
    path: "/app/admin/patients",
    icon: FaUserInjured,
    roles: ["admin"],
  },
  {
    key: "admin-specialties",
    label: "Specialties",
    path: "/app/admin/specialties",
    icon: FaThList,
    roles: ["admin"],
  },
  {
    key: "admin-services",
    label: "Services",
    path: "/app/admin/services",
    icon: FaHospitalUser,
    roles: ["admin"],
  },
  {
    key: "admin-news",
    label: "News",
    path: "/app/admin/news",
    icon: FaNewspaper,
    roles: ["admin"],
  },
  {
    key: "admin-reports",
    label: "Reports",
    path: "/app/admin/reports",
    icon: FaChartBar,
    roles: ["admin"],
  },

  // Doctor
  {
    key: "doctor-schedule",
    label: "Schedule",
    path: "/app/doctor/schedule",
    icon: FaCalendarAlt,
    roles: ["doctor"],
  },
  {
    key: "doctor-appointments",
    label: "Appointments",
    path: "/app/doctor/appointments",
    icon: FaUsers,
    roles: ["doctor"],
  },
];

const getPrimaryRole = (authUser) => {
  if (!authUser) return "user";

  if (Array.isArray(authUser.roles) && authUser.roles.length > 0) {
    return authUser.roles[0];
  }

  if (authUser.role) {
    return authUser.role;
  }

  return "user";
};

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const authState = useSelector((state) => state.auth);

  // Safe fallback so the component can still render in mock/demo states.
  const isAuthenticated = authState?.isAuthenticated ?? true;
  const user = authState?.user ?? { name: "Guest User", role: "user" };

  const role = getPrimaryRole(user);

  const menu = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
      ...item,
      path: item.path || item.getPathByRole?.(role) || "/app/user/dashboard",
    }));
  }, [role]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside
      className="d-flex flex-column border-end bg-white"
      style={{
        width: collapsed ? 84 : 260,
        minHeight: "100vh",
        transition: "width 180ms ease",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
      aria-label="Application sidebar"
    >
      <div
        className={`border-bottom d-flex align-items-center 
          ${!collapsed ? "justify-content-between" : "justify-content-center"}`}
        style={{ height: 68, padding: "0 12px" }}
      >
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          {!collapsed && (             
            <div
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #0ba3a3 0%, #0a7d8c 100%)",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <FaStethoscope size={14} />
            </div>
          )}

          {!collapsed && (
            <div className="text-truncate">
              <div className="fw-bold" style={{ fontSize: 15, lineHeight: 1.1 }}>
                TKTBookingCare
              </div>
              <small className="text-muted text-capitalize">{role} panel</small>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="btn btn-sm btn-light border"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>
      </div>

      <nav className="py-2 px-2 d-flex flex-column gap-1" aria-label="Sidebar menu">
        {menu.map(({ key, label, path, icon: Icon }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `d-flex align-items-center gap-2 text-decoration-none rounded px-3 py-2
              ${isActive ? "text-white" : "text-dark"}
              ${collapsed ? "justify-content-center" : ""}
              `
            }
            style={({ isActive }) => ({
              background: isActive ? "linear-gradient(135deg, #0ba3a3 0%, #0a7d8c 100%)" : "transparent",
              fontWeight: isActive ? 600 : 500,
            })}
          >
            <Icon size={16} style={{ minWidth: 16 }} />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-top p-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-secondary-subtle d-inline-flex align-items-center justify-content-center"
            style={{ width: 34, height: 34, flexShrink: 0 }}
          >
            {String(user?.name || "U").trim().charAt(0).toUpperCase()}
          </div>
          {!collapsed ? (
            <div className="overflow-hidden">
              <div className="small fw-semibold text-truncate">{user?.name || "User"}</div>
              <div className="small text-muted text-capitalize">{role}</div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
