// ─────────────────────────────────────────────────────────────────────────────
// UserAppointmentsPage.jsx
// Trang quản lý lịch hẹn của user – tabs Upcoming / History
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  BsCalendar2WeekFill,
  BsClockFill,
  BsFileEarmarkMedicalFill,
} from "react-icons/bs";
import {
  FaHospital,
  FaRedo,
  FaTimes,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaBan,
} from "react-icons/fa";
import "./UserAppointmentsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockAppointments = [
  // ── Upcoming ──────────────────────────────────────────────────────────────
  {
    id: 1,
    tab: "upcoming",
    doctor: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    date: "Thu, Apr 17, 2026",
    time: "09:00 AM",
    location: "TKT Medical Center – Room 302",
    status: "confirmed",
    avatar: "NA",
    avatarColor: "#0ba3a3",
  },
  {
    id: 2,
    tab: "upcoming",
    doctor: "Dr. Le Thi Bich",
    specialty: "Neurology",
    date: "Sat, Apr 19, 2026",
    time: "02:30 PM",
    location: "City Hospital – Room 105",
    status: "pending",
    avatar: "LB",
    avatarColor: "#f5a623",
  },
  {
    id: 3,
    tab: "upcoming",
    doctor: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    date: "Mon, Apr 21, 2026",
    time: "10:00 AM",
    location: "Skin & Care Clinic – Room 201",
    status: "confirmed",
    avatar: "TH",
    avatarColor: "#077d7d",
  },

  // ── History ───────────────────────────────────────────────────────────────
  {
    id: 4,
    tab: "history",
    doctor: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    date: "Mon, Apr 7, 2026",
    time: "08:00 AM",
    location: "Bone & Joint Hospital – Room 401",
    status: "completed",
    avatar: "PM",
    avatarColor: "#1a9e5c",
  },
  {
    id: 5,
    tab: "history",
    doctor: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    date: "Wed, Mar 26, 2026",
    time: "03:00 PM",
    location: "Eye Care Center – Room 102",
    status: "cancelled",
    avatar: "VL",
    avatarColor: "#ff6b35",
  },
  {
    id: 6,
    tab: "history",
    doctor: "Dr. Hoang Van Nam",
    specialty: "Pediatrics",
    date: "Fri, Mar 14, 2026",
    time: "11:00 AM",
    location: "Children's Hospital – Room 203",
    status: "completed",
    avatar: "HN",
    avatarColor: "#534ab7",
  },
];

// ── Cấu hình badge theo trạng thái ─────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    icon: FaCheckCircle,
    className: "badge--confirmed",
  },
  pending: {
    label: "Pending",
    icon: FaClock,
    className: "badge--pending",
  },
  completed: {
    label: "Completed",
    icon: FaCheckCircle,
    className: "badge--completed",
  },
  cancelled: {
    label: "Cancelled",
    icon: FaBan,
    className: "badge--cancelled",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AppointmentCard
// ─────────────────────────────────────────────────────────────────────────────
function AppointmentCard({ appointment, tab }) {
  const {
    doctor,
    specialty,
    date,
    time,
    location,
    status,
    avatar,
    avatarColor,
  } = appointment;

  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="appt-card">
      {/* ── Left: Avatar ───────────────────────────────── */}
      <div className="appt-card__avatar" style={{ background: avatarColor }}>
        {avatar}
      </div>

      {/* ── Center: Info ───────────────────────────────── */}
      <div className="appt-card__info">
        <p className="appt-card__doctor">{doctor}</p>

        <p className="appt-card__specialty">
          <FaHospital />
          {specialty}
        </p>

        <div className="appt-card__meta">
          <span className="appt-card__meta-item">
            <BsCalendar2WeekFill />
            {date}
          </span>
          <span className="appt-card__meta-item">
            <BsClockFill />
            {time}
          </span>
          <span className="appt-card__meta-item appt-card__meta-item--location">
            <BsFileEarmarkMedicalFill />
            {location}
          </span>
        </div>
      </div>

      {/* ── Right: Status + Actions ────────────────────── */}
      <div className="appt-card__right">
        {/* Status badge */}
        <span className={`appt-badge ${statusCfg.className}`}>
          <StatusIcon />
          {statusCfg.label}
        </span>

        {/* Action buttons */}
        <div className="appt-card__actions">
          {tab === "upcoming" ? (
            <>
              <button className="appt-btn appt-btn--reschedule">
                <FaRedo />
                Reschedule
              </button>
              <button className="appt-btn appt-btn--cancel">
                <FaTimes />
                Cancel
              </button>
            </>
          ) : (
            <button className="appt-btn appt-btn--view">
              <FaEye />
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UserAppointmentsPage() {
  // Tab active: "upcoming" | "history"
  const [activeTab, setActiveTab] = useState("upcoming");

  // Lọc appointment theo tab đang chọn
  const filtered = mockAppointments.filter((a) => a.tab === activeTab);

  return (
    <div className="appt-page">
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="appt-page__header">
        <div>
          <h1 className="appt-page__title">My Appointments</h1>
          <p className="appt-page__subtitle">
            Manage and track all your medical appointments.
          </p>
        </div>

        {/* Tổng số theo tab */}
        <div className="appt-page__count">
          <BsCalendar2WeekFill />
          {filtered.length} {activeTab === "upcoming" ? "upcoming" : "past"}{" "}
          appointments
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="appt-tabs">
        <button
          className={`appt-tabs__btn ${activeTab === "upcoming" ? "appt-tabs__btn--active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          <BsCalendar2WeekFill />
          Upcoming
          <span className="appt-tabs__count">
            {mockAppointments.filter((a) => a.tab === "upcoming").length}
          </span>
        </button>

        <button
          className={`appt-tabs__btn ${activeTab === "history" ? "appt-tabs__btn--active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <BsFileEarmarkMedicalFill />
          History
          <span className="appt-tabs__count">
            {mockAppointments.filter((a) => a.tab === "history").length}
          </span>
        </button>
      </div>

      {/* ── Appointment List ──────────────────────────────── */}
      <div className="appt-list">
        {filtered.length === 0 ? (
          // Empty state
          <div className="appt-empty">
            <BsCalendar2WeekFill className="appt-empty__icon" />
            <p className="appt-empty__text">No appointments found.</p>
          </div>
        ) : (
          filtered.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} tab={activeTab} />
          ))
        )}
      </div>
    </div>
  );
}
