// ─────────────────────────────────────────────────────────────────────────────
// DoctorSchedulePage.jsx
// Weekly calendar: 7 cột ngày, time slots, modal thêm slot, popover detail
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  BsCalendar2WeekFill,
  BsClockFill,
  BsPersonBadgeFill,
} from "react-icons/bs";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUserInjured,
  FaCheckCircle,
  FaClock,
  FaBan,
} from "react-icons/fa";
import "./DoctorSchedulePage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Lấy ngày đầu tuần (thứ 2) từ một ngày bất kỳ
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Tạo mảng 7 ngày từ ngày đầu tuần
function getWeekDays(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// Format: "Mon", "Tue"...
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// So sánh ngày (bỏ qua giờ)
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Tạo key string cho ngày: "2026-04-17"
function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA GENERATOR
// Tạo slots cho tuần hiện tại
// ─────────────────────────────────────────────────────────────────────────────
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

const BOOKED_PATIENTS = [
  { patient: "Tran Thi Mai", type: "Check-up" },
  { patient: "Le Van Binh", type: "Follow-up" },
  { patient: "Pham Duc Thanh", type: "Consultation" },
  { patient: "Nguyen Thi Lan", type: "Check-up" },
  { patient: "Vo Minh Khoa", type: "Follow-up" },
  { patient: "Hoang Thi Thu", type: "Consultation" },
  { patient: "Dang Van Long", type: "Check-up" },
  { patient: "Bui Thi Huong", type: "Follow-up" },
];

// Tạo initial slots dựa trên ngày đầu tuần
function generateSlots(monday) {
  const slots = {}; // key: "YYYY-MM-DD", value: { [hour]: { status, patient?, type? } }

  const week = getWeekDays(monday);
  const today = new Date();

  week.forEach((day, dayIdx) => {
    const key = dateKey(day);
    slots[key] = {};

    HOURS.forEach((hour, hourIdx) => {
      // Quá khứ → done (dùng blocked để đơn giản)
      if (day < today && !isSameDay(day, today)) {
        // Ngày trong quá khứ: mix booked/blocked
        const r = (dayIdx * 8 + hourIdx) % 5;
        if (r < 3) {
          const pb =
            BOOKED_PATIENTS[(dayIdx * 8 + hourIdx) % BOOKED_PATIENTS.length];
          slots[key][hour] = { status: "booked", ...pb };
        } else {
          slots[key][hour] = { status: "blocked" };
        }
      } else {
        // Hôm nay + tương lai: mix available/booked/blocked
        const r = (dayIdx * 11 + hourIdx * 3) % 7;
        if (r < 3) {
          slots[key][hour] = { status: "available" };
        } else if (r < 5) {
          const pb =
            BOOKED_PATIENTS[(dayIdx * 8 + hourIdx) % BOOKED_PATIENTS.length];
          slots[key][hour] = { status: "booked", ...pb };
        } else {
          slots[key][hour] = { status: "blocked" };
        }
      }
    });
  });

  return slots;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotPopover – render qua Portal ra ngoài slot-cell
// Tránh bị clip bởi overflow:hidden của calendar-grid và không bị mất
// khi di chuột từ cell sang popover
// ─────────────────────────────────────────────────────────────────────────────
function SlotPopover({ slot, hour, anchorRect, onClose, onCancel }) {
  const ref = useRef();

  // Đóng khi mousedown ra ngoài popover
  useEffect(() => {
    const handler = (e) => {
      // Nếu click nằm trong popover → không đóng
      if (ref.current && ref.current.contains(e.target)) return;
      onClose();
    };
    // delay 0 để tránh đóng ngay khi click mở
    const t = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // position: fixed nên dùng anchorRect.top trực tiếp (viewport coords)
  const POPOVER_W = 210;
  const GAP = 8;

  let left = anchorRect.right + GAP;
  let top = anchorRect.top;

  // Flip sang trái nếu tràn màn hình phải
  if (left + POPOVER_W > window.innerWidth - 12) {
    left = anchorRect.left - POPOVER_W - GAP;
  }

  // Đẩy lên nếu tràn đáy viewport
  if (top + 170 > window.innerHeight - 12) {
    top = window.innerHeight - 170 - 12;
  }

  return ReactDOM.createPortal(
    <div
      className="slot-popover"
      ref={ref}
      style={{ position: "fixed", top, left }}
      // stopPropagation để click bên trong popover không bubble ra document
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Nút X — dùng onMouseDown thay onClick để chạy trước global handler */}
      <button
        className="slot-popover__close"
        onMouseDown={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FaTimes />
      </button>

      <p className="slot-popover__patient">
        <FaUserInjured />
        {slot.patient}
      </p>

      <p className="slot-popover__type">{slot.type}</p>

      <p className="slot-popover__time">
        <BsClockFill />
        {hour}
      </p>

      <button
        className="slot-popover__cancel-btn"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onCancel}
      >
        <FaBan />
        Cancel Appointment
      </button>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotCell – 1 ô time slot
// ─────────────────────────────────────────────────────────────────────────────
function SlotCell({
  hour,
  slotData,
  dateStr,
  onToggleBlock,
  onBookedClick,
  activePopover,
  onClosePopover,
  onCancelAppt,
}) {
  const { status, patient, type } = slotData;
  const isPopoverOpen =
    activePopover?.dateStr === dateStr && activePopover?.hour === hour;
  const cellRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation(); // tránh bubble lên calendar
    if (status === "available") {
      onToggleBlock(dateStr, hour);
    } else if (status === "booked") {
      // Lấy vị trí cell để định vị popover
      const rect = cellRef.current?.getBoundingClientRect();
      onBookedClick(dateStr, hour, rect);
    }
  };

  return (
    <div
      ref={cellRef}
      className={`slot-cell slot-cell--${status}`}
      onClick={handleClick}
    >
      {/* Giờ */}
      <span className="slot-cell__hour">{hour}</span>

      {/* Nội dung theo status */}
      {status === "available" && (
        <span className="slot-cell__available-label">Available</span>
      )}

      {status === "booked" && (
        <div className="slot-cell__booked-info">
          <span className="slot-cell__patient">{patient}</span>
          <span className="slot-cell__type">{type}</span>
        </div>
      )}

      {status === "blocked" && (
        <span className="slot-cell__blocked-label">Blocked</span>
      )}

      {/* Popover render qua Portal — không còn bị clip bởi cell */}
      {isPopoverOpen && status === "booked" && activePopover?.rect && (
        <SlotPopover
          slot={slotData}
          hour={hour}
          anchorRect={activePopover.rect}
          onClose={onClosePopover}
          onCancel={() => {
            onCancelAppt(dateStr, hour);
            onClosePopover();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AddSlotModal
// ─────────────────────────────────────────────────────────────────────────────
function AddSlotModal({ onClose, weekDays }) {
  const [form, setForm] = useState({
    date: dateKey(weekDays[0]),
    startTime: "08:00",
    endTime: "09:00",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    // Mock: chỉ đóng modal, không thêm thật
    onClose();
  };

  // Đóng khi click backdrop
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

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
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="add-slot-modal">
        {/* Header */}
        <div className="add-slot-modal__header">
          <h3 className="add-slot-modal__title">
            <BsCalendar2WeekFill />
            Add Time Slot
          </h3>
          <button className="add-slot-modal__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="add-slot-modal__body">
          {/* Chọn ngày */}
          <div className="modal-form__group">
            <label>Date</label>
            <select name="date" value={form.date} onChange={handle}>
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

          {/* Start / End time */}
          <div className="modal-form__row">
            <div className="modal-form__group">
              <label>Start Time</label>
              <select name="startTime" value={form.startTime} onChange={handle}>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-form__group">
              <label>End Time</label>
              <select name="endTime" value={form.endTime} onChange={handle}>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="add-slot-modal__footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn--add" onClick={handleAdd}>
            <FaPlus />
            Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorSchedulePage() {
  const today = new Date();

  // Tuần hiện tại (monday)
  const [weekStart, setWeekStart] = useState(getMonday(today));

  // Slots state: { "YYYY-MM-DD": { "08:00": { status, patient?, type? } } }
  const [slots, setSlots] = useState(() => generateSlots(getMonday(today)));

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Popover state: { dateStr, hour } | null
  const [activePopover, setActivePopover] = useState(null);

  const weekDays = getWeekDays(weekStart);

  // ── Chuyển tuần ────────────────────────────────────────────────────────────
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
    setSlots((prev) => ({ ...generateSlots(d), ...prev }));
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
    setSlots((prev) => ({ ...generateSlots(d), ...prev }));
  };

  // ── Toggle available ↔ blocked ─────────────────────────────────────────────
  const handleToggleBlock = (dateStr, hour) => {
    setSlots((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: {
          ...prev[dateStr][hour],
          status:
            prev[dateStr][hour].status === "available"
              ? "blocked"
              : "available",
        },
      },
    }));
  };

  // ── Click booked → mở popover kèm vị trí cell ────────────────────────────
  const handleBookedClick = (dateStr, hour, rect) => {
    setActivePopover((prev) =>
      prev?.dateStr === dateStr && prev?.hour === hour
        ? null
        : { dateStr, hour, rect },
    );
  };

  // ── Cancel appointment → đổi về available ─────────────────────────────────
  const handleCancelAppt = (dateStr, hour) => {
    setSlots((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: { status: "available" },
      },
    }));
  };

  // ── Tháng/năm hiển thị ─────────────────────────────────────────────────────
  const monthLabel = weekStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ── Đếm slot theo trạng thái trong tuần ───────────────────────────────────
  const allSlots = weekDays.flatMap((d) =>
    Object.values(slots[dateKey(d)] || {}),
  );
  const countByStatus = {
    available: allSlots.filter((s) => s.status === "available").length,
    booked: allSlots.filter((s) => s.status === "booked").length,
    blocked: allSlots.filter((s) => s.status === "blocked").length,
  };

  return (
    <div className="schedule-page">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="schedule-page__header">
        <div>
          <h1 className="schedule-page__title">My Schedule</h1>
          <p className="schedule-page__subtitle">
            Manage your weekly time slots and appointments.
          </p>
        </div>
        <button
          className="schedule-page__add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
          Add Slot
        </button>
      </div>

      {/* ── Week summary badges ──────────────────────────── */}
      <div className="week-summary">
        <span className="week-summary__item week-summary__item--available">
          <FaCheckCircle /> {countByStatus.available} Available
        </span>
        <span className="week-summary__item week-summary__item--booked">
          <FaUserInjured /> {countByStatus.booked} Booked
        </span>
        <span className="week-summary__item week-summary__item--blocked">
          <FaBan /> {countByStatus.blocked} Blocked
        </span>
      </div>

      {/* ── Calendar ─────────────────────────────────────── */}
      <div className="calendar-card">
        {/* Calendar nav header */}
        <div className="calendar-nav">
          <button className="calendar-nav__btn" onClick={prevWeek}>
            <FaChevronLeft />
          </button>
          <h2 className="calendar-nav__month">
            <BsCalendar2WeekFill />
            {monthLabel}
          </h2>
          <button className="calendar-nav__btn" onClick={nextWeek}>
            <FaChevronRight />
          </button>
        </div>

        {/* Grid 7 cột */}
        <div className="calendar-grid-wrap">
          <div className="calendar-grid">
            {weekDays.map((day, idx) => {
              const key = dateKey(day);
              const isToday = isSameDay(day, today);
              const daySlots = slots[key] || {};

              return (
                <div key={key} className="calendar-col">
                  {/* Day header */}
                  <div
                    className={`calendar-col__header ${isToday ? "calendar-col__header--today" : ""}`}
                  >
                    <span className="calendar-col__day-name">
                      {DAY_NAMES[idx]}
                    </span>
                    <span
                      className={`calendar-col__day-num ${isToday ? "calendar-col__day-num--today" : ""}`}
                    >
                      {day.getDate()}
                    </span>
                    {isToday && <span className="calendar-col__today-dot" />}
                  </div>

                  {/* Slots */}
                  <div className="calendar-col__slots">
                    {HOURS.map((hour) => {
                      const slotData = daySlots[hour] || {
                        status: "available",
                      };
                      return (
                        <SlotCell
                          key={hour}
                          hour={hour}
                          slotData={slotData}
                          dateStr={key}
                          onToggleBlock={handleToggleBlock}
                          onBookedClick={handleBookedClick}
                          activePopover={activePopover}
                          onClosePopover={() => setActivePopover(null)}
                          onCancelAppt={handleCancelAppt}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          <span className="calendar-legend__item">
            <span className="calendar-legend__dot calendar-legend__dot--available" />
            Available — click to block
          </span>
          <span className="calendar-legend__item">
            <span className="calendar-legend__dot calendar-legend__dot--booked" />
            Booked — click for details
          </span>
          <span className="calendar-legend__item">
            <span className="calendar-legend__dot calendar-legend__dot--blocked" />
            Blocked
          </span>
        </div>
      </div>

      {/* ── Add Slot Modal ───────────────────────────────── */}
      {showModal && (
        <AddSlotModal weekDays={weekDays} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
