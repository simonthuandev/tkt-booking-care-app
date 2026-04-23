// ─────────────────────────────────────────────────────────────────────────────
// DoctorSchedulePage.jsx
// Weekly calendar: 7 cột ngày, time slots, modal thêm slot, popover detail
//
// Flow:
//   available → click → ConfirmBlockDialog → xác nhận → blocked
//   blocked   → click → toggle về available (không cần xác nhận)
//   booked    → do bệnh nhân đặt → click → SlotPopover (Confirm / Cancel)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUserInjured,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaLock,
} from "react-icons/fa";
import "./DoctorSchedulePage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Lấy ngày đầu tuần (thứ 2) từ một ngày bất kỳ
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
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

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// So sánh 2 ngày bỏ qua giờ
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// "2026-04-17"
function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA GENERATOR
// slot "booked"    = bệnh nhân đã đặt từ phía User (bác sĩ không tạo)
// slot "available" = bác sĩ mở khung giờ cho BN đặt
// slot "blocked"   = bác sĩ tự block (bận / nghỉ)
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
  { patient: "Tran Thi Mai", type: "Check-up", bookingStatus: "waiting" },
  { patient: "Le Van Binh", type: "Follow-up", bookingStatus: "confirmed" },
  { patient: "Pham Duc Thanh", type: "Consultation", bookingStatus: "waiting" },
  { patient: "Nguyen Thi Lan", type: "Check-up", bookingStatus: "confirmed" },
  { patient: "Vo Minh Khoa", type: "Follow-up", bookingStatus: "waiting" },
  {
    patient: "Hoang Thi Thu",
    type: "Consultation",
    bookingStatus: "confirmed",
  },
  { patient: "Dang Van Long", type: "Check-up", bookingStatus: "waiting" },
  { patient: "Bui Thi Huong", type: "Follow-up", bookingStatus: "confirmed" },
];

function generateSlots(monday) {
  const slots = {};
  const week = getWeekDays(monday);
  const today = new Date();

  week.forEach((day, dayIdx) => {
    const key = dateKey(day);
    slots[key] = {};

    HOURS.forEach((hour, hourIdx) => {
      const r = (dayIdx * 11 + hourIdx * 3) % 7;

      if (day < today && !isSameDay(day, today)) {
        // Quá khứ: booked hoặc blocked
        if (r < 3) {
          const pb =
            BOOKED_PATIENTS[(dayIdx * 8 + hourIdx) % BOOKED_PATIENTS.length];
          slots[key][hour] = { status: "booked", ...pb };
        } else {
          slots[key][hour] = { status: "blocked" };
        }
      } else {
        // Hôm nay + tương lai: available / booked / blocked
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
// SUB-COMPONENT: ConfirmBlockDialog
// Hiện khi bác sĩ click vào slot "available"
// Hỏi xác nhận trước khi block slot đó
//
// Render qua Portal (position: fixed) để không bị clip
// Props:
//   dateStr, hour  — slot cần block
//   onConfirm      — xác nhận block
//   onCancel       — hủy, không làm gì
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmBlockDialog({ dateStr, hour, onConfirm, onCancel }) {
  const ref = useRef();

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      onCancel();
    };
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onCancel]);

  // Đóng bằng Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  // Format ngày hiển thị
  const displayDate = new Date(dateStr + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  );

  return ReactDOM.createPortal(
    // Backdrop mờ
    <div
      className="confirm-block-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="confirm-block-dialog" ref={ref}>
        {/* Icon */}
        <div className="confirm-block-dialog__icon">
          <FaLock />
        </div>

        {/* Title */}
        <h3 className="confirm-block-dialog__title">Block this slot?</h3>

        {/* Thông tin slot */}
        <p className="confirm-block-dialog__info">
          <BsCalendar2WeekFill /> {displayDate}
          <span className="confirm-block-dialog__sep">·</span>
          <BsClockFill /> {hour}
        </p>

        <p className="confirm-block-dialog__desc">
          This slot will be marked as unavailable. Patients will not be able to
          book it.
        </p>

        {/* Actions */}
        <div className="confirm-block-dialog__actions">
          <button
            className="confirm-block-dialog__btn confirm-block-dialog__btn--cancel"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onCancel}
          >
            Keep Available
          </button>
          <button
            className="confirm-block-dialog__btn confirm-block-dialog__btn--confirm"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onConfirm}
          >
            <FaLock /> Block Slot
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotPopover
// Hiện khi click slot "booked" — xem thông tin bệnh nhân
// Bác sĩ có thể Confirm (nếu waiting) hoặc Cancel lịch hẹn
// Render qua Portal tránh bị clip bởi overflow của calendar grid
// ─────────────────────────────────────────────────────────────────────────────
function SlotPopover({ slot, hour, anchorRect, onClose, onConfirm, onCancel }) {
  const ref = useRef();

  // Đóng khi mousedown ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      onClose();
    };
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Tính vị trí: bên phải cell, fallback bên trái nếu tràn
  const POPOVER_W = 220;
  const GAP = 8;
  let left = anchorRect.right + GAP;
  let top = anchorRect.top;
  if (left + POPOVER_W > window.innerWidth - 12)
    left = anchorRect.left - POPOVER_W - GAP;
  if (top + 210 > window.innerHeight - 12) top = window.innerHeight - 210 - 12;

  const isWaiting = slot.bookingStatus === "waiting";

  return ReactDOM.createPortal(
    <div
      className="slot-popover"
      ref={ref}
      style={{ position: "fixed", top, left }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Nút X — dùng onMouseDown để chạy trước global handler */}
      <button
        className="slot-popover__close"
        onMouseDown={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FaTimes />
      </button>

      {/* Thông tin bệnh nhân */}
      <p className="slot-popover__patient">
        <FaUserInjured /> {slot.patient}
      </p>
      <p className="slot-popover__type">{slot.type}</p>
      <p className="slot-popover__time">
        <BsClockFill /> {hour}
      </p>

      {/* Badge trạng thái */}
      <span
        className={`slot-popover__status-badge ${isWaiting ? "slot-popover__status-badge--waiting" : "slot-popover__status-badge--confirmed"}`}
      >
        {isWaiting ? <FaClock /> : <FaCheckCircle />}
        {isWaiting ? "Waiting" : "Confirmed"}
      </span>

      {/* Actions */}
      <div className="slot-popover__actions">
        {/* Confirm: chỉ hiện khi waiting */}
        {isWaiting && (
          <button
            className="slot-popover__action-btn slot-popover__action-btn--confirm"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onConfirm}
          >
            <FaCheckCircle /> Confirm
          </button>
        )}
        <button
          className="slot-popover__action-btn slot-popover__action-btn--cancel"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onCancel}
        >
          <FaBan /> Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotCell
// Mỗi ô time slot trong calendar
//
// Click behavior:
//   available → mở ConfirmBlockDialog → xác nhận → blocked
//   blocked   → toggle về available ngay (không cần xác nhận)
//   booked    → mở SlotPopover (Confirm / Cancel)
// ─────────────────────────────────────────────────────────────────────────────
function SlotCell({
  hour,
  slotData,
  dateStr,
  onRequestBlock,
  onUnblock,
  onBookedClick,
  activePopover,
  onClosePopover,
  onConfirmAppt,
  onCancelAppt,
}) {
  const { status, patient, type, bookingStatus } = slotData;
  const isPopoverOpen =
    activePopover?.dateStr === dateStr && activePopover?.hour === hour;
  const cellRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();

    if (status === "available") {
      // Mở confirm dialog trước khi block
      onRequestBlock(dateStr, hour);
    } else if (status === "blocked") {
      // Unblock ngay, không cần xác nhận
      onUnblock(dateStr, hour);
    } else if (status === "booked") {
      const rect = cellRef.current?.getBoundingClientRect();
      onBookedClick(dateStr, hour, rect);
    }
  };

  return (
    <div
      ref={cellRef}
      className={`slot-cell slot-cell--${status}`}
      onClick={handleClick}
      title={
        status === "available"
          ? "Click to block this slot"
          : status === "blocked"
            ? "Click to unblock"
            : `${patient} · ${type}`
      }
    >
      {/* Giờ */}
      <span className="slot-cell__hour">{hour}</span>

      {status === "available" && (
        <span className="slot-cell__available-label">Available</span>
      )}

      {status === "blocked" && (
        <span className="slot-cell__blocked-label">Blocked</span>
      )}

      {status === "booked" && (
        <div className="slot-cell__booked-info">
          <span className="slot-cell__patient">{patient}</span>
          <span className="slot-cell__type">{type}</span>
          {/* Mini badge trạng thái booking */}
          <span
            className={`slot-cell__booking-badge ${bookingStatus === "waiting" ? "slot-cell__booking-badge--waiting" : "slot-cell__booking-badge--confirmed"}`}
          >
            {bookingStatus === "waiting" ? "Pending" : "✓"}
          </span>
        </div>
      )}

      {/* Popover qua Portal */}
      {isPopoverOpen && status === "booked" && activePopover?.rect && (
        <SlotPopover
          slot={slotData}
          hour={hour}
          anchorRect={activePopover.rect}
          onClose={onClosePopover}
          onConfirm={() => {
            onConfirmAppt(dateStr, hour);
            onClosePopover();
          }}
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
// Bác sĩ tự thêm khung giờ available mới
// ─────────────────────────────────────────────────────────────────────────────
function AddSlotModal({ onClose, weekDays, onAdd }) {
  const [form, setForm] = useState({
    date: dateKey(weekDays[0]),
    startTime: "08:00",
    endTime: "09:00",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        <div className="add-slot-modal__header">
          <h3 className="add-slot-modal__title">
            <BsCalendar2WeekFill /> Add Available Slot
          </h3>
          <button className="add-slot-modal__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="add-slot-modal__body">
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

        <div className="add-slot-modal__footer">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn modal-btn--add"
            onClick={() => {
              onAdd(form.date, form.startTime);
              onClose();
            }}
          >
            <FaPlus /> Add Slot
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

  const [weekStart, setWeekStart] = useState(getMonday(today));
  const [slots, setSlots] = useState(() => generateSlots(getMonday(today)));
  const [showModal, setShowModal] = useState(false);
  const [activePopover, setActivePopover] = useState(null); // { dateStr, hour, rect }

  // Slot đang chờ xác nhận block: { dateStr, hour } | null
  const [blockTarget, setBlockTarget] = useState(null);

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

  // ── Click available → lưu target, mở ConfirmBlockDialog ──────────────────
  const handleRequestBlock = (dateStr, hour) => {
    setBlockTarget({ dateStr, hour });
  };

  // ── Xác nhận block → đổi available thành blocked ─────────────────────────
  const handleConfirmBlock = () => {
    const { dateStr, hour } = blockTarget;
    setSlots((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: { status: "blocked" },
      },
    }));
    setBlockTarget(null);
  };

  // ── Unblock → đổi blocked về available (không cần xác nhận) ──────────────
  const handleUnblock = (dateStr, hour) => {
    setSlots((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: { status: "available" },
      },
    }));
  };

  // ── Click booked → mở popover ─────────────────────────────────────────────
  const handleBookedClick = (dateStr, hour, rect) => {
    setActivePopover((prev) =>
      prev?.dateStr === dateStr && prev?.hour === hour
        ? null
        : { dateStr, hour, rect },
    );
  };

  // ── Bác sĩ Confirm lịch bệnh nhân đặt → bookingStatus: "confirmed" ────────
  const handleConfirmAppt = (dateStr, hour) => {
    setSlots((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: { ...prev[dateStr][hour], bookingStatus: "confirmed" },
      },
    }));
  };

  // ── Bác sĩ Cancel lịch hẹn → slot trở về available ───────────────────────
  const handleCancelAppt = (dateStr, hour) => {
    setSlots((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [hour]: { status: "available" },
      },
    }));
  };

  // ── Thêm slot available mới từ modal ──────────────────────────────────────
  const handleAddSlot = (dateStr, hour) => {
    setSlots((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], [hour]: { status: "available" } },
    }));
  };

  const monthLabel = weekStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
            Set your available hours. Patients will book from open slots.
          </p>
        </div>
        <button
          className="schedule-page__add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Slot
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
        {/* Nav */}
        <div className="calendar-nav">
          <button className="calendar-nav__btn" onClick={prevWeek}>
            <FaChevronLeft />
          </button>
          <h2 className="calendar-nav__month">
            <BsCalendar2WeekFill /> {monthLabel}
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
                          onRequestBlock={handleRequestBlock}
                          onUnblock={handleUnblock}
                          onBookedClick={handleBookedClick}
                          activePopover={activePopover}
                          onClosePopover={() => setActivePopover(null)}
                          onConfirmAppt={handleConfirmAppt}
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
            Booked by patient
          </span>
          <span className="calendar-legend__item">
            <span className="calendar-legend__dot calendar-legend__dot--blocked" />
            Blocked — click to unblock
          </span>
        </div>
      </div>

      {/* ── Add Slot Modal ───────────────────────────────── */}
      {showModal && (
        <AddSlotModal
          weekDays={weekDays}
          onClose={() => setShowModal(false)}
          onAdd={handleAddSlot}
        />
      )}

      {/* ── Confirm Block Dialog ─────────────────────────── */}
      {/* Hiện khi bác sĩ click slot available, hỏi xác nhận trước khi block */}
      {blockTarget && (
        <ConfirmBlockDialog
          dateStr={blockTarget.dateStr}
          hour={blockTarget.hour}
          onConfirm={handleConfirmBlock}
          onCancel={() => setBlockTarget(null)}
        />
      )}
    </div>
  );
}
