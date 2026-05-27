import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import "./UserDropdown.scss";
import { FiGrid, FiLogOut, FiSettings } from "react-icons/fi";

// ─── Helper: lấy initials từ firstName + lastName ────────────────────────────
const getInitials = (firstName = "", lastName = "") => {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  return (f + l) || "U";
};

// ─── Helper: full name ────────────────────────────────────────────────────────
const getFullName = (firstName = "", lastName = "") => {
  const full = `${firstName} ${lastName}`.trim();
  return full || "Người dùng";
};

// ─── UserDropdown ─────────────────────────────────────────────────────────────
const UserDropdown = ({ user, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Click outside → đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    onClose?.();
    await dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  const handleNavigate = (path) => {
    setOpen(false);
    onClose?.();
    navigate(path);
  };

  const dashboardPath = `/app/${user.role || "user"}/dashboard`;
  const settingsPath  = `/app/${user.role || "user"}/settings`;
  const fullName      = getFullName(user.firstName, user.lastName);
  const initials      = getInitials(user.firstName, user.lastName);

  return (
    <div className="hc-user-dropdown-wrapper" ref={ref}>
      {/* ── Avatar trigger button ── */}
      <button
        type="button"
        className={`hc-avatar-btn${open ? " active" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Tài khoản"
      >
        <div className="hc-avatar">
          {initials}
        </div>
        <span className="hc-avatar-caret">▾</span>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="hc-dropdown-panel" role="menu">
          {/* Header — tên + email */}
          <div className="hc-dropdown-header">
            <div className="hc-dropdown-avatar">{initials}</div>
            <div className="hc-dropdown-info">
              <span className="hc-dropdown-name">{fullName}</span>
              <span className="hc-dropdown-email">{user.email}</span>
            </div>
          </div>

          <div className="hc-dropdown-divider" />

          {/* Menu items */}
          <button
            type="button"
            className="hc-dropdown-item"
            role="menuitem"
            onClick={() => handleNavigate(dashboardPath)}
          >
            <FiGrid className="hc-dropdown-icon" />
            Dashboard
          </button>

          <button
            type="button"
            className="hc-dropdown-item"
            role="menuitem"
            onClick={() => handleNavigate(settingsPath)}
          >
            <FiSettings className="hc-dropdown-icon" />
            Cài đặt
          </button>

          <div className="hc-dropdown-divider" />

          <button
            type="button"
            className="hc-dropdown-item hc-dropdown-item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            <FiLogOut className="hc-dropdown-icon" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;