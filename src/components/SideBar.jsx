import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBars,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaStethoscope,
  FaTachometerAlt,
  FaUserInjured,
  FaHospital,
  FaThList,
  FaUser
} from "react-icons/fa";
import { GrSchedules } from "react-icons/gr";
import { MdOutlineReviews } from "react-icons/md";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";

const MENU_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/app/admin/dashboard",
    icon: FaTachometerAlt,
    roles: ["admin"],
  },

  // User
  {
    key: "user-appointments",
    label: "Appointments",
    path: "/app/user/appointments",
    icon: FaCalendarAlt,
    roles: ["user"],
  },
  {
    key: "user-patient-profiles",
    label: "Patient Profile",
    path: "/app/user/patient-profiles",
    icon: FaUserInjured,
    roles: ["user"],
  },
  {
    key: "user-reviews",
    label: "Reviews",
    path: "/app/user/reviews",
    icon: MdOutlineReviews,
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
    key: "admin-schedules",
    label: "Schedules",
    path: "/app/admin/schedules",
    icon: GrSchedules,
    roles: ["admin"],
  },
  {
    key: "admin-appointments",
    label: "Appointments",
    path: "/app/admin/appointments",
    icon: FaCalendarAlt,
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
    key: "admin-hospitals",
    label: "Hospitals",
    path: "/app/admin/hospitals",
    icon: FaHospital,
    roles: ["admin"],
  },
  {
    key: "admin-users",
    label: "Users",
    path: "/app/admin/users",
    icon: FaUser,
    roles: ["admin"],
  },
  {
    key: "admin-reviews",
    label: "Reviews",
    path: "/app/admin/reviews",
    icon: MdOutlineReviews,
    roles: ["admin"],
  },
  {
    key: "admin-reports",
    label: "Reports",
    path: "/app/admin/reports",
    icon: FaChartBar,
    roles: ["admin"],
  },
  {
    key: "admin-settings",
    label: "Settings",
    path: "/app/admin/settings",
    icon: FaCog,
    roles: ["admin"],
  },

  // Doctor
  {
    key: "doctor-schedule",
    label: "Schedule",
    path: "/app/doctor/schedule",
    icon: GrSchedules,
    roles: ["doctor"],
  },
  {
    key: "doctor-appointments",
    label: "Appointments",
    path: "/app/doctor/appointments",
    icon: FaCalendarAlt,
    roles: ["doctor"],
  },
  {
    key: "doctor-reviews",
    label: "Reviews",
    path: "/app/doctor/reviews",
    icon: MdOutlineReviews,
    roles: ["doctor"],
  },
  {
    key: "doctor-settings",
    label: "Settings",
    path: "/app/doctor/settings",
    icon: FaCog,
    roles: ["doctor"],
  },
];

const getFullName = (firstName = "", lastName = "") => {
  const full = `${firstName} ${lastName}`.trim();
  return full || "Người dùng";
};

const getInitials = (firstName = "", lastName = "") => {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  return f + l || "U";
};

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Safe fallback so the component can still render in mock/demo states.
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const role = user?.role;

  const menu = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
      ...item,
      path: item.path || item.getPathByRole?.(role) || "/app/user/appointments",
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
        // minHeight: "100vh",
        height: "100%",
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
              className="rounded-circle bg-secondary-subtle d-inline-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34, flexShrink: 0, overflow: "hidden" }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={getFullName(user?.firstName, user?.lastName)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                getInitials(user?.firstName, user?.lastName)
              )}
            </div>
          )}
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="small fw-semibold text-truncate">{getFullName(user?.firstName, user?.lastName)}</div>
              <div className="small text-muted text-capitalize">{user?.role?.toUpperCase()}</div>
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
        {menu.map((item) => {
          const Icon = item.icon;

          return (
          <NavLink
            key={item.key}
            to={item.path}
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
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
