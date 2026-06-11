import { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUserInjured,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaLock,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./DoctorSchedulePage.scss";
import { timeSlotService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";

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

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// "YYYY-MM-DD" theo giờ địa phương (tránh lỗi lệch múi giờ toISOString)
function dateKey(date) {
  if (typeof date === 'string') return date.substring(0, 10);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Xác định trạng thái của slot từ dữ liệu backend
function getSlotStatus(slot) {
  if (slot.isBooked) return "booked";
  if (slot.isBlocked) return "blocked";
  return "available";
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ConfirmBlockDialog
// Hỏi xác nhận trước khi block slot
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmBlockDialog({ slot, onConfirm, onCancel, saving }) {
  const ref = useRef();

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !saving) onCancel();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onCancel, saving]);

  // Đóng bằng Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !saving) onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel, saving]);

  const displayDate = new Date(slot.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return ReactDOM.createPortal(
    <div className="confirm-block-backdrop">
      <div className="confirm-block-dialog" ref={ref}>
        <div className="confirm-block-dialog__icon">
          <FaLock />
        </div>
        <h3 className="confirm-block-dialog__title">Khoá khung giờ này?</h3>
        <p className="confirm-block-dialog__info">
          <BsCalendar2WeekFill /> {displayDate}
          <span className="confirm-block-dialog__sep">·</span>
          <BsClockFill /> {slot.startTime} - {slot.endTime}
        </p>
        <p className="confirm-block-dialog__desc">
          Bệnh nhân sẽ không thể đặt lịch vào khung giờ này nếu bạn chọn khoá.
        </p>
        <div className="confirm-block-dialog__actions">
          <button className="confirm-block-dialog__btn confirm-block-dialog__btn--cancel" onClick={onCancel} disabled={saving}>
            Giữ nguyên
          </button>
          <button className="confirm-block-dialog__btn confirm-block-dialog__btn--confirm" onClick={() => onConfirm(slot)} disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm" /> : <><FaLock /> Xác nhận Khóa</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotPopover
// ─────────────────────────────────────────────────────────────────────────────
function SlotPopover({ slot, anchorRect, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  const POPOVER_W = 240;
  const GAP = 8;
  let left = anchorRect.right + GAP;
  let top = anchorRect.top;
  if (left + POPOVER_W > window.innerWidth - 12) left = anchorRect.left - POPOVER_W - GAP;
  if (top + 180 > window.innerHeight - 12) top = window.innerHeight - 180 - 12;

  const appt = slot.appointment;
  const isWaiting = appt?.status === "pending" || appt?.status === "waiting";
  
  return ReactDOM.createPortal(
    <div className="slot-popover" ref={ref} style={{ position: "fixed", top, left }}>
      <button className="slot-popover__close" onClick={onClose}><FaTimes /></button>
      <p className="slot-popover__patient">
        <FaUserInjured /> {appt?.patientProfile?.fullName || "Bệnh nhân"}
      </p>
      <p className="slot-popover__type small text-muted mb-2">Lịch khám bệnh</p>
      <p className="slot-popover__time">
        <BsClockFill /> {slot.startTime} - {slot.endTime}
      </p>
      <p className="small text-muted mb-2 mt-1">Cơ sở: {slot.hospital?.name}</p>

      <span className={`slot-popover__status-badge ${isWaiting ? "slot-popover__status-badge--waiting" : "slot-popover__status-badge--confirmed"}`}>
        {isWaiting ? <FaClock className="me-1" /> : <FaCheckCircle className="me-1" />}
        {isWaiting ? "Chờ xác nhận" : appt?.status === "completed" ? "Đã khám" : "Đã xác nhận"}
      </span>
      
      {/* Để quản lý, bác sĩ nên qua tab Lịch hẹn. Popover này chỉ để xem nhanh */}
      <div className="mt-2 pt-2 border-top text-center">
        <small className="text-muted fst-italic">Vào mục Quản lý Lịch hẹn để thao tác</small>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlotCell
// ─────────────────────────────────────────────────────────────────────────────
function SlotCell({
  slotData,
  onRequestBlock,
  onUnblock,
  onBookedClick,
  activePopoverId,
  onClosePopover,
}) {
  const status = getSlotStatus(slotData);
  const isPopoverOpen = activePopoverId === slotData.id;
  const cellRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    if (status === "available") {
      onRequestBlock(slotData);
    } else if (status === "blocked") {
      onUnblock(slotData);
    } else if (status === "booked") {
      const rect = cellRef.current?.getBoundingClientRect();
      onBookedClick(slotData.id, rect);
    }
  };

  return (
    <div
      ref={cellRef}
      className={`slot-cell slot-cell--${status}`}
      onClick={handleClick}
      title={
        status === "available"
          ? "Click để khóa slot này"
          : status === "blocked"
            ? "Click để mở khóa"
            : `Đã đặt bởi ${slotData.appointment?.patientProfile?.fullName || "Bệnh nhân"}`
      }
    >
      <span className="slot-cell__hour">{slotData.startTime}</span>

      {status === "available" && <span className="slot-cell__available-label">Trống</span>}
      {status === "blocked" && <span className="slot-cell__blocked-label">Đã khóa</span>}

      {status === "booked" && (
        <div className="slot-cell__booked-info">
          <span className="slot-cell__patient text-truncate" style={{ maxWidth: '100%' }}>
            {slotData.appointment?.patientProfile?.fullName?.split(" ").pop() || "BN"}
          </span>
          <span className={`slot-cell__booking-badge ${slotData.appointment?.status === "pending" ? "slot-cell__booking-badge--waiting" : "slot-cell__booking-badge--confirmed"}`}>
            ✓
          </span>
        </div>
      )}

      {isPopoverOpen && status === "booked" && (
        <SlotPopover
          slot={slotData}
          anchorRect={cellRef.current?.getBoundingClientRect()}
          onClose={onClosePopover}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorSchedulePage() {
  const today = new Date();

  const [weekStart, setWeekStart] = useState(getMonday(today));
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState("");

  const [blockTarget, setBlockTarget] = useState(null);
  const [savingBlock, setSavingBlock] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState(null);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  // Fetch slots for the current week
  const fetchWeekSlots = async () => {
    try {
      setLoading(true);
      const sunday = new Date(weekStart);
      sunday.setDate(sunday.getDate() + 6);
      
      const params = {
        fromDate: dateKey(weekStart),
        toDate: dateKey(sunday),
        limit: 200, // Đủ lớn để lấy hết slot trong 1 tuần
      };
      
      // Apply filters if any
      if (filterStatus === "booked") params.isBooked = true;
      else if (filterStatus === "blocked") params.isBlocked = true;
      else if (filterStatus === "available") {
        params.isBooked = false;
        params.isBlocked = false;
      }

      const res = await timeSlotService.getDoctorTimeSlots(params);
      const fetchedSlots = res.data?.data?.data || res.data?.data || [];
      setSlots(fetchedSlots);
    } catch (error) {
      console.error("Lỗi khi tải lịch làm việc:", error);
      toast.error("Không thể tải lịch làm việc. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart, filterStatus]);

  // Handlers for Navigation
  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  // Organize slots into grid data structure
  // slotsByDateAndHour[dateKey][startTime] = slot
  const { gridSlots, uniqueHours } = useMemo(() => {
    const grid = {};
    const hoursSet = new Set();
    
    weekDays.forEach(d => {
      grid[dateKey(d)] = {};
    });

    slots.forEach(slot => {
      const dk = dateKey(slot.date);
      if (grid[dk]) {
        grid[dk][slot.startTime] = slot;
      }
      hoursSet.add(slot.startTime);
    });

    // Sắp xếp các giờ từ bé đến lớn
    const sortedHours = Array.from(hoursSet).sort((a, b) => {
      const [hA, mA] = a.split(':').map(Number);
      const [hB, mB] = b.split(':').map(Number);
      return (hA * 60 + mA) - (hB * 60 + mB);
    });

    return { gridSlots: grid, uniqueHours: sortedHours };
  }, [slots, weekDays]);

  // Handlers for Slot actions
  const handleRequestBlock = (slot) => {
    setBlockTarget(slot);
  };

  const handleConfirmBlock = async (slot) => {
    try {
      setSavingBlock(true);
      await timeSlotService.doctorBlockTimeSlot(slot.id, { isBlocked: true });
      toast.success("Khóa slot thành công!");
      setBlockTarget(null);
      fetchWeekSlots();
    } catch (error) {
      console.error("Lỗi khóa slot:", error);
      toast.error(error.response?.data?.message || "Không thể khóa slot này.");
    } finally {
      setSavingBlock(false);
    }
  };

  const handleUnblock = async (slot) => {
    try {
      await timeSlotService.doctorBlockTimeSlot(slot.id, { isBlocked: false });
      toast.success("Mở khóa slot thành công!");
      fetchWeekSlots();
    } catch (error) {
      console.error("Lỗi mở khóa slot:", error);
      toast.error(error.response?.data?.message || "Không thể mở khóa slot này.");
    }
  };

  const handleBookedClick = (id, rect) => {
    setActivePopoverId((prev) => (prev === id ? null : id));
  };

  const monthLabel = weekStart.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const countByStatus = {
    available: slots.filter((s) => !s.isBooked && !s.isBlocked).length,
    booked: slots.filter((s) => s.isBooked).length,
    blocked: slots.filter((s) => s.isBlocked).length,
  };

  return (
    <div className="schedule-page">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="schedule-page__header">
        <div>
          <h1 className="schedule-page__title">Lịch làm việc của tôi</h1>
          <p className="schedule-page__subtitle">
            Xem và quản lý các khung giờ làm việc. Click để mở/khoá slot.
          </p>
        </div>
      </div>

      {/* ── Toolbar & Filters ────────────────────────────── */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-6 d-flex flex-wrap gap-2 week-summary">
            <span className="week-summary__item week-summary__item--available">
              <FaCheckCircle /> {countByStatus.available} Trống
            </span>
            <span className="week-summary__item week-summary__item--booked">
              <FaUserInjured /> {countByStatus.booked} Đã đặt
            </span>
            <span className="week-summary__item week-summary__item--blocked">
              <FaBan /> {countByStatus.blocked} Đã khóa
            </span>
          </div>
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center">
              <FaFilter className="text-muted me-2" />
              <select className="form-select border-0 bg-light" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="available">Chỉ xem slot trống</option>
                <option value="booked">Chỉ xem slot đã đặt</option>
                <option value="blocked">Chỉ xem slot đã khóa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Calendar ─────────────────────────────────────── */}
      <div className="calendar-card position-relative" style={{ minHeight: '300px' }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {/* Nav */}
        <div className="calendar-nav">
          <button className="calendar-nav__btn" onClick={prevWeek}>
            <FaChevronLeft />
          </button>
          <h2 className="calendar-nav__month text-capitalize">
            <BsCalendar2WeekFill /> Tháng {weekStart.getMonth() + 1}, {weekStart.getFullYear()}
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
              const daySlots = gridSlots[key];

              return (
                <div key={key} className="calendar-col">
                  {/* Day header */}
                  <div className={`calendar-col__header ${isToday ? "calendar-col__header--today" : ""}`}>
                    <span className="calendar-col__day-name">{DAY_NAMES[idx]}</span>
                    <span className={`calendar-col__day-num ${isToday ? "calendar-col__day-num--today" : ""}`}>
                      {day.getDate()}
                    </span>
                    {isToday && <span className="calendar-col__today-dot" />}
                  </div>

                  {/* Slots */}
                  <div className="calendar-col__slots">
                    {uniqueHours.length === 0 ? (
                      <div className="text-center py-4 text-muted small opacity-50">Không có slot</div>
                    ) : (
                      uniqueHours.map((hour) => {
                        const slotData = daySlots[hour];
                        if (!slotData) {
                          return (
                            <div key={hour} className="slot-cell-empty" style={{ height: '52px' }} />
                          );
                        }

                        return (
                          <SlotCell
                            key={slotData.id}
                            slotData={slotData}
                            onRequestBlock={handleRequestBlock}
                            onUnblock={handleUnblock}
                            onBookedClick={handleBookedClick}
                            activePopoverId={activePopoverId}
                            onClosePopover={() => setActivePopoverId(null)}
                          />
                        );
                      })
                    )}
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
            Trống — Nhấn để khoá
          </span>
          <span className="calendar-legend__item">
            <span className="calendar-legend__dot calendar-legend__dot--booked" />
            Bệnh nhân đã đặt
          </span>
          <span className="calendar-legend__item">
            <span className="calendar-legend__dot calendar-legend__dot--blocked" />
            Đã khoá — Nhấn để mở
          </span>
        </div>
      </div>

      {/* ── Confirm Block Dialog ─────────────────────────── */}
      {blockTarget && (
        <ConfirmBlockDialog
          slot={blockTarget}
          onConfirm={handleConfirmBlock}
          onCancel={() => setBlockTarget(null)}
          saving={savingBlock}
        />
      )}
    </div>
  );
}