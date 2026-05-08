// ─────────────────────────────────────────────────────────────────────────────
// UserBookingPage.jsx  —  3-step appointment booking flow
// Step 1: Chọn bác sĩ  →  Step 2: Chọn ngày/giờ  →  Step 3: Xác nhận
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaHospital,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaArrowRight,
  FaStar,
  FaPhone,
  FaBirthdayCake,
  FaClipboardList,
  FaStickyNote,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
} from "react-icons/fa";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import "./UserBookingPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    id: 1,
    name: "Dr. Nguyen Van An",
    specialty: "Cardiology",
    hospital: "TKT Medical",
    rating: 4.9,
    fee: 500000,
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Dr. Le Thi Bich",
    specialty: "Neurology",
    hospital: "City Hospital",
    rating: 4.8,
    fee: 600000,
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 3,
    name: "Dr. Tran Quoc Hung",
    specialty: "Dermatology",
    hospital: "Riverside",
    rating: 4.7,
    fee: 400000,
    avatarUrl: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 4,
    name: "Dr. Pham Duc Minh",
    specialty: "Orthopedics",
    hospital: "TKT Medical",
    rating: 4.7,
    fee: 700000,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 5,
    name: "Dr. Vo Thi Lan",
    specialty: "Ophthalmology",
    hospital: "Riverside",
    rating: 4.6,
    fee: 450000,
    avatarUrl: "https://i.pravatar.cc/150?img=48",
  },
  {
    id: 6,
    name: "Dr. Hoang Van Nam",
    specialty: "Pediatrics",
    hospital: "TKT Medical",
    rating: 4.8,
    fee: 350000,
    avatarUrl: "https://i.pravatar.cc/150?img=57",
  },
];

const SPECIALTIES = [
  "All",
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "Ophthalmology",
  "Pediatrics",
];

const ALL_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];
const BOOKED_SLOTS = ["09:00", "13:00"]; // mock đã booked

const APPT_TYPES = ["Check-up", "Follow-up", "Consultation"];

const STEPS = [
  { num: 1, label: "Choose Doctor" },
  { num: 2, label: "Pick Date & Time" },
  { num: 3, label: "Confirm Booking" },
];

const fmtPrice = (p) => `₫${Number(p).toLocaleString()}`;

// Tạo booking reference ngẫu nhiên
const genRef = () => Math.random().toString(36).slice(2, 10).toUpperCase();

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StepIndicator
// ─────────────────────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map(({ num, label }, idx) => {
        const done = num < current;
        const active = num === current;
        return (
          <div key={num} className="step-indicator__item">
            <div
              className={`step-indicator__circle ${done ? "done" : ""} ${active ? "active" : ""}`}
            >
              {done ? <FaCheckCircle /> : num}
            </div>
            <span className={`step-indicator__label ${active ? "active" : ""}`}>
              {label}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`step-indicator__line ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DoctorCard
// ─────────────────────────────────────────────────────────────────────────────
function DoctorCard({ doc, selected, onSelect }) {
  return (
    <div
      className={`booking-doctor-card ${selected ? "booking-doctor-card--selected" : ""}`}
      onClick={() => onSelect(doc)}
    >
      {selected && (
        <span className="booking-doctor-card__check">
          <FaCheckCircle />
        </span>
      )}
      <img
        src={doc.avatarUrl}
        alt={doc.name}
        className="booking-doctor-card__avatar"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0ba3a3&color=fff`;
        }}
      />
      <div className="booking-doctor-card__info">
        <p className="booking-doctor-card__name">{doc.name}</p>
        <p className="booking-doctor-card__spec">
          <FaStethoscope /> {doc.specialty}
        </p>
        <p className="booking-doctor-card__hospital">
          <FaHospital /> {doc.hospital}
        </p>
        <div className="booking-doctor-card__meta">
          <span className="booking-doctor-card__rating">
            <FaStar /> {doc.rating}
          </span>
          <span className="booking-doctor-card__fee">
            <FaMoneyBillWave /> {fmtPrice(doc.fee)}
          </span>
        </div>
      </div>
      <button
        className={`booking-doctor-card__btn ${selected ? "selected" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(doc);
        }}
      >
        {selected ? "Selected ✓" : "Select"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: MiniCalendar
// ─────────────────────────────────────────────────────────────────────────────
function MiniCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Ngày đầu tiên của tháng là thứ mấy (0=Sun, chuyển về Mon-based)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isPast = (d) =>
    d && d < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  return (
    <div className="mini-cal">
      {/* Nav */}
      <div className="mini-cal__nav">
        <button className="mini-cal__nav-btn" onClick={prevMonth}>
          <FaChevronLeft />
        </button>
        <span className="mini-cal__month">{monthLabel}</span>
        <button className="mini-cal__nav-btn" onClick={nextMonth}>
          <FaChevronRight />
        </button>
      </div>

      {/* Day headers */}
      <div className="mini-cal__grid">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="mini-cal__day-header">
            {d}
          </div>
        ))}

        {/* Cells */}
        {cells.map((date, idx) => {
          if (!date) return <div key={`e${idx}`} />;
          const past = isPast(date);
          const isToday = isSameDay(date, today);
          const isSelect = isSameDay(date, selectedDate);
          return (
            <button
              key={idx}
              disabled={past}
              className={`mini-cal__day ${isToday ? "today" : ""} ${isSelect ? "selected" : ""} ${past ? "past" : ""}`}
              onClick={() => !past && onSelectDate(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: TimeSlotGrid
// ─────────────────────────────────────────────────────────────────────────────
function TimeSlotGrid({ selectedTime, onSelect }) {
  return (
    <div className="time-slot-grid">
      {ALL_SLOTS.map((slot) => {
        const booked = BOOKED_SLOTS.includes(slot);
        const isSelect = selectedTime === slot;
        return (
          <button
            key={slot}
            disabled={booked}
            className={`time-slot ${isSelect ? "time-slot--selected" : ""} ${booked ? "time-slot--booked" : ""}`}
            onClick={() => !booked && onSelect(slot)}
          >
            <BsClockFill /> {slot}
            {booked && <span className="time-slot__booked-label">Booked</span>}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: BookingSummary (hiển thị trong Step 3)
// ─────────────────────────────────────────────────────────────────────────────
function BookingSummary({ doctor, date, time, type }) {
  const displayDate = date?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="booking-summary">
      <p className="booking-summary__title">Booking Summary</p>

      {/* Doctor */}
      <div className="booking-summary__doctor">
        <img
          src={doctor.avatarUrl}
          alt={doctor.name}
          className="booking-summary__avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0ba3a3&color=fff`;
          }}
        />
        <div>
          <p className="booking-summary__doctor-name">{doctor.name}</p>
          <p className="booking-summary__doctor-spec">
            <FaStethoscope /> {doctor.specialty}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="booking-summary__details">
        <div className="booking-summary__row">
          <BsCalendar2WeekFill />
          <span>{displayDate}</span>
        </div>
        <div className="booking-summary__row">
          <BsClockFill />
          <span>{time}</span>
        </div>
        <div className="booking-summary__row">
          <FaStethoscope />
          <span>{type}</span>
        </div>
        <div className="booking-summary__row">
          <FaHospital />
          <span>{doctor.hospital}</span>
        </div>
        <div className="booking-summary__row booking-summary__row--fee">
          <FaMoneyBillWave />
          <span>{fmtPrice(doctor.fee)}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SuccessModal
// ─────────────────────────────────────────────────────────────────────────────
function SuccessModal({
  bookingRef,
  doctor,
  date,
  time,
  onViewAppts,
  onBookAnother,
}) {
  const displayDate = date?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div className="modal-backdrop-success" />
      <div className="success-modal">
        <div className="success-modal__icon">✅</div>
        <h2 className="success-modal__title">Booking Confirmed!</h2>
        <p className="success-modal__ref">
          Reference: <strong>#{bookingRef}</strong>
        </p>

        <div className="success-modal__info">
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            className="success-modal__avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0ba3a3&color=fff`;
            }}
          />
          <div>
            <p className="success-modal__doctor">{doctor.name}</p>
            <p className="success-modal__datetime">
              <BsCalendar2WeekFill /> {displayDate} &nbsp;
              <BsClockFill /> {time}
            </p>
          </div>
        </div>

        <p className="success-modal__note">
          A confirmation has been sent to your email. Please arrive 10 minutes
          early.
        </p>

        <div className="success-modal__actions">
          <button
            className="success-btn success-btn--primary"
            onClick={onViewAppts}
          >
            View My Appointments
          </button>
          <button
            className="success-btn success-btn--secondary"
            onClick={onBookAnother}
          >
            Book Another
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function UserBookingPage() {
  // ── Stepper state ─────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState("Check-up");
  const [patientForm, setPatientForm] = useState({
    name: "Tran Thi Mai",
    phone: "+84 912 345 678",
    dob: "Mar 12, 1990",
    reason: "",
    notes: "",
  });
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Step 1 filters ────────────────────────────────────────────────────────
  const [specFilter, setSpecFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredDoctors = useMemo(() => {
    let list = [...DOCTORS];
    if (specFilter !== "All")
      list = list.filter((d) => d.specialty === specFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    return list;
  }, [specFilter, search]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateStep = (s) => {
    const errs = {};
    if (s === 1 && !selectedDoctor)
      errs.doctor = "Please select a doctor to continue.";
    if (s === 2) {
      if (!selectedDate) errs.date = "Please select a date.";
      if (!selectedTime) errs.time = "Please select a time slot.";
    }
    if (s === 3) {
      if (!patientForm.name.trim()) errs.name = "Full name is required.";
      if (!patientForm.phone.trim()) errs.phone = "Phone number is required.";
      if (!patientForm.reason.trim())
        errs.reason = "Please describe your reason for visit.";
      if (!agree) errs.agree = "Please confirm the information is correct.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleConfirm = () => {
    if (validateStep(3)) {
      setBookingRef(genRef());
      setConfirmed(true);
    }
  };

  const handleBookAnother = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAppointmentType("Check-up");
    setPatientForm({
      name: "Tran Thi Mai",
      phone: "+84 912 345 678",
      dob: "Mar 12, 1990",
      reason: "",
      notes: "",
    });
    setAgree(false);
    setErrors({});
    setConfirmed(false);
  };

  const handleFormChange = (e) =>
    setPatientForm({ ...patientForm, [e.target.name]: e.target.value });

  return (
    <div className="booking-page">
      {/* Page header */}
      <div className="booking-page__header">
        <h1 className="booking-page__title">Book an Appointment</h1>
        <p className="booking-page__sub">
          Follow the steps below to schedule your visit.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* ── STEP 1: Choose Doctor ──────────────────────────────────────────── */}
      {step === 1 && (
        <div className="booking-step booking-step--fade">
          <div className="booking-step__header">
            <h2 className="booking-step__title">
              <FaUserMd /> Choose a Doctor
            </h2>
          </div>

          {/* Filters */}
          <div className="booking-filters">
            <div className="booking-search">
              <FaSearch className="booking-search__icon" />
              <input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="toolbar-select">
              <FaFilter className="toolbar-select__icon" />
              <select
                value={specFilter}
                onChange={(e) => setSpecFilter(e.target.value)}
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {errors.doctor && <p className="booking-error">{errors.doctor}</p>}

          {/* Doctor grid */}
          <div className="booking-doctors-grid">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doc={doc}
                selected={selectedDoctor?.id === doc.id}
                onSelect={setSelectedDoctor}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Pick Date & Time ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="booking-step booking-step--fade">
          <div className="booking-step__header">
            <h2 className="booking-step__title">
              <BsCalendar2WeekFill /> Pick Date & Time
            </h2>
          </div>

          {/* Mini doctor card */}
          <div className="booking-selected-doctor">
            <img
              src={selectedDoctor.avatarUrl}
              alt={selectedDoctor.name}
              className="booking-selected-doctor__avatar"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=0ba3a3&color=fff`;
              }}
            />
            <div>
              <p className="booking-selected-doctor__name">
                {selectedDoctor.name}
              </p>
              <p className="booking-selected-doctor__spec">
                <FaStethoscope /> {selectedDoctor.specialty} ·{" "}
                {selectedDoctor.hospital}
              </p>
            </div>
          </div>

          <div className="booking-datetime-grid">
            {/* Calendar */}
            <div>
              <p className="booking-section-label">
                <FaCalendarAlt /> Select Date
              </p>
              {errors.date && <p className="booking-error">{errors.date}</p>}
              <MiniCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>

            {/* Time slots + type */}
            <div>
              <p className="booking-section-label">
                <BsClockFill /> Select Time
              </p>
              {errors.time && <p className="booking-error">{errors.time}</p>}
              {selectedDate ? (
                <TimeSlotGrid
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                />
              ) : (
                <p className="booking-hint">Please select a date first.</p>
              )}

              {/* Appointment type */}
              <p
                className="booking-section-label"
                style={{ marginTop: "1.5rem" }}
              >
                <FaStethoscope /> Appointment Type
              </p>
              <div className="booking-type-group">
                {APPT_TYPES.map((t) => (
                  <label
                    key={t}
                    className={`booking-type-btn ${appointmentType === t ? "booking-type-btn--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="apptType"
                      value={t}
                      checked={appointmentType === t}
                      onChange={() => setAppointmentType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Confirm ───────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="booking-step booking-step--fade">
          <div className="booking-step__header">
            <h2 className="booking-step__title">
              <FaCheckCircle /> Confirm Your Booking
            </h2>
          </div>

          <div className="booking-confirm-grid">
            {/* Left: summary */}
            <BookingSummary
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
              type={appointmentType}
            />

            {/* Right: patient form */}
            <div className="booking-patient-form">
              <p className="booking-section-label">
                <FaClipboardList /> Your Information
              </p>

              <div className="booking-form-group">
                <label>
                  Full Name <span className="req">*</span>
                </label>
                <input
                  name="name"
                  value={patientForm.name}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              <div className="booking-form-group">
                <label>
                  Phone Number <span className="req">*</span>
                </label>
                <div className="booking-input-icon">
                  <FaPhone className="input-icon" />
                  <input
                    name="phone"
                    value={patientForm.phone}
                    onChange={handleFormChange}
                    placeholder="+84 ..."
                  />
                </div>
                {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
                )}
              </div>

              <div className="booking-form-group">
                <label>Date of Birth</label>
                <div className="booking-input-icon">
                  <FaBirthdayCake className="input-icon" />
                  <input
                    name="dob"
                    value={patientForm.dob}
                    onChange={handleFormChange}
                    placeholder="Mar 12, 1990"
                  />
                </div>
              </div>

              <div className="booking-form-group">
                <label>
                  Reason for Visit <span className="req">*</span>
                </label>
                <textarea
                  name="reason"
                  rows={3}
                  value={patientForm.reason}
                  onChange={handleFormChange}
                  placeholder="Describe your symptoms or reason for appointment..."
                />
                {errors.reason && (
                  <span className="field-error">{errors.reason}</span>
                )}
              </div>

              <div className="booking-form-group">
                <label>
                  Notes for Doctor{" "}
                  <small className="optional">(optional)</small>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={patientForm.notes}
                  onChange={handleFormChange}
                  placeholder="Any allergies, medications, or special requests..."
                />
              </div>

              {/* Agree checkbox */}
              <label
                className={`booking-agree ${agree ? "booking-agree--checked" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="booking-agree__box">{agree && "✓"}</span>I
                confirm the information above is correct.
              </label>
              {errors.agree && (
                <span className="field-error">{errors.agree}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation buttons ─────────────────────────────────────────────── */}
      <div className="booking-nav">
        {step > 1 && (
          <button className="booking-nav__back" onClick={handleBack}>
            <FaChevronLeft /> Back
          </button>
        )}
        <div style={{ flex: 1 }} />
        {step < 3 && (
          <button className="booking-nav__next" onClick={handleNext}>
            Next <FaChevronRight />
          </button>
        )}
        {step === 3 && (
          <button className="booking-nav__confirm" onClick={handleConfirm}>
            <FaCheckCircle /> Confirm Booking
          </button>
        )}
      </div>

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      {confirmed && (
        <SuccessModal
          bookingRef={bookingRef}
          doctor={selectedDoctor}
          date={selectedDate}
          time={selectedTime}
          onViewAppts={() => (window.location.href = "/app/user/appointments")}
          onBookAnother={handleBookAnother}
        />
      )}
    </div>
  );
}
