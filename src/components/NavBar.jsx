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
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`hc-navbar navbar navbar-expand-lg${scrolled ? " scrolled" : ""}`}>
      <div className="container">

        <BrandLogo />

        {/* ── Mobile toggler ── */}
        <button
          className="navbar-toggler hc-toggler ms-auto"
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ── Collapsible content ── */}
        <div className={`collapse navbar-collapse hc-collapse-panel${menuOpen ? " show" : ""}`}>

          <ul className="hc-nav-menu mx-auto">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `hc-nav-link${isActive ? " active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hc-actions">
            <button
              className="hc-search-btn"
              onClick={() => { navigate("/search"); setMenuOpen(false); }}
              aria-label="Tìm kiếm"
            >
              <BsSearch />
              Tìm kiếm
            </button>

            <div className="hc-divider d-none d-lg-block" />

            {isAuthenticated && user ? (
              <NavLink
                to={`/app/${user.role || ""}/dashboard`}
                className="hc-user-chip"
                onClick={() => setMenuOpen(false)}
              >
                <div className="hc-avatar" title={user.name}>
                  {getInitials(user.name)}
                </div>
                <span className="hc-username">{user.name}</span>
              </NavLink>
            ) : (
              <NavLink
                to="/auth/login"
                className="hc-login-btn"
                onClick={() => setMenuOpen(false)}
              >
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
