// ─────────────────────────────────────────────────────────────────────────────
// UserSettingsPage.jsx
// Layout: sidebar trái (menu section) + content phải (form từng section)
// Sections: Profile · Change Password · Notifications · Privacy · Language
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaGlobe,
  FaCamera,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaChevronRight,
} from "react-icons/fa";
import { BsPersonBadgeFill, BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./UserSettingsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG – danh sách section menu
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    key: "profile",
    label: "Profile",
    icon: FaUser,
    desc: "Personal information",
  },
  {
    key: "password",
    label: "Change Password",
    icon: FaLock,
    desc: "Update credentials",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: FaBell,
    desc: "Alerts & reminders",
  },
  {
    key: "privacy",
    label: "Privacy & Security",
    icon: FaShieldAlt,
    desc: "Account protection",
  },
  {
    key: "language",
    label: "Language & Region",
    icon: FaGlobe,
    desc: "Locale preferences",
  },
];

// ── Mock user data ────────────────────────────────────────────────────────
const mockUser = {
  firstName: " van de quy",
  lastName: "nguyen",
  email: "nvdequy@example.com",
  phone: "+84 909 123 456",
  dob: "1995-06-15",
  gender: "male",
  address: "97 Man Thien, Thu Duc, Ho Chi Minh City",
  avatar: "DQ",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SectionMenu (sidebar trái)
// ─────────────────────────────────────────────────────────────────────────────
function SectionMenu({ active, onChange }) {
  return (
    <nav className="settings-menu">
      <p className="settings-menu__heading">Settings</p>
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
// SUB-COMPONENT: SaveBar – nút lưu dùng chung
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
          "Save Changes"
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Profile
// ─────────────────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [form, setForm] = useState(mockUser);
  const [saved, setSaved] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Profile Information</h2>
      <p className="settings-content__sub">
        Update your personal details here.
      </p>

      {/* ── Avatar ── */}
      <div className="profile-avatar-row">
        <div className="profile-avatar">
          <span>{form.avatar}</span>
          <button className="profile-avatar__edit" title="Change avatar">
            <FaCamera />
          </button>
        </div>
        <div>
          <p className="profile-avatar__name">
            {form.firstName} {form.lastName}
          </p>
          <p className="profile-avatar__email">{form.email}</p>
        </div>
      </div>

      {/* ── Form ── */}
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

        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Date of Birth</label>
            <input name="dob" type="date" value={form.dob} onChange={handle} />
          </div>
          <div className="settings-form__group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handle}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Address</label>
          <input name="address" value={form.address} onChange={handle} />
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} />
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
  const toggle = (key) => setShow({ ...show, [key]: !show[key] });

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

  // ── Strength indicator ──
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
        Choose a strong password to keep your account safe.
      </p>

      <div className="settings-form" style={{ maxWidth: 480 }}>
        {/* Current password */}
        {["current", "next", "confirm"].map((key) => (
          <div
            className="settings-form__group settings-form__group--full"
            key={key}
          >
            <label>
              {key === "current"
                ? "Current Password"
                : key === "next"
                  ? "New Password"
                  : "Confirm New Password"}
            </label>
            <div className="input-password">
              <input
                name={key}
                type={show[key] ? "text" : "password"}
                value={form[key]}
                onChange={handle}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="input-password__toggle"
                onClick={() => toggle(key)}
              >
                {show[key] ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Strength bar chỉ hiện ở ô "New Password" */}
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
// SECTION: Notifications
// ─────────────────────────────────────────────────────────────────────────────
const defaultNotifs = [
  { key: "appt_email", label: "Appointment Reminders", sub: "Email", on: true },
  { key: "appt_sms", label: "Appointment Reminders", sub: "SMS", on: true },
  {
    key: "result_email",
    label: "Lab Result Available",
    sub: "Email",
    on: true,
  },
  {
    key: "result_push",
    label: "Lab Result Available",
    sub: "Push notification",
    on: false,
  },
  { key: "promo_email", label: "Health Tips & News", sub: "Email", on: false },
  { key: "security", label: "Security Alerts", sub: "Email & SMS", on: true },
];

function NotificationsSection() {
  const [notifs, setNotifs] = useState(defaultNotifs);
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
        Choose how and when you want to be notified.
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
              aria-label={`Toggle ${label}`}
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
// SECTION: Privacy & Security
// ─────────────────────────────────────────────────────────────────────────────
const defaultPrivacy = [
  {
    key: "2fa",
    label: "Two-Factor Authentication",
    sub: "Add an extra layer of security",
    on: false,
  },
  {
    key: "activity",
    label: "Login Activity Alerts",
    sub: "Get notified on new device logins",
    on: true,
  },
  {
    key: "profile_vis",
    label: "Profile Visibility",
    sub: "Allow doctors to view your profile",
    on: true,
  },
  {
    key: "data_share",
    label: "Data Sharing",
    sub: "Share anonymized data for research",
    on: false,
  },
];

function PrivacySection() {
  const [items, setItems] = useState(defaultPrivacy);
  const [saved, setSaved] = useState(false);

  const toggle = (key) =>
    setItems(items.map((i) => (i.key === key ? { ...i, on: !i.on } : i)));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Privacy & Security</h2>
      <p className="settings-content__sub">
        Control your data and account security settings.
      </p>

      <div className="notif-list">
        {items.map(({ key, label, sub, on }) => (
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

      {/* Danger zone */}
      <div className="danger-zone">
        <p className="danger-zone__title">Danger Zone</p>
        <div className="danger-zone__row">
          <div>
            <p className="danger-zone__label">Delete Account</p>
            <p className="danger-zone__sub">
              Permanently delete your account and all data.
            </p>
          </div>
          <button className="settings-btn settings-btn--danger">
            Delete Account
          </button>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Language & Region
// ─────────────────────────────────────────────────────────────────────────────
function LanguageSection() {
  const [form, setForm] = useState({
    language: "en",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
  });
  const [saved, setSaved] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Language & Region</h2>
      <p className="settings-content__sub">
        Set your preferred language, timezone, and date format.
      </p>

      <div className="settings-form" style={{ maxWidth: 520 }}>
        <div className="settings-form__group settings-form__group--full">
          <label>Display Language</label>
          <select name="language" value={form.language} onChange={handle}>
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Timezone</label>
          <select name="timezone" value={form.timezone} onChange={handle}>
            <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (UTC+7)</option>
            <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            <option value="America/New_York">America/New York (UTC-5)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
          </select>
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Date Format</label>
          <select name="dateFormat" value={form.dateFormat} onChange={handle}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP section key → component
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_MAP = {
  profile: <ProfileSection />,
  password: <PasswordSection />,
  notifications: <NotificationsSection />,
  privacy: <PrivacySection />,
  language: <LanguageSection />,
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UserSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="settings-page">
      {/* ── Page header ── */}
      <div className="settings-page__header">
        <h1 className="settings-page__title">Settings</h1>
        <p className="settings-page__subtitle">
          Manage your account preferences.
        </p>
      </div>

      {/* ── Body: menu trái + content phải ── */}
      <div className="settings-body">
        <SectionMenu active={activeSection} onChange={setActiveSection} />
        <div className="settings-panel">{SECTION_MAP[activeSection]}</div>
      </div>
    </div>
  );
}
