// ─────────────────────────────────────────────────────────────────────────────
// AdminSchedulesPage.jsx  —  Schedules Management
// Admin xem/quản lý lịch của tất cả bác sĩ
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import {
  FaUserMd,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaHospital,
  FaStethoscope,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaLock,
  FaLockOpen,
  FaEye,
  FaCalendarAlt,
  FaUserInjured,
  FaTimes,
} from "react-icons/fa";
import "./AdminSchedulesPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getMonday = (date) => {
  const d = new Date(date),
    day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
};
const getWeekDays = (monday) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const dateKey = (d) => d.toISOString().slice(0, 10);
const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    id: 1,
    name: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    hospital: "TKT Medical",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    initials: "NA",
  },
  {
    id: 2,
    name: "Dr. Le Thi Bich",
    specialty: "Neurology",
    hospital: "City Hospital",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    initials: "LB",
  },
  {
    id: 3,
    name: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    hospital: "Riverside",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    initials: "TH",
  },
  {
    id: 4,
    name: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    hospital: "TKT Medical",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    initials: "PM",
  },
  {
    id: 5,
    name: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    hospital: "Riverside",
    avatarUrl: "https://i.pravatar.cc/150?img=48",
    initials: "VL",
  },
  {
    id: 6,
    name: "Dr. Hoang Van Nam",
    specialty: "Pediatrics",
    hospital: "City Hospital",
    avatarUrl: "https://i.pravatar.cc/150?img=57",
    initials: "HN",
  },
];

const PATIENTS = [
  "Tran Thi Mai",
  "Le Van Binh",
  "Pham Duc Thanh",
  "Nguyen Thi Lan",
  "Vo Minh Khoa",
  "Hoang Thi Thu",
  "Dang Van Long",
  "Bui Thi Huong",
];
const TYPES = ["Check-up", "Follow-up", "Consultation"];
const BOOKING_STATUSES = ["waiting", "confirmed"];

// Generate slots cho từng bác sĩ trong tuần
const generateDoctorSlots = (doctorId, monday) => {
  const week = getWeekDays(monday);
  const today = new Date();
  const slots = {};
  week.forEach((day, di) => {
    const key = dateKey(day);
    slots[key] = {};
    HOURS.forEach((hour, hi) => {
      const r = (doctorId * 13 + di * 11 + hi * 7) % 7;
      if (day < today && !isSameDay(day, today)) {
        slots[key][hour] =
          r < 3
            ? {
                status: "booked",
                patient: PATIENTS[(doctorId + di + hi) % PATIENTS.length],
                type: TYPES[(di + hi) % 3],
                bookingStatus: "confirmed",
              }
            : { status: "blocked" };
      } else {
        if (r < 3) slots[key][hour] = { status: "available" };
        else if (r < 5)
          slots[key][hour] = {
            status: "booked",
            patient: PATIENTS[(doctorId + di + hi) % PATIENTS.length],
            type: TYPES[(di + hi) % 3],
            bookingStatus: BOOKING_STATUSES[(di + hi) % 2],
          };
        else slots[key][hour] = { status: "blocked" };
      }
    });
  });
  return slots;
};

// Build initial slots state cho tất cả bác sĩ
const buildAllSlots = (monday) => {
  const all = {};
  DOCTORS.forEach((d) => {
    all[d.id] = generateDoctorSlots(d.id, monday);
  });
  return all;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotCell
// ─────────────────────────────────────────────────────────────────────────────
const SlotCell = ({
  hour,
  slotData,
  showDoctorAvatar,
  doctorAvatarUrl,
  doctorInitials,
  onClick,
}) => {
  const { status, patient, type, bookingStatus } = slotData || {
    status: "available",
  };
  return (
    <div
      className={`sch-slot sch-slot--${status}`}
      onClick={onClick}
      title={
        status === "booked"
          ? `${patient} · ${type}`
          : status === "blocked"
            ? "Blocked"
            : "Available"
      }
    >
      <span className="sch-slot__hour">{hour}</span>

      {status === "available" && <span className="sch-slot__label">Open</span>}

      {status === "blocked" && <span className="sch-slot__label">Blocked</span>}

      {status === "booked" && (
        <div className="sch-slot__booked">
          {/* Khi xem All Doctors: hiện avatar nhỏ */}
          {showDoctorAvatar && (
            <img
              src={doctorAvatarUrl}
              alt=""
              className="sch-slot__doc-avatar"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <span className="sch-slot__patient">{patient}</span>
          <span className="sch-slot__type">{type}</span>
          <span
            className={`sch-slot__booking-badge ${bookingStatus === "waiting" ? "badge-wait" : "badge-conf"}`}
          >
            {bookingStatus === "waiting" ? "Pending" : "✓"}
          </span>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotDetailModal (Bootstrap Modal)
// Admin có thêm quyền so với Doctor
// ─────────────────────────────────────────────────────────────────────────────
const SlotDetailModal = ({
  slot,
  doctor,
  onClose,
  onConfirm,
  onCancel,
  onBlock,
  onUnblock,
}) => {
  if (!slot) return null;
  const { hour, dateStr, slotData } = slot;
  const { status, patient, type, bookingStatus } = slotData;

  const displayDate = new Date(dateStr + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <BsCalendar2WeekFill
                  className="me-2"
                  style={{ color: "#0ba3a3" }}
                />
                Slot Details
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Doctor info */}
              <div className="slot-detail-doc">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="slot-detail-doc__avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0ba3a3&color=fff`;
                  }}
                />
                <div>
                  <p className="slot-detail-doc__name">{doctor.name}</p>
                  <p className="slot-detail-doc__spec">
                    <FaStethoscope className="me-1" />
                    {doctor.specialty} · {doctor.hospital}
                  </p>
                </div>
              </div>

              {/* Slot info */}
              <div className="slot-detail-info">
                <div className="slot-detail-info__item">
                  <BsCalendar2WeekFill />
                  <span>{displayDate}</span>
                </div>
                <div className="slot-detail-info__item">
                  <BsClockFill />
                  <span>{hour}</span>
                </div>
                <div className="slot-detail-info__item">
                  <span
                    className={`sch-status-badge sch-status-badge--${status}`}
                  >
                    {status === "available" && (
                      <>
                        <FaLockOpen /> Available
                      </>
                    )}
                    {status === "blocked" && (
                      <>
                        <FaLock /> Blocked
                      </>
                    )}
                    {status === "booked" && (
                      <>
                        <FaUserInjured /> Booked
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Patient info nếu booked */}
              {status === "booked" && (
                <div className="slot-detail-patient">
                  <p className="slot-detail-patient__label">Patient</p>
                  <p className="slot-detail-patient__name">
                    <FaUserInjured className="me-1" />
                    {patient}
                  </p>
                  <p className="slot-detail-patient__type">{type}</p>
                  <span
                    className={`sch-slot__booking-badge ${bookingStatus === "waiting" ? "badge-wait" : "badge-conf"}`}
                    style={{ fontSize: ".75rem", padding: "3px 10px" }}
                  >
                    {bookingStatus === "waiting"
                      ? "⏳ Waiting for confirmation"
                      : "✓ Confirmed"}
                  </span>
                </div>
              )}
            </div>

            {/* Footer actions theo status */}
            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
              </button>

              {status === "booked" && bookingStatus === "waiting" && (
                <button className="btn btn-success-custom" onClick={onConfirm}>
                  <FaCheckCircle className="me-1" /> Confirm
                </button>
              )}
              {status === "booked" && (
                <button className="btn btn-danger" onClick={onCancel}>
                  <FaTimes className="me-1" /> Cancel Appointment
                </button>
              )}
              {status === "available" && (
                <button className="btn btn-block-custom" onClick={onBlock}>
                  <FaLock className="me-1" /> Block Slot
                </button>
              )}
              {status === "blocked" && (
                <button className="btn btn-unblock-custom" onClick={onUnblock}>
                  <FaLockOpen className="me-1" /> Unblock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AddScheduleModal (Bootstrap Modal)
// ─────────────────────────────────────────────────────────────────────────────
const AddScheduleModal = ({ onClose, onSave, weekDays }) => {
  const [form, setForm] = useState({
    doctorId: String(DOCTORS[0].id),
    date: dateKey(weekDays[0]),
    startTime: "08:00",
    endTime: "09:00",
    repeat: "none",
    note: "",
  });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const selectedDoc =
    DOCTORS.find((d) => String(d.id) === form.doctorId) || DOCTORS[0];

  const timeOptions = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaPlus className="me-2" style={{ color: "#0ba3a3" }} />
                Add Schedule Slot
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {/* Doctor select + avatar preview */}
                <div className="col-12">
                  <label className="form-label">Doctor</label>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={selectedDoc.avatarUrl}
                      alt={selectedDoc.name}
                      className="add-sch-avatar"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoc.name)}&background=0ba3a3&color=fff`;
                      }}
                    />
                    <select
                      className="form-select"
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handle}
                    >
                      {DOCTORS.map((d) => (
                        <option key={d.id} value={String(d.id)}>
                          {d.name} — {d.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date */}
                <div className="col-12">
                  <label className="form-label">Date</label>
                  <select
                    className="form-select"
                    name="date"
                    value={form.date}
                    onChange={handle}
                  >
                    {weekDays.map((d) => (
                      <option key={dateKey(d)} value={dateKey(d)}>
                        {d.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start + End time */}
                <div className="col-6">
                  <label className="form-label">Start Time</label>
                  <select
                    className="form-select"
                    name="startTime"
                    value={form.startTime}
                    onChange={handle}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">End Time</label>
                  <select
                    className="form-select"
                    name="endTime"
                    value={form.endTime}
                    onChange={handle}
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Repeat */}
                <div className="col-12">
                  <label className="form-label">Repeat</label>
                  <select
                    className="form-select"
                    name="repeat"
                    value={form.repeat}
                    onChange={handle}
                  >
                    <option value="none">None (one time)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {/* Note */}
                <div className="col-12">
                  <label className="form-label">Note (optional)</label>
                  <textarea
                    className="form-control"
                    name="note"
                    rows={2}
                    value={form.note}
                    onChange={handle}
                    placeholder="e.g. Morning shift only"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-save"
                onClick={() => {
                  onSave(form);
                  onClose();
                }}
              >
                <FaPlus className="me-1" /> Add Slot
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminSchedulesPage() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(getMonday(today));
  const [allSlots, setAllSlots] = useState(() =>
    buildAllSlots(getMonday(today)),
  );
  const [selectedDoc, setSelectedDoc] = useState("all"); // "all" hoặc doctor id (number)
  const [filterHosp, setFilterHosp] = useState("all");
  const [activeSlot, setActiveSlot] = useState(null); // { doctorId, dateStr, hour }
  const [showAddModal, setShowAddModal] = useState(false);

  const weekDays = getWeekDays(weekStart);

  // ── Chuyển tuần ────────────────────────────────────────────────────────────
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
    setAllSlots((prev) => {
      const newSlots = buildAllSlots(d);
      // Giữ lại thay đổi của tuần cũ, merge tuần mới
      const merged = {};
      DOCTORS.forEach((doc) => {
        merged[doc.id] = { ...newSlots[doc.id], ...(prev[doc.id] || {}) };
      });
      return merged;
    });
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
    setAllSlots((prev) => {
      const newSlots = buildAllSlots(d);
      const merged = {};
      DOCTORS.forEach((doc) => {
        merged[doc.id] = { ...newSlots[doc.id], ...(prev[doc.id] || {}) };
      });
      return merged;
    });
  };

  // ── Doctors hiển thị sau filter ────────────────────────────────────────────
  const visibleDoctors = useMemo(() => {
    let list = DOCTORS;
    if (selectedDoc !== "all")
      list = list.filter((d) => d.id === Number(selectedDoc));
    if (filterHosp !== "all")
      list = list.filter((d) => d.hospital === filterHosp);
    return list;
  }, [selectedDoc, filterHosp]);

  // ── Slot actions ───────────────────────────────────────────────────────────
  const updateSlot = (doctorId, dateStr, hour, data) => {
    setAllSlots((prev) => ({
      ...prev,
      [doctorId]: {
        ...prev[doctorId],
        [dateStr]: {
          ...(prev[doctorId]?.[dateStr] || {}),
          [hour]: data,
        },
      },
    }));
  };

  const handleConfirm = () => {
    const { doctorId, dateStr, hour, slotData } = activeSlot;
    updateSlot(doctorId, dateStr, hour, {
      ...slotData,
      bookingStatus: "confirmed",
    });
    setActiveSlot(null);
  };

  const handleCancelAppt = () => {
    const { doctorId, dateStr, hour } = activeSlot;
    updateSlot(doctorId, dateStr, hour, { status: "available" });
    setActiveSlot(null);
  };

  const handleBlock = () => {
    const { doctorId, dateStr, hour } = activeSlot;
    updateSlot(doctorId, dateStr, hour, { status: "blocked" });
    setActiveSlot(null);
  };

  const handleUnblock = () => {
    const { doctorId, dateStr, hour } = activeSlot;
    updateSlot(doctorId, dateStr, hour, { status: "available" });
    setActiveSlot(null);
  };

  const handleAddSlot = (form) => {
    const docId = Number(form.doctorId);
    updateSlot(docId, form.date, form.startTime, { status: "available" });
  };

  // ── Summary counts (tuần hiện tại, tất cả bác sĩ) ─────────────────────────
  const allWeekSlots = DOCTORS.flatMap((d) =>
    weekDays.flatMap((day) =>
      Object.values(allSlots[d.id]?.[dateKey(day)] || {}),
    ),
  );
  const summary = {
    total: allWeekSlots.length,
    available: allWeekSlots.filter((s) => s.status === "available").length,
    booked: allWeekSlots.filter((s) => s.status === "booked").length,
    blocked: allWeekSlots.filter((s) => s.status === "blocked").length,
  };

  const monthLabel = weekStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const showAllDocs = selectedDoc === "all";

  // Doctor đang active slot (cho modal)
  const activeDoctor = activeSlot
    ? DOCTORS.find((d) => d.id === activeSlot.doctorId)
    : null;

  return (
    <div className="admin-sch">
      {/* Header */}
      <div className="sch-header">
        <div>
          <h1 className="sch-title">Schedules Management</h1>
          <p className="sch-sub">View and manage all doctor schedules.</p>
        </div>
        <div className="sch-header__right">
          <span className="sch-badge">
            <BsCalendar2WeekFill /> {summary.total} slots this week
          </span>
          <button className="btn-add-sch" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Schedule
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="sch-summary">
        {[
          { label: "Total Slots", value: summary.total, cls: "s-teal" },
          { label: "Available", value: summary.available, cls: "s-green" },
          { label: "Booked", value: summary.booked, cls: "s-navy" },
          { label: "Blocked", value: summary.blocked, cls: "s-gray" },
        ].map((s) => (
          <div key={s.label} className={`sch-summary__card ${s.cls}`}>
            <p className="sch-summary__value">{s.value}</p>
            <p className="sch-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="sch-filterbar">
        {/* Doctor select */}
        <div className="filterbar-doctor">
          {selectedDoc !== "all" && (
            <img
              src={DOCTORS.find((d) => d.id === Number(selectedDoc))?.avatarUrl}
              alt=""
              className="filterbar-doctor__avatar"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="toolbar-select">
            <FaUserMd className="toolbar-select__icon" />
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
            >
              <option value="all">All Doctors</option>
              {DOCTORS.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
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

        {/* Selected doctor info */}
        {selectedDoc !== "all" &&
          (() => {
            const doc = DOCTORS.find((d) => d.id === Number(selectedDoc));
            return doc ? (
              <div className="filterbar-info">
                <FaStethoscope /> {doc.specialty} · {doc.hospital}
              </div>
            ) : null;
          })()}
      </div>

      {/* Calendar card */}
      <div className="sch-calendar">
        {/* Nav */}
        <div className="sch-cal-nav">
          <button className="sch-cal-nav__btn" onClick={prevWeek}>
            <FaChevronLeft />
          </button>
          <h2 className="sch-cal-nav__month">
            <BsCalendar2WeekFill /> {monthLabel}
          </h2>
          <button className="sch-cal-nav__btn" onClick={nextWeek}>
            <FaChevronRight />
          </button>
        </div>

        {/* Khi All Doctors: hiện từng bác sĩ theo hàng */}
        {showAllDocs ? (
          <div className="sch-all-doctors">
            {visibleDoctors.map((doc) => (
              <div key={doc.id} className="sch-doctor-row">
                {/* Doctor label */}
                <div className="sch-doctor-row__label">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="sch-doctor-row__avatar"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0ba3a3&color=fff`;
                    }}
                  />
                  <div>
                    <p className="sch-doctor-row__name">{doc.name}</p>
                    <p className="sch-doctor-row__spec">{doc.specialty}</p>
                  </div>
                </div>

                {/* Week grid cho bác sĩ này */}
                <div className="sch-doctor-row__grid-wrap">
                  <div className="sch-mini-grid">
                    {weekDays.map((day, idx) => {
                      const key = dateKey(day);
                      const isToday = isSameDay(day, today);
                      const daySlots = allSlots[doc.id]?.[key] || {};
                      return (
                        <div key={key} className="sch-mini-col">
                          <div
                            className={`sch-mini-col__header ${isToday ? "sch-mini-col__header--today" : ""}`}
                          >
                            <span>{DAY_NAMES[idx]}</span>
                            <span className={isToday ? "today-num" : ""}>
                              {day.getDate()}
                            </span>
                          </div>
                          <div className="sch-mini-col__slots">
                            {HOURS.map((hour) => {
                              const slotData = daySlots[hour] || {
                                status: "available",
                              };
                              return (
                                <SlotCell
                                  key={hour}
                                  hour={hour}
                                  slotData={slotData}
                                  showDoctorAvatar={false}
                                  doctorAvatarUrl={doc.avatarUrl}
                                  doctorInitials={doc.initials}
                                  onClick={() =>
                                    setActiveSlot({
                                      doctorId: doc.id,
                                      dateStr: key,
                                      hour,
                                      slotData,
                                    })
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single doctor: full calendar view */
          <div className="sch-grid-wrap">
            {/* Day headers */}
            <div className="sch-grid">
              {weekDays.map((day, idx) => {
                const key = dateKey(day);
                const isToday = isSameDay(day, today);
                const doc = visibleDoctors[0];
                if (!doc) return null;
                const daySlots = allSlots[doc.id]?.[key] || {};
                return (
                  <div key={key} className="sch-col">
                    <div
                      className={`sch-col__header ${isToday ? "sch-col__header--today" : ""}`}
                    >
                      <span className="sch-col__day-name">
                        {DAY_NAMES[idx]}
                      </span>
                      <span
                        className={`sch-col__day-num ${isToday ? "sch-col__day-num--today" : ""}`}
                      >
                        {day.getDate()}
                      </span>
                      {isToday && <span className="sch-col__today-dot" />}
                    </div>
                    <div className="sch-col__slots">
                      {HOURS.map((hour) => {
                        const slotData = daySlots[hour] || {
                          status: "available",
                        };
                        return (
                          <SlotCell
                            key={hour}
                            hour={hour}
                            slotData={slotData}
                            showDoctorAvatar={false}
                            doctorAvatarUrl={doc?.avatarUrl}
                            doctorInitials={doc?.initials}
                            onClick={() =>
                              setActiveSlot({
                                doctorId: doc.id,
                                dateStr: key,
                                hour,
                                slotData,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="sch-legend">
          {[
            { cls: "sch-legend__dot--available", text: "Available" },
            { cls: "sch-legend__dot--booked", text: "Booked" },
            { cls: "sch-legend__dot--blocked", text: "Blocked" },
          ].map((l) => (
            <span key={l.text} className="sch-legend__item">
              <span className={`sch-legend__dot ${l.cls}`} /> {l.text}
            </span>
          ))}
        </div>
      </div>

      {/* Slot Detail Modal */}
      {activeSlot && activeDoctor && (
        <SlotDetailModal
          slot={activeSlot}
          doctor={activeDoctor}
          onClose={() => setActiveSlot(null)}
          onConfirm={handleConfirm}
          onCancel={handleCancelAppt}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
        />
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <AddScheduleModal
          weekDays={weekDays}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSlot}
        />
      )}
    </div>
  );
}
