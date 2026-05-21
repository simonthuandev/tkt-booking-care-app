// ─────────────────────────────────────────────────────────────────────────────
// DoctorDashboardPage.jsx
// Dashboard bác sĩ: header, stats, schedule hôm nay, bệnh nhân gần đây, quick stats
// ─────────────────────────────────────────────────────────────────────────────
import {
  BsCalendar2WeekFill,
  BsBellFill,
  BsPersonBadgeFill,
  BsClockFill,
} from "react-icons/bs";
import {
  FaUserInjured,
  FaCheckCircle,
  FaStar,
  FaChartLine,
  FaStethoscope,
  FaHospital,
  FaEye,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import "./DoctorDashboardPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

// ── Doctor info ──────────────────────────────────────────────────────────────
const mockDoctor = {
  name: "Nguyen Van An",
  specialty: "Cardiology",
  hospital: "TKT Medical Center",
};

// ── Stats ────────────────────────────────────────────────────────────────────
const statsData = [
  {
    id: 1,
    label: "Today's Appointments",
    value: 8,
    icon: BsCalendar2WeekFill,
    color: "teal",
    note: "2 remaining",
  },
  {
    id: 2,
    label: "Total Patients",
    value: 134,
    icon: FaUserInjured,
    color: "navy",
    note: "↑ 4 this week",
  },
  {
    id: 3,
    label: "Completed Today",
    value: 6,
    icon: FaCheckCircle,
    color: "green",
    note: "75% completion",
  },
  {
    id: 4,
    label: "Rating",
    value: "4.9",
    icon: FaStar,
    color: "star",
    note: "Based on 98 reviews",
  },
];

// ── Today's Schedule ─────────────────────────────────────────────────────────
const todaySchedule = [
  {
    id: 1,
    time: "08:00 AM",
    patient: "Tran Thi Mai",
    type: "Check-up",
    status: "done",
  },
  {
    id: 2,
    time: "08:45 AM",
    patient: "Le Van Binh",
    type: "Follow-up",
    status: "done",
  },
  {
    id: 3,
    time: "09:30 AM",
    patient: "Pham Duc Thanh",
    type: "Consultation",
    status: "done",
  },
  {
    id: 4,
    time: "10:15 AM",
    patient: "Nguyen Thi Lan",
    type: "Check-up",
    status: "done",
  },
  {
    id: 5,
    time: "11:00 AM",
    patient: "Vo Minh Khoa",
    type: "Follow-up",
    status: "done",
  },
  {
    id: 6,
    time: "01:30 PM",
    patient: "Hoang Thi Thu",
    type: "Consultation",
    status: "done",
  },
  {
    id: 7,
    time: "02:15 PM",
    patient: "Dang Van Long",
    type: "Check-up",
    status: "in-progress",
  },
  {
    id: 8,
    time: "03:00 PM",
    patient: "Bui Thi Huong",
    type: "Follow-up",
    status: "waiting",
  },
];

// ── Recent Patients ──────────────────────────────────────────────────────────
const recentPatients = [
  {
    id: 1,
    name: "Tran Thi Mai",
    age: 45,
    reason: "Hypertension Follow-up",
    lastVisit: "Apr 17, 2026",
    avatar: "TM",
    avatarColor: "#0ba3a3",
  },
  {
    id: 2,
    name: "Le Van Binh",
    age: 62,
    reason: "Chest Pain Consultation",
    lastVisit: "Apr 17, 2026",
    avatar: "LB",
    avatarColor: "#077d7d",
  },
  {
    id: 3,
    name: "Pham Duc Thanh",
    age: 38,
    reason: "Annual Heart Check-up",
    lastVisit: "Apr 17, 2026",
    avatar: "PT",
    avatarColor: "#f5a623",
  },
  {
    id: 4,
    name: "Nguyen Thi Lan",
    age: 55,
    reason: "Post-surgery Follow-up",
    lastVisit: "Apr 16, 2026",
    avatar: "NL",
    avatarColor: "#534ab7",
  },
  {
    id: 5,
    name: "Vo Minh Khoa",
    age: 29,
    reason: "ECG Abnormality Check",
    lastVisit: "Apr 16, 2026",
    avatar: "VK",
    avatarColor: "#1a9e5c",
  },
];

// ── Weekly appointments (7 ngày gần nhất) ────────────────────────────────────
const weeklyData = [
  { day: "Mon", count: 6 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 5 },
  { day: "Thu", count: 9 },
  { day: "Fri", count: 7 },
  { day: "Sat", count: 4 },
  { day: "Sun", count: 2 },
];
const maxWeekly = Math.max(...weeklyData.map((d) => d.count));

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  waiting: { label: "Waiting", icon: FaClock, className: "status--waiting" },
  "in-progress": {
    label: "In Progress",
    icon: FaSpinner,
    className: "status--in-progress",
  },
  done: { label: "Done", icon: FaCheckCircle, className: "status--done" },
};

// ── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "Check-up": "type--checkup",
  "Follow-up": "type--followup",
  Consultation: "type--consultation",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StatCard
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, note }) {
  return (
    <div className={`doc-stat-card doc-stat-card--${color}`}>
      <div className="doc-stat-card__icon">
        <Icon />
      </div>
      <div className="doc-stat-card__body">
        <p className="doc-stat-card__label">{label}</p>
        <p className="doc-stat-card__value">{value}</p>
        <p className="doc-stat-card__note">{note}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ScheduleItem
// ─────────────────────────────────────────────────────────────────────────────
function ScheduleItem({ item }) {
  const { time, patient, type, status } = item;
  const statusCfg = STATUS_CONFIG[status];
  const StatusIcon = statusCfg.icon;

  return (
    <div
      className={`schedule-item ${status === "in-progress" ? "schedule-item--active" : ""}`}
    >
      {/* Thời gian */}
      <div className="schedule-item__time">
        <BsClockFill />
        {time}
      </div>

      {/* Đường kẻ timeline */}
      <div className={`schedule-item__dot schedule-item__dot--${status}`} />

      {/* Nội dung */}
      <div className="schedule-item__info">
        <p className="schedule-item__patient">{patient}</p>
        <span className={`schedule-item__type ${TYPE_CONFIG[type]}`}>
          {type}
        </span>
      </div>

      {/* Trạng thái */}
      <span className={`schedule-item__status ${statusCfg.className}`}>
        <StatusIcon />
        {statusCfg.label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PatientRow
// ─────────────────────────────────────────────────────────────────────────────
function PatientRow({ patient }) {
  const { name, age, reason, lastVisit, avatar, avatarColor } = patient;

  return (
    <div className="patient-row">
      {/* Avatar */}
      <div className="patient-row__avatar" style={{ background: avatarColor }}>
        {avatar}
      </div>

      {/* Info */}
      <div className="patient-row__info">
        <p className="patient-row__name">
          {name} <span className="patient-row__age">{age} yrs</span>
        </p>
        <p className="patient-row__reason">
          <FaStethoscope />
          {reason}
        </p>
      </div>

      {/* Last visit + action */}
      <div className="patient-row__right">
        <p className="patient-row__date">
          <BsCalendar2WeekFill />
          {lastVisit}
        </p>
        <button className="patient-row__btn">
          <FaEye />
          View Record
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorDashboardPage() {
  // Tính completion rate: done / total
  const doneCount = todaySchedule.filter((s) => s.status === "done").length;
  const totalCount = todaySchedule.length;
  const completionRate = Math.round((doneCount / totalCount) * 100);

  // Lời chào theo giờ
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Ngày hiện tại
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="doc-page">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="doc-page__header">
        <div className="doc-page__header-left">
          <div className="doc-page__greeting-row">
            <h1 className="doc-page__title">
              {greeting}, Dr. {mockDoctor.name.split(" ").pop()} 👋
            </h1>
            {/* Badge chuyên khoa */}
            <span className="doc-specialty-badge">
              <FaStethoscope />
              {mockDoctor.specialty}
            </span>
          </div>
          <p className="doc-page__subtitle">
            <FaHospital />
            {mockDoctor.hospital} &nbsp;·&nbsp; {today}
          </p>
        </div>

        {/* Nút thông báo */}
        <button className="doc-page__notif-btn" title="Notifications">
          <BsBellFill />
          <span className="doc-page__notif-dot" />
        </button>
      </div>

      {/* ── Stats Grid ──────────────────────────────────── */}
      <section className="doc-section">
        <div className="doc-stats-grid">
          {statsData.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* ── Today's Schedule + Recent Patients (2 cột) ── */}
      <section className="doc-section doc-two-col">
        {/* LEFT: Today's Schedule */}
        <div>
          <div className="doc-section-header">
            <h2 className="doc-section-header__title">
              <BsCalendar2WeekFill />
              Today's Schedule
            </h2>
            <span className="doc-section-header__badge">
              {todaySchedule.length} appointments
            </span>
          </div>

          <div className="doc-card schedule-list">
            {todaySchedule.map((item) => (
              <ScheduleItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* RIGHT: Recent Patients */}
        <div>
          <div className="doc-section-header">
            <h2 className="doc-section-header__title">
              <FaUserInjured />
              Recent Patients
            </h2>
            <button className="doc-section-header__link">View all →</button>
          </div>

          <div className="doc-card patient-list">
            {recentPatients.map((p) => (
              <PatientRow key={p.id} patient={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Stats ─────────────────────────────────── */}
      <section className="doc-section">
        <div className="doc-section-header">
          <h2 className="doc-section-header__title">
            <FaChartLine />
            Quick Stats
          </h2>
        </div>

        <div className="quick-stats-grid">
          {/* Weekly bar chart (CSS thuần) */}
          <div className="doc-card quick-stats-card">
            <p className="quick-stats-card__title">Weekly Appointments</p>
            <div className="weekly-chart">
              {weeklyData.map(({ day, count }) => (
                <div key={day} className="weekly-chart__col">
                  <span className="weekly-chart__count">{count}</span>
                  <div className="weekly-chart__bar-wrap">
                    <div
                      className="weekly-chart__bar"
                      style={{ height: `${(count / maxWeekly) * 100}%` }}
                    />
                  </div>
                  <span className="weekly-chart__day">{day}</span>
                </div>
              ))}
            </div>
            <p className="quick-stats-card__sub">
              Total this week: {weeklyData.reduce((s, d) => s + d.count, 0)}{" "}
              appointments
            </p>
          </div>

          {/* Completion rate */}
          <div className="doc-card quick-stats-card">
            <p className="quick-stats-card__title">Today's Completion Rate</p>

            {/* Progress ngang */}
            <div className="completion-rate">
              <div className="completion-rate__header">
                <span className="completion-rate__label">Completed</span>
                <span className="completion-rate__pct">{completionRate}%</span>
              </div>
              <div className="completion-rate__bar">
                <div
                  className="completion-rate__fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="completion-rate__note">
                {doneCount} of {totalCount} appointments completed
              </p>
            </div>

            {/* Breakdown theo status */}
            <div className="status-breakdown">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = todaySchedule.filter(
                  (s) => s.status === key,
                ).length;
                return (
                  <div key={key} className="status-breakdown__item">
                    <span
                      className={`status-breakdown__dot ${cfg.className}`}
                    />
                    <span className="status-breakdown__label">{cfg.label}</span>
                    <span className="status-breakdown__count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
