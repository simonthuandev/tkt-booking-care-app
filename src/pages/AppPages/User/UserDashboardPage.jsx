// ─────────────────────────────────────────────────────────────────────────────
// UserDashboardPage.jsx
// Trang Dashboard chính của User – thống kê, lịch hẹn sắp tới, quick actions
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import {
  BsCalendar2WeekFill,
  BsBellFill,
  BsFileEarmarkMedicalFill,
  BsPersonBadgeFill,
} from "react-icons/bs";
import {
  FaUserMd,
  FaCheckCircle,
  FaHistory,
  FaUserEdit,
  FaClock,
  FaHospital,
} from "react-icons/fa";
import "./UserDashboardPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockUser = {
  name: "Pham Minh Tuan",
};

// 4 thẻ thống kê
const statsData = [
  {
    id: 1,
    label: "Upcoming Appointments",
    value: 3,
    icon: BsCalendar2WeekFill,
    color: "teal",
    note: "Next: Tomorrow 9:00 AM",
  },
  {
    id: 2,
    label: "Completed Appointments",
    value: 12,
    icon: FaCheckCircle,
    color: "green",
    note: "This month: 4",
  },
  {
    id: 3,
    label: "Doctors Consulted",
    value: 7,
    icon: FaUserMd,
    color: "navy",
    note: "Across 3 specialties",
  },
  {
    id: 4,
    label: "Notifications",
    value: 5,
    icon: BsBellFill,
    color: "accent",
    note: "2 unread reminders",
  },
];

// Danh sách lịch hẹn sắp tới
// avatarUrl dùng pravatar.cc — stable, không bị block
const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    date: "Thu, Apr 17, 2026",
    time: "09:00 AM",
    status: "confirmed",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    doctor: "Dr. Le Thi Bich",
    specialty: "Neurology",
    date: "Sat, Apr 19, 2026",
    time: "02:30 PM",
    status: "pending",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 3,
    doctor: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    date: "Mon, Apr 21, 2026",
    time: "10:00 AM",
    status: "confirmed",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
  },
];

// Quick Actions
const quickActions = [
  {
    id: 1,
    label: "Book Appointment",
    icon: BsCalendar2WeekFill,
    color: "primary",
    desc: "Schedule a new visit",
  },
  {
    id: 2,
    label: "View History",
    icon: FaHistory,
    color: "navy",
    desc: "Past appointments & records",
  },
  {
    id: 3,
    label: "Update Profile",
    icon: FaUserEdit,
    color: "accent",
    desc: "Edit personal information",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── StatCard ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, note }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon-wrap">
        <Icon />
      </div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__note">{note}</p>
      </div>
    </div>
  );
}

// ── AppointmentRow ──────────────────────────────────────────────────────────
function AppointmentRow({ doctor, specialty, date, time, status, avatarUrl }) {
  return (
    <div className="appointment-row">
      {/* Avatar – ảnh bác sĩ, fallback về ui-avatars nếu lỗi */}
      <img
        src={avatarUrl}
        alt={doctor}
        className="appointment-row__avatar"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor)}&background=0ba3a3&color=fff`;
        }}
      />

      {/* Info */}
      <div className="appointment-row__info">
        <p className="appointment-row__doctor">{doctor}</p>
        <p className="appointment-row__specialty">
          <FaHospital style={{ marginRight: 5, opacity: 0.6 }} />
          {specialty}
        </p>
      </div>

      {/* Time */}
      <div className="appointment-row__time">
        <p className="appointment-row__date">
          <FaClock style={{ marginRight: 5, opacity: 0.6 }} />
          {date}
        </p>
        <p className="appointment-row__hour">{time}</p>
      </div>

      {/* Status badge */}
      <span
        className={`appointment-row__status appointment-row__status--${status}`}
      >
        {status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
      </span>
    </div>
  );
}

// ── QuickActionCard ─────────────────────────────────────────────────────────
function QuickActionCard({ label, icon: Icon, color, desc }) {
  return (
    <button className={`quick-action quick-action--${color}`}>
      <div className="quick-action__icon">
        <Icon />
      </div>
      <p className="quick-action__label">{label}</p>
      <p className="quick-action__desc">{desc}</p>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UserDashboardPage() {
  return (
    <div className="dashboard-page">
      {/* ── Page header ──────────────────────────────────── */}
      <div className="dashboard-page__header">
        <div>
          <h1 className="dashboard-page__title">
            Hello, {mockUser.name.split(" ").pop()} 👋
          </h1>
          <p className="dashboard-page__subtitle">
            Here's what's happening with your health today.
          </p>
        </div>
        <div className="dashboard-page__date">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* ── Stats grid (4 thẻ) ───────────────────────────── */}
      <section className="dashboard-section">
        <div className="stats-grid">
          {statsData.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* ── Upcoming Appointments ────────────────────────── */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-header__title">
            <BsCalendar2WeekFill />
            Upcoming Appointments
          </h2>
          <button className="section-header__link">View all →</button>
        </div>

        <div className="appointments-list">
          {upcomingAppointments.map((apt) => (
            <AppointmentRow key={apt.id} {...apt} />
          ))}
        </div>
      </section>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-header__title">
            <BsPersonBadgeFill />
            Quick Actions
          </h2>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map((qa) => (
            <QuickActionCard key={qa.id} {...qa} />
          ))}
        </div>
      </section>
    </div>
  );
}
