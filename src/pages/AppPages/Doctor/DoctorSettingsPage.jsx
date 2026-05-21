// ─────────────────────────────────────────────────────────────────────────────
// DoctorSettingsPage.jsx
// Layout: sidebar menu trái + content panel phải
// Sections: Profile · Professional · Password · Schedule · Notifications · Privacy
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  FaUser, FaLock, FaBell, FaShieldAlt,
  FaCamera, FaCheck, FaEye, FaEyeSlash,
  FaChevronRight, FaStethoscope, FaHospital,
  FaIdCard, FaClock, FaStar,
} from "react-icons/fa";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./DoctorSettingsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { key: "profile",       label: "Profile",             icon: FaUser,         desc: "Personal information"     },
  { key: "professional",  label: "Professional Info",   icon: FaStethoscope,  desc: "Specialty & credentials"  },
  { key: "password",      label: "Change Password",     icon: FaLock,         desc: "Update credentials"       },
  { key: "schedule",      label: "Schedule Settings",   icon: FaClock,        desc: "Working hours & slots"    },
  { key: "notifications", label: "Notifications",       icon: FaBell,         desc: "Alerts & reminders"       },
  { key: "privacy",       label: "Privacy & Security",  icon: FaShieldAlt,    desc: "Account protection"       },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_OPTIONS = [
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
];

const SPECIALTIES = [
  "Cardiology","Neurology","Dermatology","Orthopedics",
  "Pediatrics","Ophthalmology","Gynecology","Oncology",
  "Psychiatry","Endocrinology","Gastroenterology","General Practice",
];

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
          <div className="settings-menu__item-icon"><Icon /></div>
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
        {saved ? <><FaCheck /> Saved!</> : "Save Changes"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Profile
// ─────────────────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [form, setForm] = useState({
    firstName: "Nguyen Van", lastName: "An",
    email: "dr.nguyen@tktcare.com", phone: "+84 912 345 678",
    dob: "1985-03-20", gender: "male",
    address: "123 Le Loi, District 1, HCMC",
  });
  const [saved, setSaved] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Profile Information</h2>
      <p className="settings-content__sub">Update your personal details here.</p>

      {/* Avatar */}
      <div className="profile-avatar-row">
        <div className="profile-avatar">
          <img
            src="https://i.pravatar.cc/150?img=32"
            alt="Doctor avatar"
            className="profile-avatar__img"
            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Dr+An&background=0ba3a3&color=fff"; }}
          />
          <button className="profile-avatar__edit" title="Change avatar">
            <FaCamera />
          </button>
        </div>
        <div>
          <p className="profile-avatar__name">{form.firstName} {form.lastName}</p>
          <p className="profile-avatar__email">{form.email}</p>
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
            <input name="email" type="email" value={form.email} onChange={handle} />
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
// SECTION: Professional Info (Doctor only)
// ─────────────────────────────────────────────────────────────────────────────
function ProfessionalSection() {
  const [form, setForm] = useState({
    specialty: "Cardiology",
    experience: "10",
    licenseNumber: "VN-MED-2015-4521",
    hospital: "TKT Medical Center",
    bio: "Board-certified cardiologist with over 10 years of experience in interventional cardiology and heart failure management.",
    consultationFee: "500000",
  });
  const [saved, setSaved] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Professional Information</h2>
      <p className="settings-content__sub">
        This information is displayed on your public doctor profile.
      </p>

      <div className="settings-form">
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Specialty</label>
            <select name="specialty" value={form.specialty} onChange={handle}>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="settings-form__group">
            <label>Years of Experience</label>
            <div className="input-suffix-wrap">
              <input name="experience" type="number" min="0" max="60" value={form.experience} onChange={handle} />
              <span className="input-suffix">yrs</span>
            </div>
          </div>
        </div>

        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Medical License Number</label>
            <input name="licenseNumber" value={form.licenseNumber} onChange={handle} placeholder="VN-MED-XXXX-XXXX" />
          </div>
          <div className="settings-form__group">
            <label>Hospital / Clinic Affiliation</label>
            <input name="hospital" value={form.hospital} onChange={handle} />
          </div>
        </div>

        <div className="settings-form__group settings-form__group--full">
          <label>Bio / Introduction</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handle}
            rows={4}
            placeholder="Write a short introduction about yourself..."
            style={{ resize: "vertical" }}
          />
          <span className="settings-form__hint">{form.bio.length} / 300 characters</span>
        </div>

        <div className="settings-form__group" style={{ maxWidth: 240 }}>
          <label>Consultation Fee</label>
          <div className="input-suffix-wrap">
            <input name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handle} />
            <span className="input-suffix">VND</span>
          </div>
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
  const [form, setForm]   = useState({ current: "", next: "", confirm: "" });
  const [show, setShow]   = useState({ current: false, next: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggle = (key) => setShow({ ...show, [key]: !show[key] });

  const save = () => {
    if (form.next !== form.confirm) { setError("New passwords do not match."); return; }
    if (form.next.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setSaved(true);
    setForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setSaved(false), 2000);
  };

  const strength = !form.next ? 0 : form.next.length < 6 ? 1 : form.next.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthClass = ["", "weak", "fair", "strong"];

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Change Password</h2>
      <p className="settings-content__sub">Choose a strong password to keep your account safe.</p>

      <div className="settings-form" style={{ maxWidth: 480 }}>
        {["current", "next", "confirm"].map((key) => (
          <div className="settings-form__group settings-form__group--full" key={key}>
            <label>
              {key === "current" ? "Current Password" : key === "next" ? "New Password" : "Confirm New Password"}
            </label>
            <div className="input-password">
              <input name={key} type={show[key] ? "text" : "password"} value={form[key]} onChange={handle} placeholder="••••••••" />
              <button type="button" className="input-password__toggle" onClick={() => toggle(key)}>
                {show[key] ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {key === "next" && form.next && (
              <div className="pw-strength">
                <div className={`pw-strength__bar pw-strength__bar--${strengthClass[strength]}`}>
                  <span style={{ width: `${strength * 33.3}%` }} />
                </div>
                <span className={`pw-strength__label pw-strength__label--${strengthClass[strength]}`}>
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
// SECTION: Schedule Settings (Doctor only)
// ─────────────────────────────────────────────────────────────────────────────
function ScheduleSection() {
  const [workingDays, setWorkingDays] = useState(
    { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false }
  );
  const [form, setForm] = useState({
    startTime: "08:00", endTime: "17:00",
    slotDuration: "30",
    maxAppointments: "16",
    breakStart: "12:00", breakEnd: "13:00",
  });
  const [saved, setSaved] = useState(false);

  const toggleDay = (day) => setWorkingDays({ ...workingDays, [day]: !workingDays[day] });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Schedule Settings</h2>
      <p className="settings-content__sub">Configure your working hours and appointment slots.</p>

      <div className="settings-form">

        {/* Working Days */}
        <div className="settings-form__group settings-form__group--full">
          <label>Working Days</label>
          <div className="day-checkboxes">
            {DAYS.map((day) => (
              <label key={day} className={`day-checkbox ${workingDays[day] ? "day-checkbox--checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={workingDays[day]}
                  onChange={() => toggleDay(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="settings-form__row">
          <div className="settings-form__group">
            <label>Start Time</label>
            <select name="startTime" value={form.startTime} onChange={handle}>
              {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="settings-form__group">
            <label>End Time</label>
            <select name="endTime" value={form.endTime} onChange={handle}>
              {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Slot Duration */}
        <div className="settings-form__group settings-form__group--full">
          <label>Appointment Slot Duration</label>
          <div className="radio-group">
            {["30", "45", "60"].map((val) => (
              <label key={val} className={`radio-option ${form.slotDuration === val ? "radio-option--checked" : ""}`}>
                <input
                  type="radio"
                  name="slotDuration"
                  value={val}
                  checked={form.slotDuration === val}
                  onChange={handle}
                />
                {val} min
              </label>
            ))}
          </div>
        </div>

        {/* Max appointments */}
        <div className="settings-form__group" style={{ maxWidth: 220 }}>
          <label>Max Appointments Per Day</label>
          <div className="input-suffix-wrap">
            <input name="maxAppointments" type="number" min="1" max="50" value={form.maxAppointments} onChange={handle} />
            <span className="input-suffix">slots</span>
          </div>
        </div>

        {/* Break Time */}
        <div className="settings-form__group settings-form__group--full">
          <label>Break Time (Lunch)</label>
          <div className="settings-form__row" style={{ marginTop: 0 }}>
            <div className="settings-form__group">
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted, #6b7f8e)" }}>Break Start</label>
              <select name="breakStart" value={form.breakStart} onChange={handle}>
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="settings-form__group">
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted, #6b7f8e)" }}>Break End</label>
              <select name="breakEnd" value={form.breakEnd} onChange={handle}>
                {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION: Notifications (Doctor-specific)
// ─────────────────────────────────────────────────────────────────────────────
const defaultNotifs = [
  { key: "new_appt_email",   label: "New Appointment Booking",    sub: "Email",              on: true  },
  { key: "new_appt_sms",     label: "New Appointment Booking",    sub: "SMS",                on: true  },
  { key: "cancel_email",     label: "Appointment Cancellation",   sub: "Email",              on: true  },
  { key: "patient_msg_push", label: "Patient Messages",           sub: "Push notification",  on: true  },
  { key: "daily_reminder",   label: "Daily Schedule Reminder",    sub: "Email",              on: true  },
  { key: "system_alerts",    label: "System Alerts",              sub: "Email",              on: false },
];

function NotificationsSection() {
  const [notifs, setNotifs] = useState(defaultNotifs);
  const [saved, setSaved]   = useState(false);
  const toggle = (key) => setNotifs(notifs.map((n) => n.key === key ? { ...n, on: !n.on } : n));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Notifications</h2>
      <p className="settings-content__sub">Choose how you want to receive alerts and updates.</p>
      <div className="notif-list">
        {notifs.map(({ key, label, sub, on }) => (
          <div key={key} className="notif-item">
            <div className="notif-item__text">
              <p className="notif-item__label">{label}</p>
              <p className="notif-item__sub">{sub}</p>
            </div>
            <button className={`notif-toggle ${on ? "notif-toggle--on" : ""}`} onClick={() => toggle(key)}>
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
// SECTION: Privacy & Security (Doctor-specific additions)
// ─────────────────────────────────────────────────────────────────────────────
const defaultPrivacy = [
  { key: "profile_vis",     label: "Profile Visibility to Patients",  sub: "Allow patients to find and view your profile",     on: true  },
  { key: "show_fee",        label: "Show Consultation Fee Publicly",   sub: "Display your fee on the public listing",           on: true  },
  { key: "allow_reviews",   label: "Allow Patient Reviews",           sub: "Let patients leave ratings and feedback",          on: true  },
  { key: "2fa",             label: "Two-Factor Authentication",       sub: "Add an extra layer of account security",           on: false },
  { key: "login_alerts",    label: "Login Activity Alerts",           sub: "Get notified on new device logins",                on: true  },
  { key: "data_share",      label: "Anonymized Data Sharing",         sub: "Contribute anonymized data for medical research",  on: false },
];

function PrivacySection() {
  const [items, setItems] = useState(defaultPrivacy);
  const [saved, setSaved] = useState(false);
  const toggle = (key) => setItems(items.map((i) => i.key === key ? { ...i, on: !i.on } : i));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="settings-content">
      <h2 className="settings-content__title">Privacy & Security</h2>
      <p className="settings-content__sub">Control your visibility and account security settings.</p>
      <div className="notif-list">
        {items.map(({ key, label, sub, on }) => (
          <div key={key} className="notif-item">
            <div className="notif-item__text">
              <p className="notif-item__label">{label}</p>
              <p className="notif-item__sub">{sub}</p>
            </div>
            <button className={`notif-toggle ${on ? "notif-toggle--on" : ""}`} onClick={() => toggle(key)}>
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
            <p className="danger-zone__sub">Permanently delete your doctor account and all associated data.</p>
          </div>
          <button className="settings-btn settings-btn--danger">Delete Account</button>
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
  profile:       <ProfileSection />,
  professional:  <ProfessionalSection />,
  password:      <PasswordSection />,
  schedule:      <ScheduleSection />,
  notifications: <NotificationsSection />,
  privacy:       <PrivacySection />,
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="settings-page">

      {/* Page header */}
      <div className="settings-page__header">
        <h1 className="settings-page__title">Settings</h1>
        <p className="settings-page__subtitle">Manage your account and doctor profile preferences.</p>
      </div>

      {/* Body: menu trái + panel phải */}
      <div className="settings-body">
        <SectionMenu active={activeSection} onChange={setActiveSection} />
        <div className="settings-panel">
          {SECTION_MAP[activeSection]}
        </div>
      </div>

    </div>
  );
}
