import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { BrandLogo } from "./Common/BrandLogo";
import "./NavBar.scss";

// ─── Nav links config ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Chuyên khoa", to: "/specialties" },
  { label: "Cơ sở y tế",  to: "/hospitals"   },
  { label: "Bác sĩ",      to: "/doctors"     },
  { label: "Dịch vụ",    to: "/services"    },
];

// ─── Helper: lấy chữ viết tắt từ tên ────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "U";

// ─── NavBar ───────────────────────────────────────────────────────────────────
const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  // Thêm shadow khi scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`hc-navbar navbar navbar-expand-lg${scrolled ? " scrolled" : ""}`}>
      <div className="container">

        {/* ── Brand ── */}
        <BrandLogo />

        {/* ── Mobile toggler ── */}
        <button
          className="navbar-toggler hc-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hcNavCollapse"
          aria-controls="hcNavCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ── Collapsible content ── */}
        <div className="collapse navbar-collapse hc-collapse-panel" id="hcNavCollapse">

          {/* Center menu */}
          <ul className="hc-nav-menu mx-auto">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `hc-nav-link${isActive ? " active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="hc-actions">

            {/* Search */}
            <button
              className="hc-search-btn"
              onClick={() => navigate("/search")}
              aria-label="Tìm kiếm"
            >
              <BsSearch />
              Tìm kiếm
            </button>

            {/* Vertical divider — desktop only */}
            <div className="hc-divider d-none d-lg-block" />

            {/* Auth section */}
            {isAuthenticated && user ? (
              <NavLink to={`/app/${user.role || ""}/dashboard`} className="hc-user-chip">
                <div className="hc-avatar" title={user.name}>
                  {getInitials(user.name)}
                </div>
                <span className="hc-username">{user.name}</span>
              </NavLink>
            ) : (
              <NavLink to="/auth/login" className="hc-login-btn">
                <FiUser />
                Đăng nhập
              </NavLink>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
