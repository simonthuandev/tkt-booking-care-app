import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, logoutAll } from "../../store/slices/authSlice";
import "./UserDropdown.scss";
import { FiGrid, FiLogOut, FiSettings } from "react-icons/fi";
import { getRoleLandingPath, getRoleSettingsPath } from "../../utils/rolePaths";

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

const AvatarCircle = ({ user, className }) => {
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <div className={className}>
      {user?.avatar ? (
        <img src={user.avatar} alt={getFullName(user.firstName, user.lastName)} />
      ) : (
        initials
      )}
    </div>
  );
};

// ─── UserDropdown ─────────────────────────────────────────────────────────────
const UserDropdown = ({ user, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  const openLogoutConfirm = () => {
    setOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleLogout = async (allDevices = false) => {
    setIsLoggingOut(true);
    const action = allDevices ? logoutAll : logout;

    await dispatch(action());
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
    onClose?.();
    navigate("/auth/login", { replace: true });
  };

  const handleNavigate = (path) => {
    setOpen(false);
    onClose?.();
    navigate(path);
  };

  const dashboardPath = getRoleLandingPath(user.role);
  const settingsPath  = getRoleSettingsPath(user.role);
  const fullName      = getFullName(user.firstName, user.lastName);

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
        <AvatarCircle user={user} className="hc-avatar" />
        <span className="hc-avatar-caret">▾</span>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="hc-dropdown-panel" role="menu">
          {/* Header — tên + email */}
          <div className="hc-dropdown-header">
            <AvatarCircle user={user} className="hc-dropdown-avatar" />
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
            onClick={openLogoutConfirm}
          >
            <FiLogOut className="hc-dropdown-icon" />
            Đăng xuất
          </button>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="hc-logout-modal" role="dialog" aria-modal="true">
          <div className="hc-logout-card">
            <div className="hc-logout-icon">
              <FiLogOut />
            </div>
            <h3>Đăng xuất tài khoản?</h3>
            <p>Chọn cách bạn muốn kết thúc phiên đăng nhập.</p>

            <div className="hc-logout-actions">
              <button
                type="button"
                className="hc-logout-btn hc-logout-btn--primary"
                onClick={() => handleLogout(false)}
                disabled={isLoggingOut}
              >
                Đăng xuất phiên hiện tại
              </button>
              <button
                type="button"
                className="hc-logout-btn hc-logout-btn--danger"
                onClick={() => handleLogout(true)}
                disabled={isLoggingOut}
              >
                Đăng xuất tất cả thiết bị
              </button>
              <button
                type="button"
                className="hc-logout-btn hc-logout-btn--ghost"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
