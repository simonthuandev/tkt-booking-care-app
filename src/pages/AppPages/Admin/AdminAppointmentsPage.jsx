// ─────────────────────────────────────────────────────────────────────────────
// AdminAppointmentsPage.jsx  —  Appointments Management
// Style compact như AdminDashboardPage
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import {
  FaUserMd,
  FaUserInjured,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaHospital,
  FaStethoscope,
  FaDownload,
} from "react-icons/fa";
import "./AdminAppointmentsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const addDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

const INIT_DATA = [
  {
    id: 1,
    patient: "Tran Thi Mai",
    age: 45,
    initials: "TM",
    color: "#0ba3a3",
    doctor: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    hospital: "TKT Medical",
    date: addDays(0),
    time: "08:00 AM",
    type: "Check-up",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Le Van Binh",
    age: 62,
    initials: "LB",
    color: "#534ab7",
    doctor: "Dr. Le Thi Bich",
    specialty: "Neurology",
    hospital: "City Hospital",
    date: addDays(0),
    time: "09:00 AM",
    type: "Follow-up",
    status: "pending",
  },
  {
    id: 3,
    patient: "Pham Duc Thanh",
    age: 38,
    initials: "PT",
    color: "#f5a623",
    doctor: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    hospital: "Riverside",
    date: addDays(0),
    time: "10:00 AM",
    type: "Consultation",
    status: "completed",
  },
  {
    id: 4,
    patient: "Nguyen Thi Lan",
    age: 55,
    initials: "NL",
    color: "#1a9e5c",
    doctor: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    hospital: "TKT Medical",
    date: addDays(0),
    time: "11:00 AM",
    type: "Check-up",
    status: "cancelled",
  },
  {
    id: 5,
    patient: "Vo Minh Khoa",
    age: 29,
    initials: "VK",
    color: "#e24b4a",
    doctor: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    hospital: "City Hospital",
    date: addDays(2),
    time: "02:00 PM",
    type: "Follow-up",
    status: "pending",
  },
  {
    id: 6,
    patient: "Hoang Thi Thu",
    age: 48,
    initials: "HT",
    color: "#077d7d",
    doctor: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    hospital: "TKT Medical",
    date: addDays(3),
    time: "09:30 AM",
    type: "Consultation",
    status: "confirmed",
  },
  {
    id: 7,
    patient: "Dang Van Long",
    age: 33,
    initials: "DL",
    color: "#ff6b35",
    doctor: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    hospital: "Riverside",
    date: addDays(5),
    time: "03:00 PM",
    type: "Check-up",
    status: "pending",
  },
  {
    id: 8,
    patient: "Bui Thi Huong",
    age: 60,
    initials: "BH",
    color: "#9b59b6",
    doctor: "Dr. Le Thi Bich",
    specialty: "Neurology",
    hospital: "City Hospital",
    date: addDays(-2),
    time: "10:00 AM",
    type: "Follow-up",
    status: "completed",
  },
  {
    id: 9,
    patient: "Cao Minh Tri",
    age: 41,
    initials: "CT",
    color: "#e67e22",
    doctor: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    hospital: "TKT Medical",
    date: addDays(-3),
    time: "08:30 AM",
    type: "Consultation",
    status: "completed",
  },
  {
    id: 10,
    patient: "Dinh Thi Nga",
    age: 52,
    initials: "DN",
    color: "#16a085",
    doctor: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    hospital: "Riverside",
    date: addDays(-1),
    time: "04:00 PM",
    type: "Check-up",
    status: "cancelled",
  },
];

const todayStr = fmt(today);

// ── Tabs config ──────────────────────────────────────────────────────────────
const TABS = ["All", "Today", "Upcoming", "Completed", "Cancelled"];

// ── Status display ────────────────────────────────────────────────────────────
const STATUS = {
  pending: { label: "Pending", cls: "badge-pending" },
  confirmed: { label: "Confirmed", cls: "badge-confirmed" },
  completed: { label: "Completed", cls: "badge-completed" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

// ── Type display ──────────────────────────────────────────────────────────────
const TYPE_CLS = {
  "Check-up": "type-checkup",
  "Follow-up": "type-followup",
  Consultation: "type-consult",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SummaryCard
// ─────────────────────────────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, cls }) => (
  <div className={`summary-card ${cls}`}>
    <div className="summary-card__icon">
      <Icon />
    </div>
    <div>
      <p className="summary-card__value">{value}</p>
      <p className="summary-card__label">{label}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AppointmentRow
// ─────────────────────────────────────────────────────────────────────────────
const AppointmentRow = ({ appt, onConfirm, onDone, onCancel }) => {
  const {
    patient,
    age,
    initials,
    color,
    doctor,
    specialty,
    hospital,
    date,
    time,
    type,
    status,
  } = appt;
  const s = STATUS[status];

  return (
    <div className="appt-row">
      {/* Avatar */}
      <div className="appt-avatar" style={{ background: color }}>
        {initials}
      </div>

      {/* Patient */}
      <div className="appt-patient">
        <p className="appt-patient__name">
          {patient} <span className="appt-patient__age">{age}y</span>
        </p>
        <span className={`appt-type ${TYPE_CLS[type]}`}>{type}</span>
      </div>

      {/* Doctor */}
      <div className="appt-doctor">
        <p className="appt-doctor__name">
          <FaUserMd /> {doctor}
        </p>
        <p className="appt-doctor__spec">
          <FaStethoscope /> {specialty}
        </p>
      </div>

      {/* Hospital */}
      <div className="appt-hospital">
        <FaHospital /> {hospital}
      </div>

      {/* Date & Time */}
      <div className="appt-datetime">
        <p>
          <BsCalendar2WeekFill /> {date}
        </p>
        <p>
          <BsClockFill /> {time}
        </p>
      </div>

      {/* Status */}
      <span className={`appt-badge ${s.cls}`}>{s.label}</span>

      {/* Actions */}
      <div className="appt-actions">
        {status === "pending" && (
          <>
            <button className="btn-confirm" onClick={() => onConfirm(appt.id)}>
              <FaCheck /> Confirm
            </button>
            <button className="btn-cancel" onClick={() => onCancel(appt.id)}>
              <FaTimes />
            </button>
          </>
        )}
        {status === "confirmed" && (
          <>
            <button className="btn-done" onClick={() => onDone(appt.id)}>
              <FaCheckCircle /> Done
            </button>
            <button className="btn-cancel" onClick={() => onCancel(appt.id)}>
              <FaTimes />
            </button>
          </>
        )}
        {status === "completed" && (
          <button className="btn-view">
            <FaEye /> View
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminAppointmentsPage() {
  const [data, setData] = useState(INIT_DATA);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterHosp, setFilterHosp] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // ── Actions ────────────────────────────────────────────────────────────────
  const update = (id, status) =>
    setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  // ── Tab counter ───────────────────────────────────────────────────────────
  const count = (tab) => {
    if (tab === "All") return data.length;
    if (tab === "Today") return data.filter((a) => a.date === todayStr).length;
    if (tab === "Upcoming")
      return data.filter((a) => new Date(a.date) > today && a.date !== todayStr)
        .length;
    if (tab === "Completed")
      return data.filter((a) => a.status === "completed").length;
    if (tab === "Cancelled")
      return data.filter((a) => a.status === "cancelled").length;
    return 0;
  };

  // ── Summary counts ────────────────────────────────────────────────────────
  const todayData = data.filter((a) => a.date === todayStr);
  const summary = [
    {
      label: "Total Today",
      value: todayData.length,
      icon: BsCalendar2WeekFill,
      cls: "s-teal",
    },
    {
      label: "Confirmed",
      value: todayData.filter((a) => a.status === "confirmed").length,
      icon: FaCheckCircle,
      cls: "s-green",
    },
    {
      label: "Pending",
      value: todayData.filter((a) => a.status === "pending").length,
      icon: FaClock,
      cls: "s-amber",
    },
    {
      label: "Cancelled",
      value: todayData.filter((a) => a.status === "cancelled").length,
      icon: FaBan,
      cls: "s-danger",
    },
  ];

  // ── Filter + sort pipeline ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...data];

    // Tab
    if (activeTab === "Today") list = list.filter((a) => a.date === todayStr);
    if (activeTab === "Upcoming")
      list = list.filter(
        (a) => new Date(a.date) > today && a.date !== todayStr,
      );
    if (activeTab === "Completed")
      list = list.filter((a) => a.status === "completed");
    if (activeTab === "Cancelled")
      list = list.filter((a) => a.status === "cancelled");

    // Type
    if (filterType !== "all") list = list.filter((a) => a.type === filterType);

    // Hospital
    if (filterHosp !== "all")
      list = list.filter((a) => a.hospital === filterHosp);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.patient.toLowerCase().includes(q) ||
          a.doctor.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortBy === "date-desc")
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "date-asc")
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "name-asc")
      list.sort((a, b) => a.patient.localeCompare(b.patient));

    return list;
  }, [data, activeTab, filterType, filterHosp, search, sortBy]);

  return (
    <div className="admin-appts">
      {/* Header */}
      <div className="appts-header">
        <div>
          <h1 className="appts-title">Appointments Management</h1>
          <p className="appts-sub">
            Monitor and manage all patient appointments.
          </p>
        </div>
        <span className="appts-today-badge">
          <BsCalendar2WeekFill /> {count("Today")} today
        </span>
      </div>

      {/* Summary */}
      <div className="summary-row">
        {summary.map((s) => (
          <SummaryCard key={s.label} {...s} />
        ))}
      </div>

      {/* Tabs */}
      <div className="appts-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`appts-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} <span className="tab-count">{count(tab)}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="appts-toolbar">
        {/* Search */}
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search patient or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Check-up">Check-up</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Consultation">Consultation</option>
          </select>
        </div>

        {/* Hospital filter */}
        <div className="toolbar-select">
          <FaHospital className="toolbar-select__icon" />
          <select
            value={filterHosp}
            onChange={(e) => setFilterHosp(e.target.value)}
          >
            <option value="all">All Hospitals</option>
            <option value="TKT Medical">TKT Medical</option>
            <option value="City Hospital">City Hospital</option>
            <option value="Riverside">Riverside</option>
          </select>
        </div>

        {/* Sort */}
        <div className="toolbar-select">
          <FaSortAmountDown className="toolbar-select__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="name-asc">Patient A→Z</option>
          </select>
        </div>

        {/* Export */}
        <button className="btn-export">
          <FaDownload /> Export
        </button>
      </div>

      {/* Result count */}
      <p className="appts-count">
        Showing <strong>{filtered.length}</strong> appointment
        {filtered.length !== 1 ? "s" : ""}
      </p>

      {/* List */}
      <div className="appts-list">
        {filtered.length === 0 ? (
          <div className="appts-empty">
            <BsCalendar2WeekFill className="appts-empty__icon" />
            <p>No appointments found.</p>
            <span>Try adjusting your search or filters.</span>
          </div>
        ) : (
          filtered.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appt={appt}
              onConfirm={(id) => update(id, "confirmed")}
              onDone={(id) => update(id, "completed")}
              onCancel={(id) => update(id, "cancelled")}
            />
          ))
        )}
      </div>
    </div>
  );
}
