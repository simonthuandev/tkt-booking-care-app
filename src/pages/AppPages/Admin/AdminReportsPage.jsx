// ─────────────────────────────────────────────────────────────────────────────
// AdminReportsPage.jsx  —  Reports & Analytics (read-only)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaUserMd,
  FaUserInjured,
  FaHospital,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaStar,
  FaMoneyBillWave,
  FaCalendarPlus,
  FaUserPlus,
  FaCreditCard,
  FaTimesCircle,
} from "react-icons/fa";
import { BsCalendar2WeekFill, BsGraphUp } from "react-icons/bs";
import "./AdminReportsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA PER RANGE
// ─────────────────────────────────────────────────────────────────────────────
const KPI_DATA = {
  week: [
    {
      id: 1,
      label: "Total Appointments",
      value: "68",
      icon: BsCalendar2WeekFill,
      color: "teal",
      change: +5.2,
      spark: [30, 45, 38, 52, 48, 60, 68],
    },
    {
      id: 2,
      label: "Completion Rate",
      value: "87%",
      icon: FaCheckCircle,
      color: "green",
      change: +2.1,
      spark: [80, 82, 84, 83, 85, 86, 87],
    },
    {
      id: 3,
      label: "New Patients",
      value: "14",
      icon: FaUserInjured,
      color: "navy",
      change: +12.5,
      spark: [6, 8, 10, 9, 11, 12, 14],
    },
    {
      id: 4,
      label: "Revenue",
      value: "₫48M",
      icon: FaMoneyBillWave,
      color: "gold",
      change: +8.3,
      spark: [30, 35, 38, 40, 42, 45, 48],
    },
    {
      id: 5,
      label: "Avg. Rating",
      value: "4.8",
      icon: FaStar,
      color: "amber",
      change: +0.2,
      spark: [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8],
    },
    {
      id: 6,
      label: "Cancellation Rate",
      value: "8%",
      icon: FaBan,
      color: "danger",
      change: -1.5,
      spark: [12, 11, 10, 10, 9, 9, 8],
    },
  ],
  month: [
    {
      id: 1,
      label: "Total Appointments",
      value: "284",
      icon: BsCalendar2WeekFill,
      color: "teal",
      change: +10.4,
      spark: [180, 200, 210, 230, 245, 265, 284],
    },
    {
      id: 2,
      label: "Completion Rate",
      value: "89%",
      icon: FaCheckCircle,
      color: "green",
      change: +3.5,
      spark: [82, 84, 85, 86, 87, 88, 89],
    },
    {
      id: 3,
      label: "New Patients",
      value: "54",
      icon: FaUserInjured,
      color: "navy",
      change: +18.2,
      spark: [30, 36, 40, 44, 48, 51, 54],
    },
    {
      id: 4,
      label: "Revenue",
      value: "₫186M",
      icon: FaMoneyBillWave,
      color: "gold",
      change: +15.3,
      spark: [100, 120, 130, 145, 160, 172, 186],
    },
    {
      id: 5,
      label: "Avg. Rating",
      value: "4.9",
      icon: FaStar,
      color: "amber",
      change: +0.1,
      spark: [4.6, 4.7, 4.7, 4.8, 4.8, 4.9, 4.9],
    },
    {
      id: 6,
      label: "Cancellation Rate",
      value: "6%",
      icon: FaBan,
      color: "danger",
      change: -2.0,
      spark: [10, 9, 8, 8, 7, 6, 6],
    },
  ],
  quarter: [
    {
      id: 1,
      label: "Total Appointments",
      value: "842",
      icon: BsCalendar2WeekFill,
      color: "teal",
      change: +14.2,
      spark: [520, 600, 650, 700, 740, 790, 842],
    },
    {
      id: 2,
      label: "Completion Rate",
      value: "91%",
      icon: FaCheckCircle,
      color: "green",
      change: +4.1,
      spark: [84, 86, 87, 88, 89, 90, 91],
    },
    {
      id: 3,
      label: "New Patients",
      value: "147",
      icon: FaUserInjured,
      color: "navy",
      change: +22.5,
      spark: [80, 95, 108, 120, 130, 140, 147],
    },
    {
      id: 4,
      label: "Revenue",
      value: "₫524M",
      icon: FaMoneyBillWave,
      color: "gold",
      change: +19.8,
      spark: [280, 330, 370, 410, 450, 490, 524],
    },
    {
      id: 5,
      label: "Avg. Rating",
      value: "4.9",
      icon: FaStar,
      color: "amber",
      change: +0.3,
      spark: [4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9],
    },
    {
      id: 6,
      label: "Cancellation Rate",
      value: "5%",
      icon: FaBan,
      color: "danger",
      change: -3.0,
      spark: [9, 8, 7, 7, 6, 5, 5],
    },
  ],
  year: [
    {
      id: 1,
      label: "Total Appointments",
      value: "3,284",
      icon: BsCalendar2WeekFill,
      color: "teal",
      change: +22.1,
      spark: [1800, 2100, 2400, 2700, 2900, 3100, 3284],
    },
    {
      id: 2,
      label: "Completion Rate",
      value: "92%",
      icon: FaCheckCircle,
      color: "green",
      change: +5.0,
      spark: [85, 87, 88, 89, 90, 91, 92],
    },
    {
      id: 3,
      label: "New Patients",
      value: "584",
      icon: FaUserInjured,
      color: "navy",
      change: +31.2,
      spark: [300, 360, 420, 470, 510, 550, 584],
    },
    {
      id: 4,
      label: "Revenue",
      value: "₫2.1B",
      icon: FaMoneyBillWave,
      color: "gold",
      change: +28.4,
      spark: [1000, 1200, 1400, 1600, 1800, 1950, 2100],
    },
    {
      id: 5,
      label: "Avg. Rating",
      value: "4.9",
      icon: FaStar,
      color: "amber",
      change: +0.4,
      spark: [4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.9],
    },
    {
      id: 6,
      label: "Cancellation Rate",
      value: "4%",
      icon: FaBan,
      color: "danger",
      change: -4.0,
      spark: [8, 7, 6, 6, 5, 4, 4],
    },
  ],
};

// 12-month bar chart
const MONTHLY_APPTS = [
  { month: "Jan", completed: 145, pending: 28, cancelled: 12 },
  { month: "Feb", completed: 162, pending: 31, cancelled: 15 },
  { month: "Mar", completed: 188, pending: 25, cancelled: 10 },
  { month: "Apr", completed: 210, pending: 35, cancelled: 18 },
  { month: "May", completed: 195, pending: 30, cancelled: 14 },
  { month: "Jun", completed: 225, pending: 40, cancelled: 20 },
  { month: "Jul", completed: 240, pending: 38, cancelled: 16 },
  { month: "Aug", completed: 215, pending: 32, cancelled: 13 },
  { month: "Sep", completed: 230, pending: 42, cancelled: 19 },
  { month: "Oct", completed: 255, pending: 36, cancelled: 17 },
  { month: "Nov", completed: 270, pending: 44, cancelled: 22 },
  { month: "Dec", completed: 248, pending: 39, cancelled: 18 },
];
const maxMonthly = Math.max(
  ...MONTHLY_APPTS.map((m) => m.completed + m.pending + m.cancelled),
);

// Revenue SVG line chart (6 tháng gần nhất)
const REVENUE_POINTS = [
  { month: "Jul", value: 145 },
  { month: "Aug", value: 162 },
  { month: "Sep", value: 178 },
  { month: "Oct", value: 195 },
  { month: "Nov", value: 220 },
  { month: "Dec", value: 248 },
];

// Top doctors
const TOP_DOCTORS = [
  {
    rank: 1,
    name: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    rating: 4.9,
    visits: 312,
    img: "https://i.pravatar.cc/150?img=11",
  },
  {
    rank: 2,
    name: "Dr. Hoang Van Nam",
    specialty: "Pediatrics",
    rating: 4.8,
    visits: 287,
    img: "https://i.pravatar.cc/150?img=57",
  },
  {
    rank: 3,
    name: "Dr. Le Thi Bich",
    specialty: "Neurology",
    rating: 4.8,
    visits: 265,
    img: "https://i.pravatar.cc/150?img=47",
  },
  {
    rank: 4,
    name: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    rating: 4.7,
    visits: 241,
    img: "https://i.pravatar.cc/150?img=15",
  },
  {
    rank: 5,
    name: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    rating: 4.7,
    visits: 218,
    img: "https://i.pravatar.cc/150?img=12",
  },
];
const maxVisits = TOP_DOCTORS[0].visits;

// Donut — appointment by type
const DONUT_DATA = [
  { label: "Check-up", value: 1420, pct: 43, color: "#0ba3a3" },
  { label: "Follow-up", value: 1105, pct: 34, color: "#0d2b45" },
  { label: "Consultation", value: 759, pct: 23, color: "#ff6b35" },
];
const donutGrad = (() => {
  let acc = 0;
  return DONUT_DATA.map(({ color, pct }) => {
    const s = acc;
    acc += pct;
    return `${color} ${s}% ${acc}%`;
  }).join(", ");
})();

// Patient demographics
const DEMOGRAPHICS = {
  gender: [
    { label: "Male", pct: 52, color: "#0ba3a3" },
    { label: "Female", pct: 48, color: "#534ab7" },
  ],
  age: [
    { label: "Under 30", pct: 22 },
    { label: "30 – 50", pct: 51 },
    { label: "Over 50", pct: 27 },
  ],
};

// Hospital performance
const HOSPITALS = [
  { name: "TKT Medical", appts: 1284, satisfaction: 4.8, pct: 100 },
  { name: "City Hospital", appts: 1042, satisfaction: 4.6, pct: 81 },
  { name: "Riverside", appts: 958, satisfaction: 4.7, pct: 75 },
];

// Activity log
const ACTIVITIES = [
  {
    type: "appointment",
    text: "New appointment booked — Dr. Nguyen Van An with Tran Thi Mai",
    time: "2 min ago",
    cls: "act-appt",
  },
  {
    type: "cancel",
    text: "Appointment cancelled — Dr. Le Thi Bich, 09:00 Apr 19",
    time: "15 min ago",
    cls: "act-cancel",
  },
  {
    type: "patient",
    text: "New patient registered — Dang Van Long (29 yrs)",
    time: "32 min ago",
    cls: "act-patient",
  },
  {
    type: "payment",
    text: "Payment received — ₫500,000 from Hoang Thi Thu",
    time: "1 hr ago",
    cls: "act-payment",
  },
  {
    type: "doctor",
    text: "New doctor approved — Dr. Bui Thi Hoa (Gynecology)",
    time: "2 hrs ago",
    cls: "act-doctor",
  },
  {
    type: "appointment",
    text: "Appointment completed — Dr. Pham Duc Minh with Vo Minh Khoa",
    time: "3 hrs ago",
    cls: "act-appt",
  },
  {
    type: "cancel",
    text: "Appointment cancelled — Dr. Tran Quoc Hung, 14:00 Apr 18",
    time: "4 hrs ago",
    cls: "act-cancel",
  },
  {
    type: "payment",
    text: "Payment received — ₫600,000 from Le Van Binh",
    time: "5 hrs ago",
    cls: "act-payment",
  },
];

const ACT_ICONS = {
  appointment: BsCalendar2WeekFill,
  cancel: FaTimesCircle,
  patient: FaUserPlus,
  payment: FaCreditCard,
  doctor: FaUserMd,
};

const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── KpiCard ──────────────────────────────────────────────────────────────────
const KpiCard = ({ kpi }) => {
  const { label, value, icon: Icon, color, change, spark } = kpi;
  const isUp = change > 0;
  const maxSpark = Math.max(...spark);

  return (
    <div className={`kpi-card kpi-card--${color}`}>
      <div className="kpi-card__top">
        <div className="kpi-card__icon">
          <Icon />
        </div>
        <span
          className={`kpi-badge ${isUp ? "kpi-badge--up" : "kpi-badge--down"}`}
        >
          {isUp ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(change)}%
        </span>
      </div>
      <p className="kpi-card__value">{value}</p>
      <p className="kpi-card__label">{label}</p>
      {/* Sparkline */}
      <div className="kpi-spark">
        {spark.map((v, i) => (
          <div
            key={i}
            className="kpi-spark__bar"
            style={{ height: `${(v / maxSpark) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// ── BarChart — 12 tháng ───────────────────────────────────────────────────────
const BarChart = () => (
  <div className="rep-bar-chart">
    {MONTHLY_APPTS.map(({ month, completed, pending, cancelled }) => {
      const total = completed + pending + cancelled;
      const pct = (total / maxMonthly) * 100;
      return (
        <div key={month} className="rep-bar-chart__col">
          <span className="rep-bar-chart__count">{total}</span>
          <div className="rep-bar-chart__bar-wrap">
            <div
              className="rep-bar-chart__bar"
              style={{ height: `${pct}%` }}
              title={`Completed:${completed} Pending:${pending} Cancelled:${cancelled}`}
            />
          </div>
          <span className="rep-bar-chart__month">{month}</span>
        </div>
      );
    })}
  </div>
);

// ── RevenueChart — SVG polyline ───────────────────────────────────────────────
const RevenueChart = () => {
  const W = 320,
    H = 160,
    PAD = 24;
  const maxVal = Math.max(...REVENUE_POINTS.map((p) => p.value));
  const pts = REVENUE_POINTS.map((p, i) => ({
    x: PAD + (i / (REVENUE_POINTS.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - p.value / maxVal) * (H - PAD * 2),
  }));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath = `M${pts[0].x},${H - PAD} ${pts.map((p) => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length - 1].x},${H - PAD} Z`;

  return (
    <div className="rev-chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="rev-chart__svg">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ba3a3" stopOpacity=".25" />
            <stop offset="100%" stopColor="#0ba3a3" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill="url(#revGrad)" />
        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#0ba3a3"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#0ba3a3"
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
      </svg>
      {/* X labels */}
      <div className="rev-chart__x-labels">
        {REVENUE_POINTS.map((p) => (
          <span key={p.month}>{p.month}</span>
        ))}
      </div>
    </div>
  );
};

// ── DoctorRankRow ─────────────────────────────────────────────────────────────
const DoctorRankRow = ({ doc }) => {
  const { rank, name, specialty, rating, visits, img } = doc;
  const pct = Math.round((visits / maxVisits) * 100);

  return (
    <div className="rank-row">
      <span className="rank-row__medal">{MEDALS[rank] || rank}</span>
      <img
        src={img}
        alt={name}
        className="rank-row__avatar"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ba3a3&color=fff`;
        }}
      />
      <div className="rank-row__info">
        <p className="rank-row__name">{name}</p>
        <div className="rank-row__bar-wrap">
          <div className="rank-row__bar" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="rank-row__stats">
        <span className="rank-row__rating">
          <FaStar />
          {rating}
        </span>
        <span className="rank-row__visits">{visits}</span>
      </div>
    </div>
  );
};

// ── ActivityItem ──────────────────────────────────────────────────────────────
const ActivityItem = ({ act }) => {
  const Icon = ACT_ICONS[act.type] || FaCalendarAlt;
  return (
    <div className="act-item">
      <div className={`act-item__icon ${act.cls}`}>
        <Icon />
      </div>
      <div className="act-item__content">
        <p className="act-item__text">{act.text}</p>
        <span className="act-item__time">{act.time}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [range, setRange] = useState("month");

  const kpis = useMemo(() => KPI_DATA[range] || KPI_DATA.month, [range]);

  const totalAppts = DONUT_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div className="admin-rep">
      {/* Header */}
      <div className="rep-header">
        <div>
          <h1 className="rep-title">Reports & Analytics</h1>
          <p className="rep-sub">
            Track performance metrics and system insights.
          </p>
        </div>
        <div className="rep-header__right">
          {/* Date range */}
          <div className="toolbar-select">
            <FaCalendarAlt className="toolbar-select__icon" />
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="btn-export">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <section className="rep-section">
        <div className="kpi-grid">
          {kpis.map((k) => (
            <KpiCard key={k.id} kpi={k} />
          ))}
        </div>
      </section>

      {/* 12-month Appointment Trends */}
      <section className="rep-section">
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <FaChartBar /> Appointment Trends (Monthly)
            </h2>
            <div className="chart-legend">
              <span className="chart-legend__item chart-legend__item--completed">
                Completed
              </span>
              <span className="chart-legend__item chart-legend__item--pending">
                Pending
              </span>
              <span className="chart-legend__item chart-legend__item--cancelled">
                Cancelled
              </span>
            </div>
          </div>
          <div className="rep-card__body rep-card__body--scroll">
            <BarChart />
          </div>
        </div>
      </section>

      {/* Revenue + Top Doctors */}
      <section className="rep-section rep-two-col">
        {/* Revenue line chart */}
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <BsGraphUp /> Revenue (Last 6 Months)
            </h2>
          </div>
          <div className="rep-card__body">
            {/* Y-axis labels */}
            <div className="rev-chart-wrap">
              <div className="rev-chart-y">
                {["₫250M", "₫200M", "₫150M", "₫100M", "₫50M", "₫0"].map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
              <RevenueChart />
            </div>
          </div>
        </div>

        {/* Top doctors */}
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <FaUserMd /> Top Performing Doctors
            </h2>
          </div>
          <div className="rep-card__body rep-card__body--list">
            {TOP_DOCTORS.map((d) => (
              <DoctorRankRow key={d.rank} doc={d} />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics 3 cột */}
      <section className="rep-section rep-three-col">
        {/* Donut — appointment by type */}
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <FaChartPie /> Appointment Types
            </h2>
          </div>
          <div className="rep-card__body rep-card__body--center">
            <div
              className="rep-donut"
              style={{ background: `conic-gradient(${donutGrad})` }}
            >
              <div className="rep-donut__hole">
                <p className="rep-donut__total">
                  {totalAppts.toLocaleString()}
                </p>
                <p className="rep-donut__label">Total</p>
              </div>
            </div>
            <div className="rep-donut-legend">
              {DONUT_DATA.map((d) => (
                <div key={d.label} className="rep-donut-legend__item">
                  <span
                    className="rep-donut-legend__dot"
                    style={{ background: d.color }}
                  />
                  <span className="rep-donut-legend__label">{d.label}</span>
                  <span className="rep-donut-legend__pct">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <FaUserInjured /> Patient Demographics
            </h2>
          </div>
          <div className="rep-card__body">
            <p className="demo-section-label">By Gender</p>
            {DEMOGRAPHICS.gender.map((g) => (
              <div key={g.label} className="demo-bar-row">
                <span className="demo-bar-row__label">{g.label}</span>
                <div className="demo-bar-row__track">
                  <div
                    className="demo-bar-row__fill"
                    style={{ width: `${g.pct}%`, background: g.color }}
                  />
                </div>
                <span className="demo-bar-row__pct">{g.pct}%</span>
              </div>
            ))}

            <p className="demo-section-label" style={{ marginTop: "1rem" }}>
              By Age Group
            </p>
            {DEMOGRAPHICS.age.map((a) => (
              <div key={a.label} className="demo-bar-row">
                <span className="demo-bar-row__label">{a.label}</span>
                <div className="demo-bar-row__track">
                  <div
                    className="demo-bar-row__fill"
                    style={{ width: `${a.pct}%`, background: "#0ba3a3" }}
                  />
                </div>
                <span className="demo-bar-row__pct">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Performance */}
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <FaHospital /> Hospital Performance
            </h2>
          </div>
          <div className="rep-card__body">
            {HOSPITALS.map((h) => (
              <div key={h.name} className="hosp-row">
                <div className="hosp-row__info">
                  <p className="hosp-row__name">{h.name}</p>
                  <div className="hosp-row__meta">
                    <span>
                      <BsCalendar2WeekFill /> {h.appts.toLocaleString()} appts
                    </span>
                    <span>
                      <FaStar /> {h.satisfaction}
                    </span>
                  </div>
                </div>
                <div className="hosp-row__bar-wrap">
                  <div
                    className="hosp-row__bar"
                    style={{ width: `${h.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Log */}
      <section className="rep-section">
        <div className="rep-card">
          <div className="rep-card__header">
            <h2 className="rep-card__title">
              <FaClock /> Recent Activity Log
            </h2>
            <span className="rep-card__sub">Last 24 hours</span>
          </div>
          <div className="act-list">
            {ACTIVITIES.map((a, i) => (
              <ActivityItem key={i} act={a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
