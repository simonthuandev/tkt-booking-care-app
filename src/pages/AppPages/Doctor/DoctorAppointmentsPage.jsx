// ─────────────────────────────────────────────────────────────────────────────
// DoctorAppointmentsPage.jsx
// Danh sách appointments của bác sĩ: tabs, search, filter, sort, actions
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  BsCalendar2WeekFill,
  BsClockFill,
  BsPersonBadgeFill,
} from "react-icons/bs";
import {
  FaUserInjured,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaSortAmountDown,
  FaEye,
  FaTimes,
  FaCheck,
  FaBan,
  FaFilter,
  FaStethoscope,
} from "react-icons/fa";
import "./DoctorAppointmentsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const today     = new Date();
const fmt       = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const addDays   = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); };

const INIT_APPOINTMENTS = [
  { id: 1,  patient: "Tran Thi Mai",    age: 45, avatar: "TM", color: "#0ba3a3", type: "Check-up",     date: addDays(0),  time: "08:00 AM", status: "waiting"   },
  { id: 2,  patient: "Le Van Binh",     age: 62, avatar: "LB", color: "#077d7d", type: "Follow-up",    date: addDays(0),  time: "09:00 AM", status: "confirmed"  },
  { id: 3,  patient: "Pham Duc Thanh",  age: 38, avatar: "PT", color: "#f5a623", type: "Consultation", date: addDays(0),  time: "10:00 AM", status: "completed"  },
  { id: 4,  patient: "Nguyen Thi Lan",  age: 55, avatar: "NL", color: "#534ab7", type: "Check-up",     date: addDays(0),  time: "11:00 AM", status: "cancelled"  },
  { id: 5,  patient: "Vo Minh Khoa",    age: 29, avatar: "VK", color: "#1a9e5c", type: "Follow-up",    date: addDays(2),  time: "02:00 PM", status: "waiting"    },
  { id: 6,  patient: "Hoang Thi Thu",   age: 48, avatar: "HT", color: "#ff6b35", type: "Consultation", date: addDays(3),  time: "09:30 AM", status: "confirmed"  },
  { id: 7,  patient: "Dang Van Long",   age: 33, avatar: "DL", color: "#0d2b45", type: "Check-up",     date: addDays(5),  time: "03:00 PM", status: "waiting"    },
  { id: 8,  patient: "Bui Thi Huong",   age: 60, avatar: "BH", color: "#9b59b6", type: "Follow-up",    date: addDays(-2), time: "10:00 AM", status: "completed"  },
  { id: 9,  patient: "Cao Minh Tri",    age: 41, avatar: "CT", color: "#e67e22", type: "Consultation", date: addDays(-3), time: "08:30 AM", status: "completed"  },
  { id: 10, patient: "Dinh Thi Nga",    age: 52, avatar: "DN", color: "#16a085", type: "Check-up",     date: addDays(-1), time: "04:00 PM", status: "cancelled"  },
];

// ── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { key: "all",       label: "All"       },
  { key: "today",     label: "Today"     },
  { key: "upcoming",  label: "Upcoming"  },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  waiting:   { label: "Waiting",   icon: FaClock,       className: "status--waiting"   },
  confirmed: { label: "Confirmed", icon: BsPersonBadgeFill, className: "status--confirmed" },
  completed: { label: "Completed", icon: FaCheckCircle, className: "status--completed" },
  cancelled: { label: "Cancelled", icon: FaBan,         className: "status--cancelled" },
};

// ── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  "Check-up":    "type--checkup",
  "Follow-up":   "type--followup",
  "Consultation":"type--consultation",
};

// ── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first"  },
  { value: "date-asc",  label: "Oldest first"  },
  { value: "name-asc",  label: "Name A → Z"    },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: TypeTag
// ─────────────────────────────────────────────────────────────────────────────
function TypeTag({ type }) {
  return (
    <span className={`appt-type-tag ${TYPE_CONFIG[type] || ""}`}>
      <FaStethoscope />
      {type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StatusBadge
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`appt-status-badge ${cfg.className}`}>
      <Icon />
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AppointmentRow
// ─────────────────────────────────────────────────────────────────────────────
function AppointmentRow({ appt, onConfirm, onMarkDone, onCancel }) {
  const { patient, age, avatar, color, type, date, time, status } = appt;

  return (
    <div className="doc-appt-row">

      {/* ── Avatar ───────────────────────────────────── */}
      <div className="doc-appt-row__avatar" style={{ background: color }}>
        {avatar}
      </div>

      {/* ── Patient info ─────────────────────────────── */}
      <div className="doc-appt-row__patient">
        <p className="doc-appt-row__name">
          {patient}
          <span className="doc-appt-row__age">{age} yrs</span>
        </p>
        <TypeTag type={type} />
      </div>

      {/* ── Date & time ──────────────────────────────── */}
      <div className="doc-appt-row__datetime">
        <span className="doc-appt-row__date">
          <BsCalendar2WeekFill />
          {date}
        </span>
        <span className="doc-appt-row__time">
          <BsClockFill />
          {time}
        </span>
      </div>

      {/* ── Status badge ─────────────────────────────── */}
      <div className="doc-appt-row__status">
        <StatusBadge status={status} />
      </div>

      {/* ── Actions ──────────────────────────────────── */}
      <div className="doc-appt-row__actions">
        {status === "waiting" && (
          <>
            <button className="doc-appt-btn doc-appt-btn--confirm" onClick={() => onConfirm(appt.id)}>
              <FaCheck /> Confirm
            </button>
            <button className="doc-appt-btn doc-appt-btn--cancel" onClick={() => onCancel(appt.id)}>
              <FaTimes /> Cancel
            </button>
          </>
        )}

        {status === "confirmed" && (
          <>
            <button className="doc-appt-btn doc-appt-btn--done" onClick={() => onMarkDone(appt.id)}>
              <FaCheckCircle /> Mark Done
            </button>
            <button className="doc-appt-btn doc-appt-btn--cancel" onClick={() => onCancel(appt.id)}>
              <FaTimes /> Cancel
            </button>
          </>
        )}

        {status === "completed" && (
          <button className="doc-appt-btn doc-appt-btn--view">
            <FaEye /> View Notes
          </button>
        )}

        {/* cancelled → không có action */}
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState(INIT_APPOINTMENTS);
  const [activeTab,    setActiveTab]    = useState("all");
  const [search,       setSearch]       = useState("");
  const [filterType,   setFilterType]   = useState("all");
  const [sortBy,       setSortBy]       = useState("date-desc");

  const todayStr = fmt(today);

  // ── Actions ───────────────────────────────────────────────────────────────
  const updateStatus = (id, newStatus) =>
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

  const handleConfirm  = (id) => updateStatus(id, "confirmed");
  const handleMarkDone = (id) => updateStatus(id, "completed");
  const handleCancel   = (id) => updateStatus(id, "cancelled");

  // ── Tab counter helpers ───────────────────────────────────────────────────
  const countTab = (key) => {
    if (key === "all")       return appointments.length;
    if (key === "today")     return appointments.filter((a) => a.date === todayStr).length;
    if (key === "upcoming")  return appointments.filter((a) => new Date(a.date) > today && a.date !== todayStr).length;
    if (key === "completed") return appointments.filter((a) => a.status === "completed").length;
    if (key === "cancelled") return appointments.filter((a) => a.status === "cancelled").length;
    return 0;
  };

  // ── Filter + sort (useMemo) ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...appointments];

    // Tab filter
    if (activeTab === "today")     list = list.filter((a) => a.date === todayStr);
    if (activeTab === "upcoming")  list = list.filter((a) => new Date(a.date) > today && a.date !== todayStr);
    if (activeTab === "completed") list = list.filter((a) => a.status === "completed");
    if (activeTab === "cancelled") list = list.filter((a) => a.status === "cancelled");

    // Type filter
    if (filterType !== "all") list = list.filter((a) => a.type === filterType);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.patient.toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === "date-desc") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "date-asc")  list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "name-asc")  list.sort((a, b) => a.patient.localeCompare(b.patient));

    return list;
  }, [appointments, activeTab, filterType, search, sortBy]);

  return (
    <div className="doc-appts-page">

      {/* ── Page Header ────────────────────────────────── */}
      <div className="doc-appts-page__header">
        <div>
          <h1 className="doc-appts-page__title">Appointments</h1>
          <p className="doc-appts-page__subtitle">
            Manage and track all your patient appointments.
          </p>
        </div>
        <div className="doc-appts-page__today-badge">
          <BsCalendar2WeekFill />
          {countTab("today")} appointments today
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="doc-appts-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`doc-appts-tabs__btn ${activeTab === key ? "doc-appts-tabs__btn--active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
            <span className="doc-appts-tabs__count">{countTab(key)}</span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="doc-appts-toolbar">
        {/* Search */}
        <div className="doc-appts-search">
          <FaSearch className="doc-appts-search__icon" />
          <input
            type="text"
            placeholder="Search patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="doc-appts-search__input"
          />
        </div>

        {/* Type filter */}
        <div className="doc-appts-select-wrap">
          <FaFilter className="doc-appts-select-wrap__icon" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Check-up">Check-up</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Consultation">Consultation</option>
          </select>
        </div>

        {/* Sort */}
        <div className="doc-appts-select-wrap">
          <FaSortAmountDown className="doc-appts-select-wrap__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results count ──────────────────────────────── */}
      <p className="doc-appts-results-count">
        Showing <strong>{filtered.length}</strong> appointment{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── List ───────────────────────────────────────── */}
      <div className="doc-appts-list">
        {filtered.length === 0 ? (
          <div className="doc-appts-empty">
            <FaUserInjured className="doc-appts-empty__icon" />
            <p className="doc-appts-empty__text">No appointments found.</p>
            <p className="doc-appts-empty__hint">Try adjusting your search or filter.</p>
          </div>
        ) : (
          filtered.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appt={appt}
              onConfirm={handleConfirm}
              onMarkDone={handleMarkDone}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>

    </div>
  );
}
