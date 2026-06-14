// ─────────────────────────────────────────────────────────────────────────────
// DoctorPatientsPage.jsx
// Danh sách bệnh nhân: grid card, search/filter/sort, modal chi tiết
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useRef, useEffect } from "react";
import {
  BsPersonBadgeFill,
  BsCalendar2WeekFill,
  BsFileEarmarkMedicalFill,
} from "react-icons/bs";
import {
  FaUserInjured,
  FaSearch,
  FaSortAmountDown,
  FaFilter,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaStickyNote,
  FaHeartbeat,
  FaVenusMars,
  FaBirthdayCake,
  FaTimes,
  FaMapMarkerAlt,
  FaTint,
  FaExclamationTriangle,
  FaCalendarPlus,
  FaCheckCircle,
} from "react-icons/fa";
import "./DoctorPatientsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA – 8 bệnh nhân
// Avatar dùng chữ cái đầu tên + màu nền, không dùng ảnh
// ─────────────────────────────────────────────────────────────────────────────
const mockPatients = [
  {
    id: 1,
    name: "Tran Thi Mai",
    age: 45,
    gender: "Female",
    dob: "Mar 12, 1980",
    phone: "+84 912 345 678",
    email: "mai.tran@email.com",
    address: "12 Le Loi, District 1, HCMC",
    bloodType: "A+",
    allergies: "Penicillin, Shellfish",
    category: "regular",
    initials: "TM",
    avatarColor: "#0ba3a3",
    lastVisit: "Apr 17, 2026",
    lastReason: "Hypertension Follow-up",
    history: [
      { date: "Apr 17, 2026", type: "Follow-up",    note: "BP stable at 130/85. Continue medication." },
      { date: "Jan 10, 2026", type: "Check-up",     note: "Annual cardiac screening. ECG normal." },
      { date: "Oct 5, 2025",  type: "Consultation", note: "Prescribed Amlodipine 5mg for BP control." },
      { date: "Jul 2, 2025",  type: "Follow-up",    note: "Reported dizziness. Adjusted dosage." },
    ],
  },
  {
    id: 2,
    name: "Le Van Binh",
    age: 62,
    gender: "Male",
    dob: "Aug 5, 1963",
    phone: "+84 909 876 543",
    email: "binh.le@email.com",
    address: "45 Nguyen Hue, District 1, HCMC",
    bloodType: "O+",
    allergies: "None known",
    category: "critical",
    initials: "LB",
    avatarColor: "#e24b4a",
    lastVisit: "Apr 17, 2026",
    lastReason: "Chest Pain Consultation",
    history: [
      { date: "Apr 17, 2026", type: "Consultation", note: "Acute chest pain. Referred for angiogram." },
      { date: "Mar 3, 2026",  type: "Check-up",     note: "Stress test borderline. Monitoring required." },
      { date: "Dec 15, 2025", type: "Follow-up",    note: "Lipid panel elevated. Diet changes advised." },
    ],
  },
  {
    id: 3,
    name: "Pham Duc Thanh",
    age: 38,
    gender: "Male",
    dob: "Nov 20, 1987",
    phone: "+84 936 111 222",
    email: "thanh.pham@email.com",
    address: "78 Tran Hung Dao, District 5, HCMC",
    bloodType: "B+",
    allergies: "Aspirin",
    category: "new",
    initials: "PT",
    avatarColor: "#f5a623",
    lastVisit: "Apr 17, 2026",
    lastReason: "Annual Heart Check-up",
    history: [
      { date: "Apr 17, 2026", type: "Check-up", note: "First visit. ECG and echo results normal." },
    ],
  },
  {
    id: 4,
    name: "Nguyen Thi Lan",
    age: 55,
    gender: "Female",
    dob: "Feb 14, 1971",
    phone: "+84 918 222 333",
    email: "lan.nguyen@email.com",
    address: "33 Vo Van Tan, District 3, HCMC",
    bloodType: "AB+",
    allergies: "Sulfa drugs, Latex",
    category: "critical",
    initials: "NL",
    avatarColor: "#534ab7",
    lastVisit: "Apr 16, 2026",
    lastReason: "Post-surgery Follow-up",
    history: [
      { date: "Apr 16, 2026", type: "Follow-up",    note: "Post-bypass recovery stable. Continue rehab." },
      { date: "Mar 20, 2026", type: "Consultation", note: "Discharge assessment. Wound healing well." },
      { date: "Feb 28, 2026", type: "Check-up",     note: "Pre-surgery cardiac clearance obtained." },
    ],
  },
  {
    id: 5,
    name: "Vo Minh Khoa",
    age: 29,
    gender: "Male",
    dob: "Sep 7, 1996",
    phone: "+84 977 444 555",
    email: "khoa.vo@email.com",
    address: "101 Pham Ngu Lao, District 1, HCMC",
    bloodType: "O-",
    allergies: "None known",
    category: "new",
    initials: "VK",
    avatarColor: "#1a9e5c",
    lastVisit: "Apr 16, 2026",
    lastReason: "ECG Abnormality Check",
    history: [
      { date: "Apr 16, 2026", type: "Consultation", note: "Palpitations. Holter monitor prescribed." },
      { date: "Apr 10, 2026", type: "Check-up",     note: "Initial ECG showed minor arrhythmia." },
    ],
  },
  {
    id: 6,
    name: "Hoang Thi Thu",
    age: 48,
    gender: "Female",
    dob: "May 30, 1977",
    phone: "+84 903 666 777",
    email: "thu.hoang@email.com",
    address: "22 Dien Bien Phu, Binh Thanh, HCMC",
    bloodType: "A-",
    allergies: "Ibuprofen",
    category: "regular",
    initials: "HT",
    avatarColor: "#077d7d",
    lastVisit: "Apr 15, 2026",
    lastReason: "Valve Disease Monitoring",
    history: [
      { date: "Apr 15, 2026", type: "Follow-up",    note: "Mitral valve regurgitation stable. Echo unchanged." },
      { date: "Jan 8, 2026",  type: "Check-up",     note: "Annual echo. No progression noted." },
      { date: "Sep 12, 2025", type: "Consultation", note: "Shortness of breath. Diuretic adjusted." },
    ],
  },
  {
    id: 7,
    name: "Dang Van Long",
    age: 33,
    gender: "Male",
    dob: "Dec 3, 1992",
    phone: "+84 945 888 999",
    email: "long.dang@email.com",
    address: "55 Cach Mang Thang 8, District 10, HCMC",
    bloodType: "B-",
    allergies: "None known",
    category: "new",
    initials: "DL",
    avatarColor: "#ff6b35",
    lastVisit: "Apr 14, 2026",
    lastReason: "Sports Cardiac Screening",
    history: [
      { date: "Apr 14, 2026", type: "Check-up", note: "Pre-marathon cardiac clearance. All results normal." },
    ],
  },
  {
    id: 8,
    name: "Bui Thi Huong",
    age: 60,
    gender: "Female",
    dob: "Jun 18, 1965",
    phone: "+84 908 123 456",
    email: "huong.bui@email.com",
    address: "17 Nguyen Van Cu, District 5, HCMC",
    bloodType: "AB-",
    allergies: "Codeine, NSAIDs",
    category: "regular",
    initials: "BH",
    avatarColor: "#9b59b6",
    lastVisit: "Apr 10, 2026",
    lastReason: "Arrhythmia Management",
    history: [
      { date: "Apr 10, 2026", type: "Follow-up",    note: "Atrial fibrillation controlled. Warfarin dose stable." },
      { date: "Feb 5, 2026",  type: "Check-up",     note: "INR within therapeutic range. Continue monitoring." },
      { date: "Nov 22, 2025", type: "Consultation", note: "AF recurrence. Cardioversion considered." },
      { date: "Aug 14, 2025", type: "Follow-up",    note: "Pacemaker check. Device functioning normally." },
    ],
  },
];

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  new:      { label: "New",      className: "cat--new"      },
  regular:  { label: "Regular",  className: "cat--regular"  },
  critical: { label: "Critical", className: "cat--critical" },
};

// ── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "name-asc",    label: "Name A → Z"  },
  { value: "lastvisit",   label: "Last Visit"   },
  { value: "age-asc",     label: "Age ↑"        },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SummaryCard
// ─────────────────────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, colorClass }) {
  const IconComponent = icon;
  return (
    <div className={`pt-summary-card ${colorClass}`}>
      <div className="pt-summary-card__icon"><IconComponent /></div>
      <div>
        <p className="pt-summary-card__value">{value}</p>
        <p className="pt-summary-card__label">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PatientCard
// ─────────────────────────────────────────────────────────────────────────────
function PatientCard({ patient, onViewProfile }) {
  const { name, age, gender, dob, phone, email,
          initials, avatarColor,
          lastVisit, lastReason, category } = patient;
  const catCfg = CATEGORY_CONFIG[category];

  return (
    <div className="pt-card">
      {/* ── Top: avatar + name + tag ── */}
      <div className="pt-card__top">
        {/* Avatar chữ cái */}
        <div
          className="pt-card__avatar"
          style={{ background: avatarColor }}
        >
          {initials}
        </div>
        <div className="pt-card__identity">
          <p className="pt-card__name">{name}</p>
          <p className="pt-card__age">{age} years old</p>
        </div>
        <span className={`pt-cat-tag ${catCfg.className}`}>{catCfg.label}</span>
      </div>

      {/* ── Info rows ── */}
      <div className="pt-card__info">
        <div className="pt-card__info-row">
          <FaVenusMars className="pt-card__info-icon" />
          <span>{gender}</span>
        </div>
        <div className="pt-card__info-row">
          <FaBirthdayCake className="pt-card__info-icon" />
          <span>{dob}</span>
        </div>
        <div className="pt-card__info-row">
          <FaPhone className="pt-card__info-icon" />
          <span>{phone}</span>
        </div>
        <div className="pt-card__info-row">
          <FaEnvelope className="pt-card__info-icon" />
          <span className="pt-card__email">{email}</span>
        </div>
      </div>

      {/* ── Last visit ── */}
      <div className="pt-card__last-visit">
        <p className="pt-card__last-visit-label">
          <BsCalendar2WeekFill /> Lần khám gần nhất
        </p>
        <p className="pt-card__last-visit-date">{lastVisit}</p>
        <p className="pt-card__last-visit-reason">{lastReason}</p>
      </div>

      {/* ── Actions ── */}
      <div className="pt-card__actions">
        <button
          className="pt-btn pt-btn--view"
          onClick={() => onViewProfile(patient)}
        >
          <FaEye /> Xem hồ sơ
        </button>
        <button className="pt-btn pt-btn--book">
          <FaCalendarPlus /> Đặt lịch
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PatientModal
// ─────────────────────────────────────────────────────────────────────────────
function PatientModal({ patient, onClose }) {
  const backdropRef = useRef();

  // Đóng khi click backdrop
  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Đóng bằng phím Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const {
    name, age, gender, dob, phone, email, address,
    bloodType, allergies, initials, avatarColor, category, history,
  } = patient;

  const catCfg = CATEGORY_CONFIG[category];

  return (
    <div className="pt-modal-backdrop" ref={backdropRef} onClick={handleBackdrop}>
      <div className="pt-modal">

        {/* ── Modal Header ── */}
        <div className="pt-modal__header">
          {/* Avatar chữ cái (lớn hơn trong modal) */}
          <div
            className="pt-modal__avatar"
            style={{ background: avatarColor }}
          >
            {initials}
          </div>
          <div className="pt-modal__identity">
            <h3 className="pt-modal__name">{name}</h3>
            <p className="pt-modal__meta">{age} tuổi · {gender}</p>
            <span className={`pt-cat-tag ${catCfg.className}`}>{catCfg.label}</span>
          </div>
          <button className="pt-modal__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="pt-modal__body">

          {/* Personal info */}
          <div className="pt-modal__section">
            <p className="pt-modal__section-title">
              <BsPersonBadgeFill /> Thông tin cá nhân
            </p>
            <div className="pt-modal__info-grid">
              <div className="pt-modal__info-item">
                <FaBirthdayCake />
                <div>
                  <span className="pt-modal__info-label">Ngày sinh</span>
                  <span className="pt-modal__info-value">{dob}</span>
                </div>
              </div>
              <div className="pt-modal__info-item">
                <FaPhone />
                <div>
                  <span className="pt-modal__info-label">Số điện thoại</span>
                  <span className="pt-modal__info-value">{phone}</span>
                </div>
              </div>
              <div className="pt-modal__info-item">
                <FaEnvelope />
                <div>
                  <span className="pt-modal__info-label">Email</span>
                  <span className="pt-modal__info-value">{email}</span>
                </div>
              </div>
              <div className="pt-modal__info-item">
                <FaMapMarkerAlt />
                <div>
                  <span className="pt-modal__info-label">Địa chỉ</span>
                  <span className="pt-modal__info-value">{address}</span>
                </div>
              </div>
              <div className="pt-modal__info-item">
                <FaTint />
                <div>
                  <span className="pt-modal__info-label">Nhóm máu</span>
                  <span className="pt-modal__info-value pt-modal__blood">{bloodType}</span>
                </div>
              </div>
              <div className="pt-modal__info-item">
                <FaExclamationTriangle />
                <div>
                  <span className="pt-modal__info-label">Dị ứng</span>
                  <span className="pt-modal__info-value">{allergies}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visit history */}
          <div className="pt-modal__section">
            <p className="pt-modal__section-title">
              <BsFileEarmarkMedicalFill /> Lịch sử khám
            </p>
            <div className="pt-modal__history">
              {history.map((h, idx) => (
                <div key={idx} className="pt-modal__history-item">
                  <div className="pt-modal__history-dot" />
                  <div className="pt-modal__history-content">
                    <div className="pt-modal__history-top">
                      <span className="pt-modal__history-date">
                        <BsCalendar2WeekFill /> {h.date}
                      </span>
                      <span className={`pt-modal__history-type pt-modal__history-type--${h.type.toLowerCase().replace("-","")}`}>
                        {h.type}
                      </span>
                    </div>
                    <p className="pt-modal__history-note">
                      <FaStickyNote /> {h.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DoctorPatientsPage() {
  const [search,          setSearch]          = useState("");
  const [filterCategory,  setFilterCategory]  = useState("all");
  const [sortBy,          setSortBy]          = useState("name-asc");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ── Summary counts ─────────────────────────────────────────────────────────
  const totalCount    = mockPatients.length;
  const newCount      = mockPatients.filter((p) => p.category === "new").length;
  const criticalCount = mockPatients.filter((p) => p.category === "critical").length;

  // ── Filter + sort (useMemo) ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...mockPatients];

    // Category filter
    if (filterCategory !== "all") {
      list = list.filter((p) => p.category === filterCategory);
    }

    // Search theo tên hoặc email
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "lastvisit") {
      list.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    } else if (sortBy === "age-asc") {
      list.sort((a, b) => a.age - b.age);
    }

    return list;
  }, [search, filterCategory, sortBy]);

  return (
    <div className="pt-page">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="pt-page__header">
        <div>
          <h1 className="pt-page__title">Bệnh nhân của tôi</h1>
          <p className="pt-page__subtitle">
            Theo dõi và quản lý hồ sơ, lịch sử khám của bệnh nhân.
          </p>
        </div>
        <div className="pt-page__total-badge">
          <FaUserInjured />
          Tổng {totalCount} bệnh nhân
        </div>
      </div>

      {/* ── Summary bar ─────────────────────────────────── */}
      <div className="pt-summary-grid">
        <SummaryCard icon={BsPersonBadgeFill}        label="Tổng bệnh nhân" value={totalCount}    colorClass="pt-summary-card--teal"     />
        <SummaryCard icon={FaHeartbeat}               label="Mới trong tháng" value={newCount}      colorClass="pt-summary-card--navy"     />
        <SummaryCard icon={FaExclamationTriangle}     label="Cần lưu ý" value={criticalCount} colorClass="pt-summary-card--critical"  />
      </div>

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="pt-toolbar">
        {/* Search */}
        <div className="pt-search">
          <FaSearch className="pt-search__icon" />
          <input
            type="text"
            className="pt-search__input"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="pt-select-wrap">
          <FaFilter className="pt-select-wrap__icon" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="new">New</option>
            <option value="regular">Regular</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Sort */}
        <div className="pt-select-wrap">
          <FaSortAmountDown className="pt-select-wrap__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results count ───────────────────────────────── */}
      <p className="pt-results-count">
        Showing <strong>{filtered.length}</strong> of {totalCount} patients
      </p>

      {/* ── Patient Grid ────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="pt-empty">
          <FaUserInjured className="pt-empty__icon" />
          <p className="pt-empty__text">No patients found.</p>
          <p className="pt-empty__hint">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="pt-grid">
          {filtered.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onViewProfile={setSelectedPatient}
            />
          ))}
        </div>
      )}

      {/* ── Patient Detail Modal ─────────────────────────── */}
      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

    </div>
  );
}
