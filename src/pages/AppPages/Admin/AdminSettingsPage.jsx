// ─────────────────────────────────────────────────────────────────────────────
// AdminSettingsPage.jsx  —  Admin Settings
// Layout: sidebar menu trái + content panel phải (giống DoctorSettingsPage)
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  FaUser,
  FaCog,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaGlobe,
  FaDatabase,
  FaPalette,
  FaEnvelope,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaUpload,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaChevronRight,
  FaSpinner,
  FaDownload,
} from "react-icons/fa";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./AdminSettingsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: "profile",
    label: "Admin Profile",
    icon: FaUser,
    desc: "Personal information",
  },
  {
    key: "system",
    label: "System Settings",
    icon: FaCog,
    desc: "Core system config",
  },
  {
    key: "appearance",
    label: "Appearance",
    icon: FaPalette,
    desc: "Theme & branding",
  },
  {
    key: "email",
    label: "Email Configuration",
    icon: FaEnvelope,
    desc: "SMTP & notifications",
  },
  {
    key: "security",
    label: "Security",
    icon: FaShieldAlt,
    desc: "Access & protection",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: FaBell,
    desc: "Admin alerts",
  },
  {
    key: "database",
    label: "Database & Backup",
    icon: FaDatabase,
    desc: "Backup & data export",
  },
  {
    key: "password",
    label: "Change Password",
    icon: FaLock,
    desc: "Update credentials",
  },
];

const PRIMARY_COLORS = [
  "#0ba3a3",
  "#0d2b45",
  "#7c3aed",
  "#e24b4a",
  "#f59e0b",
  "#10b981",
];

const MOCK_BACKUPS = [
  { date: "Apr 20, 2026 02:00", size: "48.2 MB", status: "success" },
  { date: "Apr 13, 2026 02:00", size: "47.8 MB", status: "success" },
  { date: "Apr 6, 2026 02:00", size: "46.5 MB", status: "success" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SectionMenu
// ─────────────────────────────────────────────────────────────────────────────
function SectionMenu({ active, onChange }) {
  return (
    <nav className="settings-menu">
      <p className="settings-menu__heading">Admin Settings</p>
      {SECTIONS.map(({ key, label, icon: Icon, desc }) => (
        <button
          key={key}
          className={`settings-menu__item ${active === key ? "settings-menu__item--active" : ""}`}
          onClick={() => onChange(key)}
        >
          <div className="settings-menu__item-icon">
            <Icon />
          </div>
          <div className="settings-menu__item-text">
            <span className="settings-menu__item-label">{label}</span>
            <span className="settings-menu__item-desc">{desc}</span>
          </div>
          <FaChevronRight className="settings-menu__item-arrow" />
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SaveBar
// ─────────────────────────────────────────────────────────────────────────────
function SaveBar({ onSave, saved }) {
  return (
    <div className="settings-save-bar">
      <button className="settings-btn settings-btn--save" onClick={onSave}>
        {saved ? (
          <>
            <FaCheck /> Saved!
          </>
        ) : (
          <>
            <FaSave /> Save Changes
          </>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Profile
// ─────────────────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [form, setForm] = useState({
    firstName: "Admin",
    lastName: "TKT",
    email: "admin@tkt.com",
    phone: "+84 900 000 001",
  });
  const [saved, setSaved] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const initials =
    `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Admin Profile</h2>
      <p className="settings-content__sub">
        Update your administrator account details.
      </p>

      {/* Avatar */}
      <div className="profile-avatar-row">
        <div className="admin-avatar">{initials}</div>
        <div>
          <p className="profile-avatar__name">
            {form.firstName} {form.lastName}
          </p>
          <span className="admin-role-badge">System Administrator</span>
        </div>
      </div>

      <div className="settings-form">
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handle} />
          </div>
          <div className="settings-form__group">
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handle} />
          </div>
        </div>
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
            />
          </div>
          <div className="settings-form__group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handle} />
          </div>
        </div>
        <div className="settings-form__group settings-form__group--full">
          <label>Role</label>
          <input
            value="System Administrator"
            disabled
            className="input-disabled"
          />
        </div>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: System Settings
// ─────────────────────────────────────────────────────────────────────────────
function SystemSection() {
  const [form, setForm] = useState({
    siteName: "TKT Booking Care",
    siteDesc: "Vietnam's leading medical appointment platform.",
    language: "English",
    timezone: "UTC+7",
    dateFormat: "DD/MM/YYYY",
    maxAppts: "50",
    slotDuration: "30",
  });
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">System Settings</h2>
      <p className="settings-content__sub">
        Configure core platform behavior and defaults.
      </p>

      {/* Maintenance warning */}
      {maintenance && (
        <div className="maintenance-banner">
          <FaExclamationTriangle />
          <span>
            Maintenance mode is <strong>ON</strong> — the site is inaccessible
            to regular users.
          </span>
        </div>
      )}

      <div className="settings-form">
        <div className="settings-form__group settings-form__group--full">
          <label>Site Name</label>
          <input name="siteName" value={form.siteName} onChange={handle} />
        </div>
        <div className="settings-form__group settings-form__group--full">
          <label>Site Description</label>
          <textarea
            name="siteDesc"
            rows={2}
            value={form.siteDesc}
            onChange={handle}
          />
        </div>
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Default Language</label>
            <select name="language" value={form.language} onChange={handle}>
              <option>English</option>
              <option>Vietnamese</option>
            </select>
          </div>
          <div className="settings-form__group">
            <label>Timezone</label>
            <select name="timezone" value={form.timezone} onChange={handle}>
              <option value="UTC+7">UTC+7 Ho Chi Minh</option>
              <option value="UTC">UTC</option>
              <option value="UTC+8">UTC+8 Singapore</option>
            </select>
          </div>
        </div>
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Date Format</label>
            <select name="dateFormat" value={form.dateFormat} onChange={handle}>
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="settings-form__group">
            <label>Max Appointments Per Day</label>
            <input
              name="maxAppts"
              type="number"
              min="1"
              value={form.maxAppts}
              onChange={handle}
            />
          </div>
        </div>
        <div className="settings-form__group" style={{ maxWidth: 240 }}>
          <label>Slot Duration</label>
          <select
            name="slotDuration"
            value={form.slotDuration}
            onChange={handle}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        {/* Maintenance toggle */}
        <div className="notif-item">
          <div className="notif-item__text">
            <p className="notif-item__label">Maintenance Mode</p>
            <p className="notif-item__sub">
              Disable access for all non-admin users
            </p>
          </div>
          <button
            className={`notif-toggle ${maintenance ? "notif-toggle--on" : ""}`}
            onClick={() => setMaintenance(!maintenance)}
          >
            {maintenance ? <BsToggleOn /> : <BsToggleOff />}
          </button>
        </div>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Appearance
// ─────────────────────────────────────────────────────────────────────────────
function AppearanceSection() {
  const [primaryColor, setPrimaryColor] = useState(PRIMARY_COLORS[0]);
  const [hexInput, setHexInput] = useState(PRIMARY_COLORS[0]);
  const [themeMode, setThemeMode] = useState("light");
  const [sidebarStyle, setSidebarStyle] = useState("expanded");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pickColor = (c) => {
    setPrimaryColor(c);
    setHexInput(c);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Appearance</h2>
      <p className="settings-content__sub">
        Customize the look and feel of the admin panel.
      </p>

      <div className="settings-form">
        {/* Primary color */}
        <div className="settings-form__group settings-form__group--full">
          <label>Primary Color</label>
          <div className="appearance-color-row">
            <div className="app-color-swatches">
              {PRIMARY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`app-color-swatch ${primaryColor === c ? "app-color-swatch--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => pickColor(c)}
                  title={c}
                />
              ))}
            </div>
            <input
              type="text"
              className="hex-input"
              value={hexInput}
              maxLength={7}
              onChange={(e) => {
                setHexInput(e.target.value);
                if (e.target.value.length === 7)
                  setPrimaryColor(e.target.value);
              }}
              placeholder="#0ba3a3"
            />
            <div className="hex-preview" style={{ background: primaryColor }} />
          </div>
        </div>

        {/* Theme mode */}
        <div className="settings-form__group settings-form__group--full">
          <label>Theme Mode</label>
          <div className="radio-group">
            {["light", "dark", "auto"].map((m) => (
              <label
                key={m}
                className={`radio-option ${themeMode === m ? "radio-option--checked" : ""}`}
              >
                <input
                  type="radio"
                  name="themeMode"
                  value={m}
                  checked={themeMode === m}
                  onChange={() => setThemeMode(m)}
                />
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Sidebar style */}
        <div className="settings-form__group settings-form__group--full">
          <label>Sidebar Style</label>
          <div className="radio-group">
            {["expanded", "compact"].map((s) => (
              <label
                key={s}
                className={`radio-option ${sidebarStyle === s ? "radio-option--checked" : ""}`}
              >
                <input
                  type="radio"
                  name="sidebarStyle"
                  value={s}
                  checked={sidebarStyle === s}
                  onChange={() => setSidebarStyle(s)}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Logo + Favicon */}
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Logo URL</label>
            <div className="url-preview-row">
              <input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
              />
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="logo"
                  className="url-img-preview"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>
          <div className="settings-form__group">
            <label>Favicon URL</label>
            <div className="url-preview-row">
              <input
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://..."
              />
              {faviconUrl && (
                <img
                  src={faviconUrl}
                  alt="favicon"
                  className="url-img-preview"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Email Configuration
// ─────────────────────────────────────────────────────────────────────────────
function EmailSection() {
  const [form, setForm] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "no-reply@tkt.com",
    smtpPass: "",
    fromEmail: "no-reply@tkt.com",
    fromName: "TKT Booking Care",
    encryption: "TLS",
  });
  const [toggles, setToggles] = useState({
    welcome: true,
    reminders: true,
    cancellation: true,
  });
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleItem = (k) => setToggles((t) => ({ ...t, [k]: !t[k] }));
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const testEmail = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Email Configuration</h2>
      <p className="settings-content__sub">
        Configure SMTP server and email notification settings.
      </p>
      <div className="settings-form">
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>SMTP Host</label>
            <input
              name="smtpHost"
              value={form.smtpHost}
              onChange={handle}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div className="settings-form__group">
            <label>SMTP Port</label>
            <input
              name="smtpPort"
              type="number"
              value={form.smtpPort}
              onChange={handle}
              placeholder="587"
            />
          </div>
        </div>
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>SMTP Username</label>
            <input name="smtpUser" value={form.smtpUser} onChange={handle} />
          </div>
          <div className="settings-form__group">
            <label>SMTP Password</label>
            <div className="pw-wrap">
              <input
                name="smtpPass"
                type={showPw ? "text" : "password"}
                value={form.smtpPass}
                onChange={handle}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>From Email</label>
            <input name="fromEmail" value={form.fromEmail} onChange={handle} />
          </div>
          <div className="settings-form__group">
            <label>From Name</label>
            <input name="fromName" value={form.fromName} onChange={handle} />
          </div>
        </div>
        <div className="settings-form__group" style={{ maxWidth: 200 }}>
          <label>Encryption</label>
          <select name="encryption" value={form.encryption} onChange={handle}>
            <option>None</option>
            <option>TLS</option>
            <option>SSL</option>
          </select>
        </div>

        {/* Email toggles */}
        {[
          {
            key: "welcome",
            label: "Send Welcome Email",
            sub: "Email new users upon registration",
          },
          {
            key: "reminders",
            label: "Appointment Reminders",
            sub: "Send reminders 24h before appointments",
          },
          {
            key: "cancellation",
            label: "Cancellation Alerts",
            sub: "Notify when appointments are cancelled",
          },
        ].map(({ key, label, sub }) => (
          <div key={key} className="notif-item">
            <div className="notif-item__text">
              <p className="notif-item__label">{label}</p>
              <p className="notif-item__sub">{sub}</p>
            </div>
            <button
              className={`notif-toggle ${toggles[key] ? "notif-toggle--on" : ""}`}
              onClick={() => toggleItem(key)}
            >
              {toggles[key] ? <BsToggleOn /> : <BsToggleOff />}
            </button>
          </div>
        ))}
      </div>

      <div className="settings-save-bar" style={{ gap: "10px" }}>
        <button className="settings-btn settings-btn--test" onClick={testEmail}>
          {testSent ? (
            <>
              <FaCheck /> Sent!
            </>
          ) : (
            <>
              <FaEnvelope /> Test Email
            </>
          )}
        </button>
        <button className="settings-btn settings-btn--save" onClick={save}>
          {saved ? (
            <>
              <FaCheck /> Saved!
            </>
          ) : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Security
// ─────────────────────────────────────────────────────────────────────────────
function SecuritySection() {
  const [form, setForm] = useState({
    sessionTimeout: "60",
    maxAttempts: "5",
    lockoutDuration: "15",
    ipWhitelist: "",
  });
  const [toggles, setToggles] = useState({
    twoFactor: false,
    forceHttps: true,
    logActions: true,
  });
  const [saved, setSaved] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleItem = (k) => setToggles((t) => ({ ...t, [k]: !t[k] }));
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Security</h2>
      <p className="settings-content__sub">
        Control system-wide security policies and access rules.
      </p>
      <div className="settings-form">
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Session Timeout</label>
            <select
              name="sessionTimeout"
              value={form.sessionTimeout}
              onChange={handle}
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
          <div className="settings-form__group">
            <label>Max Login Attempts</label>
            <input
              name="maxAttempts"
              type="number"
              min="1"
              value={form.maxAttempts}
              onChange={handle}
            />
          </div>
        </div>
        <div className="settings-form__group" style={{ maxWidth: 240 }}>
          <label>Lockout Duration (minutes)</label>
          <input
            name="lockoutDuration"
            type="number"
            min="1"
            value={form.lockoutDuration}
            onChange={handle}
          />
        </div>

        {/* Security toggles */}
        {[
          {
            key: "twoFactor",
            label: "Two-Factor Authentication (System-wide)",
            sub: "Require 2FA for all admin users",
          },
          {
            key: "forceHttps",
            label: "Force HTTPS",
            sub: "Redirect all HTTP traffic to HTTPS",
          },
          {
            key: "logActions",
            label: "Log All User Actions",
            sub: "Record activity for audit purposes",
          },
        ].map(({ key, label, sub }) => (
          <div key={key} className="notif-item">
            <div className="notif-item__text">
              <p className="notif-item__label">{label}</p>
              <p className="notif-item__sub">{sub}</p>
            </div>
            <button
              className={`notif-toggle ${toggles[key] ? "notif-toggle--on" : ""}`}
              onClick={() => toggleItem(key)}
            >
              {toggles[key] ? <BsToggleOn /> : <BsToggleOff />}
            </button>
          </div>
        ))}

        <div className="settings-form__group settings-form__group--full">
          <label>
            IP Whitelist{" "}
            <small className="text-hint">
              (one IP per line, leave empty to allow all)
            </small>
          </label>
          <textarea
            name="ipWhitelist"
            rows={3}
            value={form.ipWhitelist}
            onChange={handle}
            placeholder={"192.168.1.1\n10.0.0.0/24"}
          />
        </div>
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Notifications
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_NOTIFS = [
  {
    key: "newDoctor",
    label: "New Doctor Registration",
    sub: "Notify when a doctor account is created",
    on: true,
  },
  {
    key: "newPatient",
    label: "New Patient Registration",
    sub: "Notify when a patient account is created",
    on: false,
  },
  {
    key: "sysAlerts",
    label: "System Alerts",
    sub: "Critical errors and server warnings",
    on: true,
  },
  {
    key: "dailyReport",
    label: "Daily Report Email",
    sub: "Summary of daily activity and stats",
    on: true,
  },
  {
    key: "weeklySummary",
    label: "Weekly Summary",
    sub: "Weekly performance and usage report",
    on: true,
  },
  {
    key: "secAlerts",
    label: "Security Alerts",
    sub: "Suspicious logins and security events",
    on: true,
  },
];

function NotificationsSection() {
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFS);
  const [saved, setSaved] = useState(false);
  const toggle = (key) =>
    setNotifs(notifs.map((n) => (n.key === key ? { ...n, on: !n.on } : n)));
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Notifications</h2>
      <p className="settings-content__sub">
        Choose which system events trigger admin notifications.
      </p>
      <div className="notif-list">
        {notifs.map(({ key, label, sub, on }) => (
          <div key={key} className="notif-item">
            <div className="notif-item__text">
              <p className="notif-item__label">{label}</p>
              <p className="notif-item__sub">{sub}</p>
            </div>
            <button
              className={`notif-toggle ${on ? "notif-toggle--on" : ""}`}
              onClick={() => toggle(key)}
            >
              {on ? <BsToggleOn /> : <BsToggleOff />}
            </button>
          </div>
        ))}
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Database & Backup
// ─────────────────────────────────────────────────────────────────────────────
function DatabaseSection() {
  const [backing, setBacking] = useState(false);
  const [backupDone, setBackupDone] = useState(false);

  const handleBackup = () => {
    setBacking(true);
    setTimeout(() => {
      setBacking(false);
      setBackupDone(true);
      setTimeout(() => setBackupDone(false), 3000);
    }, 2500);
  };

  const dbInfo = [
    { label: "Database Name", val: "tkt_booking_db" },
    { label: "Database Size", val: "48.2 MB" },
    { label: "Last Backup", val: "Apr 20, 2026 02:00 AM" },
    { label: "Total Records", val: "42,381 records" },
  ];

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Database & Backup</h2>
      <p className="settings-content__sub">
        Manage database backups and data exports.
      </p>

      {/* DB Info (read-only) */}
      <div className="db-info-grid">
        {dbInfo.map(({ label, val }) => (
          <div key={label} className="db-info-item">
            <p className="db-info-item__label">{label}</p>
            <p className="db-info-item__val">{val}</p>
          </div>
        ))}
      </div>

      {/* Backup actions */}
      <div className="db-actions">
        <button
          className="settings-btn settings-btn--backup"
          onClick={handleBackup}
          disabled={backing}
        >
          {backing ? (
            <>
              <FaSpinner className="spin" /> Backing up...
            </>
          ) : backupDone ? (
            <>
              <FaCheck /> Backup Done!
            </>
          ) : (
            <>
              <FaDatabase /> Backup Now
            </>
          )}
        </button>
        <button className="settings-btn settings-btn--export">
          <FaDownload /> Export Data (CSV)
        </button>
        <button className="settings-btn settings-btn--export">
          <FaDownload /> Export Data (JSON)
        </button>
      </div>

      {/* Backup history */}
      <div className="backup-history">
        <p className="backup-history__title">Recent Backups</p>
        {MOCK_BACKUPS.map((b, i) => (
          <div key={i} className="backup-row">
            <span className="backup-row__date">
              <FaDatabase /> {b.date}
            </span>
            <span className="backup-row__size">{b.size}</span>
            <span className="backup-row__status">
              <FaCheck /> {b.status}
            </span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="danger-zone">
        <p className="danger-zone__title">Danger Zone</p>
        <div className="danger-zone__row">
          <div>
            <p className="danger-zone__label">Clear Cache</p>
            <p className="danger-zone__sub">
              Clear all cached data. Users may experience slower load times
              temporarily.
            </p>
          </div>
          <button className="settings-btn settings-btn--danger-outline">
            Clear Cache
          </button>
        </div>
        <div className="danger-zone__row" style={{ marginTop: "1rem" }}>
          <div>
            <p className="danger-zone__label">Reset All Settings</p>
            <p className="danger-zone__sub">
              Reset all system settings to factory defaults. This cannot be
              undone.
            </p>
          </div>
          <button className="settings-btn settings-btn--danger">
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Change Password
// ─────────────────────────────────────────────────────────────────────────────
function PasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggle = (k) => setShow({ ...show, [k]: !show[k] });

  const save = () => {
    if (form.next !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (form.next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setSaved(true);
    setForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setSaved(false), 2000);
  };

  const strength = !form.next
    ? 0
    : form.next.length < 6
      ? 1
      : form.next.length < 10
        ? 2
        : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthClass = ["", "weak", "fair", "strong"];

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Change Password</h2>
      <p className="settings-content__sub">
        Update your admin account password regularly for security.
      </p>

      <div className="settings-form" style={{ maxWidth: 480 }}>
        {["current", "next", "confirm"].map((key) => (
          <div
            key={key}
            className="settings-form__group settings-form__group--full"
          >
            <label>
              {key === "current"
                ? "Current Password"
                : key === "next"
                  ? "New Password"
                  : "Confirm New Password"}
            </label>
            <div className="pw-wrap">
              <input
                name={key}
                type={show[key] ? "text" : "password"}
                value={form[key]}
                onChange={handle}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => toggle(key)}
              >
                {show[key] ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {key === "next" && form.next && (
              <div className="pw-strength">
                <div
                  className={`pw-strength__bar pw-strength__bar--${strengthClass[strength]}`}
                >
                  <span style={{ width: `${strength * 33.3}%` }} />
                </div>
                <span
                  className={`pw-strength__label pw-strength__label--${strengthClass[strength]}`}
                >
                  {strengthLabel[strength]}
                </span>
              </div>
            )}
          </div>
        ))}
        {error && <p className="settings-error">{error}</p>}
      </div>
      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION MAP
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_MAP = {
  profile: <ProfileSection />,
  system: <SystemSection />,
  appearance: <AppearanceSection />,
  email: <EmailSection />,
  security: <SecuritySection />,
  notifications: <NotificationsSection />,
  database: <DatabaseSection />,
  password: <PasswordSection />,
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <h1 className="settings-page__title">Settings</h1>
        <p className="settings-page__subtitle">
          Manage system configuration and admin preferences.
        </p>
      </div>
      <div className="settings-body">
        <SectionMenu active={activeSection} onChange={setActiveSection} />
        <div className="settings-panel">{SECTION_MAP[activeSection]}</div>
      </div>
    </div>
  );
}
