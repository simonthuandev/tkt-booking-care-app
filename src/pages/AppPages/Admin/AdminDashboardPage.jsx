// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboardPage.jsx
// Dashboard tổng quan hệ thống: stats, charts, recent activity, news, hospitals
// ─────────────────────────────────────────────────────────────────────────────
import {
  BsCalendar2WeekFill,
  BsPersonBadgeFill,
  BsHouseHeartFill,
} from "react-icons/bs";
import {
  FaUserMd,
  FaUserInjured,
  FaHospital,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaArrowUp,
  FaArrowDown,
  FaStethoscope,
  FaNewspaper,
  FaStar,
  FaEye,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";
import "./AdminDashboardPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

// ── 6 Stats cards ─────────────────────────────────────────────────────────
const statsData = [
  {
    id: 1,
    label: "Total Doctors",
    value: "124",
    icon: FaUserMd,
    color: "teal",
    change: +8.2,
    changePeriod: "vs last month",
  },
  {
    id: 2,
    label: "Total Patients",
    value: "3,847",
    icon: FaUserInjured,
    color: "navy",
    change: +12.5,
    changePeriod: "vs last month",
  },
  {
    id: 3,
    label: "Appointments Today",
    value: "68",
    icon: BsCalendar2WeekFill,
    color: "accent",
    change: +3.1,
    changePeriod: "vs yesterday",
  },
  {
    id: 4,
    label: "Completed Today",
    value: "51",
    icon: FaCheckCircle,
    color: "green",
    change: +5.7,
    changePeriod: "vs yesterday",
  },
  {
    id: 5,
    label: "Active Hospitals",
    value: "18",
    icon: FaHospital,
    color: "purple",
    change: 0,
    changePeriod: "no change",
  },
  {
    id: 6,
    label: "Total Revenue",
    value: "₫248M",
    icon: FaChartLine,
    color: "gold",
    change: +15.3,
    changePeriod: "vs last month",
  },
];

// ── Weekly bar chart data ──────────────────────────────────────────────────
const weeklyData = [
  { day: "Mon", count: 54 },
  { day: "Tue", count: 72 },
  { day: "Wed", count: 61 },
  { day: "Thu", count: 85 },
  { day: "Fri", count: 68 },
  { day: "Sat", count: 43 },
  { day: "Sun", count: 29 },
];
const maxWeekly = Math.max(...weeklyData.map((d) => d.count));

// ── Donut chart data ──────────────────────────────────────────────────────
const donutData = [
  { label: "Completed", value: 412, color: "#0ba3a3", pct: 61 },
  { label: "Pending", value: 189, color: "#f5a623", pct: 28 },
  { label: "Cancelled", value: 74, color: "#e24b4a", pct: 11 },
];
const totalAppts = donutData.reduce((s, d) => s + d.value, 0);

// Tạo conic-gradient cho donut
const donutGradient = (() => {
  let acc = 0;
  return donutData
    .map(({ color, pct }) => {
      const start = acc;
      acc += pct;
      return `${color} ${start}% ${acc}%`;
    })
    .join(", ");
})();

// ── Recent Appointments ────────────────────────────────────────────────────
const recentAppointments = [
  {
    id: 1,
    patient: "Tran Thi Mai",
    initials: "TM",
    color: "#0ba3a3",
    doctor: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    time: "08:00 AM",
    status: "completed",
  },
  {
    id: 2,
    patient: "Le Van Binh",
    initials: "LB",
    color: "#534ab7",
    doctor: "Dr. Le Thi Bich",
    specialty: "Neurology",
    time: "09:00 AM",
    status: "in-progress",
  },
  {
    id: 3,
    patient: "Pham Duc Thanh",
    initials: "PT",
    color: "#f5a623",
    doctor: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    time: "10:00 AM",
    status: "waiting",
  },
  {
    id: 4,
    patient: "Nguyen Thi Lan",
    initials: "NL",
    color: "#1a9e5c",
    doctor: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    time: "11:00 AM",
    status: "completed",
  },
  {
    id: 5,
    patient: "Vo Minh Khoa",
    initials: "VK",
    color: "#e24b4a",
    doctor: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    time: "01:30 PM",
    status: "cancelled",
  },
];

// ── Top Doctors ────────────────────────────────────────────────────────────
const topDoctors = [
  {
    id: 1,
    name: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    rating: 4.9,
    visits: 312,
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    isTop: true,
  },
  {
    id: 2,
    name: "Dr. Le Thi Bich",
    specialty: "Neurology",
    rating: 4.8,
    visits: 287,
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    isTop: false,
  },
  {
    id: 3,
    name: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    rating: 4.7,
    visits: 254,
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    isTop: false,
  },
  {
    id: 4,
    name: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    rating: 4.7,
    visits: 231,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    isTop: false,
  },
  {
    id: 5,
    name: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    rating: 4.6,
    visits: 198,
    avatarUrl: "https://i.pravatar.cc/150?img=48",
    isTop: false,
  },
];

// ── Quick Stats (4 mini cards) ─────────────────────────────────────────────
const quickStats = [
  {
    id: 1,
    label: "New Registrations",
    value: 14,
    icon: BsPersonBadgeFill,
    color: "teal",
  },
  {
    id: 2,
    label: "Pending Approvals",
    value: 7,
    icon: FaClock,
    color: "amber",
  },
  { id: 3, label: "System Alerts", value: 2, icon: FaBan, color: "danger" },
  { id: 4, label: "Avg. Rating", value: "4.8", icon: FaStar, color: "gold" },
];

// ── Recent News ────────────────────────────────────────────────────────────
const recentNews = [
  {
    id: 1,
    title: "New Telemedicine Guidelines Released",
    author: "Admin",
    date: "Apr 20, 2026",
    category: "Policy",
  },
  {
    id: 2,
    title: "TKT Clinic Expansion to District 9",
    author: "Dr. An",
    date: "Apr 18, 2026",
    category: "Hospital",
  },
  {
    id: 3,
    title: "Updated Vaccination Schedule for 2026",
    author: "Health Dept",
    date: "Apr 15, 2026",
    category: "Health",
  },
];

// ── Hospitals ──────────────────────────────────────────────────────────────
const hospitals = [
  {
    id: 1,
    name: "TKT Medical Center",
    address: "District 1, HCMC",
    doctors: 34,
    rating: 4.8,
    slotFill: 82,
  },
  {
    id: 2,
    name: "City General Hospital",
    address: "District 5, HCMC",
    doctors: 28,
    rating: 4.6,
    slotFill: 75,
  },
  {
    id: 3,
    name: "Riverside Clinic",
    address: "Binh Thanh, HCMC",
    doctors: 18,
    rating: 4.7,
    slotFill: 63,
  },
];

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed: { label: "Completed", className: "status--completed" },
  "in-progress": { label: "In Progress", className: "status--in-progress" },
  waiting: { label: "Waiting", className: "status--waiting" },
  cancelled: { label: "Cancelled", className: "status--cancelled" },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── StatCard — thẻ thống kê lớn (6 cái) ─────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, change, changePeriod }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className={`admin-stat-card admin-stat-card--${color}`}>
      <div className="admin-stat-card__top">
        <div className="admin-stat-card__icon">
          <Icon />
        </div>
        {!isNeutral && (
          <span
            className={`admin-stat-card__badge ${isPositive ? "admin-stat-card__badge--up" : "admin-stat-card__badge--down"}`}
          >
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="admin-stat-card__value">{value}</p>
      <p className="admin-stat-card__label">{label}</p>
      <p className="admin-stat-card__period">{changePeriod}</p>
    </div>
  );
}

// ── MiniStatCard — 4 thẻ nhỏ ngang ──────────────────────────────────────────
function MiniStatCard({ label, value, icon: Icon, color }) {
  return (
    <div className={`admin-mini-card admin-mini-card--${color}`}>
      <div className="admin-mini-card__icon">
        <Icon />
      </div>
      <div>
        <p className="admin-mini-card__value">{value}</p>
        <p className="admin-mini-card__label">{label}</p>
      </div>
    </div>
  );
}

// ── AppointmentRow — recent appointments list ─────────────────────────────────
function AppointmentRow({ appt }) {
  const { patient, initials, color, doctor, specialty, time, status } = appt;
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;

  return (
    <div className="admin-appt-row">
      <div className="admin-appt-row__avatar" style={{ background: color }}>
        {initials}
      </div>
      <div className="admin-appt-row__info">
        <p className="admin-appt-row__patient">{patient}</p>
        <p className="admin-appt-row__doctor">
          <FaStethoscope /> {doctor} · {specialty}
        </p>
      </div>
      <div className="admin-appt-row__right">
        <span className="admin-appt-row__time">
          <FaClock /> {time}
        </span>
        <span className={`admin-appt-row__status ${statusCfg.className}`}>
          {statusCfg.label}
        </span>
      </div>
    </div>
  );
}

// ── DoctorRow — top doctors list ──────────────────────────────────────────────
function DoctorRow({ doc }) {
  const { name, specialty, rating, visits, avatarUrl, isTop } = doc;

  return (
    <div className="admin-doctor-row">
      <div className="admin-doctor-row__avatar-wrap">
        <img
          src={avatarUrl}
          alt={name}
          className="admin-doctor-row__avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ba3a3&color=fff`;
          }}
        />
        {isTop && <span className="admin-doctor-row__top-badge">Top</span>}
      </div>
      <div className="admin-doctor-row__info">
        <p className="admin-doctor-row__name">{name}</p>
        <p className="admin-doctor-row__specialty">
          <FaStethoscope /> {specialty}
        </p>
      </div>
      <div className="admin-doctor-row__stats">
        <span className="admin-doctor-row__rating">
          <FaStar /> {rating}
        </span>
        <span className="admin-doctor-row__visits">{visits} visits</span>
      </div>
    </div>
  );
}

// ── NewsItem ──────────────────────────────────────────────────────────────────
function NewsItem({ item }) {
  const { title, author, date, category } = item;
  const catColors = {
    Policy: "cat--policy",
    Hospital: "cat--hospital",
    Health: "cat--health",
  };

  return (
    <div className="admin-news-item">
      <div className="admin-news-item__body">
        <span className={`admin-news-item__cat ${catColors[category] || ""}`}>
          {category}
        </span>
        <p className="admin-news-item__title">{title}</p>
        <p className="admin-news-item__meta">
          <FaNewspaper /> {author} · {date}
        </p>
      </div>
      <button className="admin-news-item__btn">
        <FaEye /> View
      </button>
    </div>
  );
}

// ── HospitalItem ──────────────────────────────────────────────────────────────
function HospitalItem({ item }) {
  const { name, address, doctors, rating, slotFill } = item;

  return (
    <div className="admin-hospital-item">
      <div className="admin-hospital-item__icon">
        <FaHospital />
      </div>
      <div className="admin-hospital-item__info">
        <p className="admin-hospital-item__name">{name}</p>
        <p className="admin-hospital-item__address">
          <FaMapMarkerAlt /> {address}
        </p>
        <div className="admin-hospital-item__meta">
          <span>
            <FaUserMd /> {doctors} doctors
          </span>
          <span>
            <FaStar /> {rating}
          </span>
        </div>
        {/* Progress bar tỉ lệ lấp đầy slot */}
        <div className="admin-hospital-item__progress-wrap">
          <div className="admin-hospital-item__progress-bar">
            <div
              className="admin-hospital-item__progress-fill"
              style={{ width: `${slotFill}%` }}
            />
          </div>
          <span className="admin-hospital-item__progress-pct">
            {slotFill}% full
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="admin-page">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Admin Dashboard</h1>
          <p className="admin-page__subtitle">{today}</p>
        </div>
        <span className="admin-page__online-badge">
          <span className="admin-page__online-dot" />
          System Online
        </span>
      </div>

      {/* ── Stats Grid (6 thẻ, 3 cột × 2 hàng) ────────── */}
      <section className="admin-section">
        <div className="admin-stats-grid">
          {statsData.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* ── Overview Charts (2 cột) ─────────────────────── */}
      <section className="admin-section">
        <div className="admin-two-col">
          {/* LEFT: Weekly Bar Chart */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">
                <BsCalendar2WeekFill /> Weekly Appointments
              </h2>
              <span className="admin-card__sub">Last 7 days</span>
            </div>
            <div className="admin-bar-chart">
              {weeklyData.map(({ day, count }) => (
                <div key={day} className="admin-bar-chart__col">
                  <span className="admin-bar-chart__count">{count}</span>
                  <div className="admin-bar-chart__bar-wrap">
                    <div
                      className="admin-bar-chart__bar"
                      style={{ height: `${(count / maxWeekly) * 100}%` }}
                    />
                  </div>
                  <span className="admin-bar-chart__day">{day}</span>
                </div>
              ))}
            </div>
            <p className="admin-bar-chart__total">
              Total:{" "}
              <strong>{weeklyData.reduce((s, d) => s + d.count, 0)}</strong>{" "}
              appointments this week
            </p>
          </div>

          {/* RIGHT: Donut Chart */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">
                <FaCheckCircle /> Appointment Status
              </h2>
              <span className="admin-card__sub">This month</span>
            </div>

            {/* Donut CSS conic-gradient */}
            <div className="admin-donut-wrap">
              <div
                className="admin-donut"
                style={{ background: `conic-gradient(${donutGradient})` }}
              >
                <div className="admin-donut__hole">
                  <p className="admin-donut__total">{totalAppts}</p>
                  <p className="admin-donut__label">Total</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="admin-donut-legend">
              {donutData.map(({ label, value, color, pct }) => (
                <div key={label} className="admin-donut-legend__item">
                  <span
                    className="admin-donut-legend__dot"
                    style={{ background: color }}
                  />
                  <span className="admin-donut-legend__label">{label}</span>
                  <span className="admin-donut-legend__value">{value}</span>
                  <span className="admin-donut-legend__pct">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Activity (2 cột) ─────────────────────── */}
      <section className="admin-section">
        <div className="admin-two-col">
          {/* LEFT: Recent Appointments */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">
                <BsCalendar2WeekFill /> Recent Appointments
              </h2>
              <button className="admin-card__link">View all →</button>
            </div>
            <div className="admin-list">
              {recentAppointments.map((appt) => (
                <AppointmentRow key={appt.id} appt={appt} />
              ))}
            </div>
          </div>

          {/* RIGHT: Top Doctors */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">
                <FaUserMd /> Top Doctors
              </h2>
              <button className="admin-card__link">View all →</button>
            </div>
            <div className="admin-list">
              {topDoctors.map((doc) => (
                <DoctorRow key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Stats (4 mini cards ngang) ────────────── */}
      <section className="admin-section">
        <div className="admin-mini-grid">
          {quickStats.map((s) => (
            <MiniStatCard key={s.id} {...s} />
          ))}
        </div>
      </section>

      {/* ── News & Hospitals (2 cột) ─────────────────────── */}
      <section className="admin-section">
        <div className="admin-two-col">
          {/* LEFT: Recent News */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">
                <FaNewspaper /> Recent News
              </h2>
              <button className="admin-card__link">View all →</button>
            </div>
            <div className="admin-list">
              {recentNews.map((item) => (
                <NewsItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* RIGHT: Hospital Overview */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2 className="admin-card__title">
                <FaHospital /> Hospital Overview
              </h2>
              <button className="admin-card__link">View all →</button>
            </div>
            <div className="admin-list">
              {hospitals.map((item) => (
                <HospitalItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
