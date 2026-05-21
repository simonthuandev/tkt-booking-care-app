// ─────────────────────────────────────────────────────────────────────────────
// UserMedicalRecordsPage.jsx
// Trang hồ sơ bệnh án – tabs, search, filter, record cards
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  BsFileEarmarkMedicalFill,
  BsCalendar2WeekFill,
  BsShieldFillPlus,
} from "react-icons/bs";
import {
  FaHospital,
  FaEye,
  FaDownload,
  FaCapsules,
  FaBrain,
  FaHeart,
  FaSearch,
  FaFlask,
  FaXRay,
  FaSortAmountDown,
} from "react-icons/fa";
import "./UserMedicalRecordsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const mockRecords = [
  {
    id: 1,
    title: "Complete Blood Count (CBC)",
    doctor: "Dr. Nguyen Van An",
    hospital: "TKT Medical Center",
    date: "Apr 10, 2026",
    type: "lab",
    icon: FaFlask,
    note: "All values within normal range. Follow-up in 3 months.",
  },
  {
    id: 2,
    title: "MRI Brain Scan",
    doctor: "Dr. Le Thi Bich",
    hospital: "City Hospital",
    date: "Mar 28, 2026",
    type: "imaging",
    icon: FaBrain,
    note: "No abnormalities detected. Recommended annual check.",
  },
  {
    id: 3,
    title: "Amoxicillin 500mg Prescription",
    doctor: "Dr. Tran Quoc Hung",
    hospital: "Skin & Care Clinic",
    date: "Mar 15, 2026",
    type: "prescription",
    icon: FaCapsules,
    note: "Take 1 capsule 3x/day for 7 days. Avoid alcohol.",
  },
  {
    id: 4,
    title: "Echocardiogram Report",
    doctor: "Dr. Pham Duc Minh",
    hospital: "Heart Care Center",
    date: "Feb 20, 2026",
    type: "imaging",
    icon: FaHeart,
    note: "Ejection fraction 65%. Mild mitral valve regurgitation noted.",
  },
  {
    id: 5,
    title: "Lipid Panel Test",
    doctor: "Dr. Nguyen Van An",
    hospital: "TKT Medical Center",
    date: "Feb 5, 2026",
    type: "lab",
    icon: FaFlask,
    note: "LDL slightly elevated. Dietary changes recommended.",
  },
  {
    id: 6,
    title: "Metformin 850mg Prescription",
    doctor: "Dr. Vo Thi Lan",
    hospital: "Eye Care Center",
    date: "Jan 18, 2026",
    type: "prescription",
    icon: FaCapsules,
    note: "Take 1 tablet twice daily with meals. Monitor blood sugar weekly.",
  },
  {
    id: 7,
    title: "Chest X-Ray",
    doctor: "Dr. Hoang Van Nam",
    hospital: "Children's Hospital",
    date: "Jan 5, 2026",
    type: "imaging",
    icon: FaXRay,
    note: "Lungs clear. No signs of infection or abnormality.",
  },
];

// ── Cấu hình tab ────────────────────────────────────────────────────────────
const TABS = [
  { key: "all", label: "All", icon: BsFileEarmarkMedicalFill },
  { key: "lab", label: "Lab Results", icon: FaFlask },
  { key: "prescription", label: "Prescriptions", icon: FaCapsules },
  { key: "imaging", label: "Imaging", icon: FaBrain },
];

// ── Cấu hình type tag ────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  lab: { label: "Lab Results", className: "tag--lab" },
  prescription: { label: "Prescription", className: "tag--prescription" },
  imaging: { label: "Imaging", className: "tag--imaging" },
};

// ── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title A → Z" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SummaryCard (3 thẻ thống kê nhỏ)
// ─────────────────────────────────────────────────────────────────────────────
function SummaryCard({ icon: Icon, label, value, colorClass }) {
  return (
    <div className={`rec-summary-card ${colorClass}`}>
      <div className="rec-summary-card__icon">
        <Icon />
      </div>
      <div>
        <p className="rec-summary-card__value">{value}</p>
        <p className="rec-summary-card__label">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: RecordCard
// ─────────────────────────────────────────────────────────────────────────────
function RecordCard({ record }) {
  const { title, doctor, hospital, date, type, icon: Icon, note } = record;
  const typeCfg = TYPE_CONFIG[type];

  return (
    <div className="rec-card">
      {/* ── Icon loại record ───────────────────────────── */}
      <div className={`rec-card__icon-wrap rec-card__icon-wrap--${type}`}>
        <Icon />
      </div>

      {/* ── Nội dung chính ────────────────────────────── */}
      <div className="rec-card__body">
        <div className="rec-card__top">
          <h3 className="rec-card__title">{title}</h3>
          {/* Tag loại */}
          <span className={`rec-tag ${typeCfg.className}`}>
            {typeCfg.label}
          </span>
        </div>

        {/* Doctor + hospital */}
        <p className="rec-card__doctor">
          <FaHospital />
          {doctor} &mdash; {hospital}
        </p>

        {/* Ghi chú */}
        <p className="rec-card__note">{note}</p>

        {/* Date + actions */}
        <div className="rec-card__footer">
          <span className="rec-card__date">
            <BsCalendar2WeekFill />
            {date}
          </span>

          <div className="rec-card__actions">
            <button className="rec-btn rec-btn--view">
              <FaEye />
              View
            </button>
            <button className="rec-btn rec-btn--download">
              <FaDownload />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UserMedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // ── Lọc + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = mockRecords;

    // Lọc theo tab
    if (activeTab !== "all") {
      list = list.filter((r) => r.type === activeTab);
    }

    // Lọc theo search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.doctor.toLowerCase().includes(q) ||
          r.hospital.toLowerCase().includes(q),
      );
    }

    // Sort
    list = [...list].sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [activeTab, searchQuery, sortBy]);

  // ── Thống kê summary ────────────────────────────────────────────────────
  const lastVisitDate = mockRecords
    .map((r) => new Date(r.date))
    .sort((a, b) => b - a)[0]
    ?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const prescriptionCount = mockRecords.filter(
    (r) => r.type === "prescription",
  ).length;

  return (
    <div className="rec-page">
      {/* ── Page Header ────────────────────────────────── */}
      <div className="rec-page__header">
        <div>
          <h1 className="rec-page__title">Medical Records</h1>
          <p className="rec-page__subtitle">
            View and download your complete health history.
          </p>
        </div>
        <div className="rec-page__total">
          <BsFileEarmarkMedicalFill />
          {mockRecords.length} total records
        </div>
      </div>

      {/* ── Summary bar (3 thẻ) ────────────────────────── */}
      <div className="rec-summary-grid">
        <SummaryCard
          icon={BsFileEarmarkMedicalFill}
          label="Total Records"
          value={mockRecords.length}
          colorClass="rec-summary-card--teal"
        />
        <SummaryCard
          icon={BsCalendar2WeekFill}
          label="Last Visit"
          value={lastVisitDate}
          colorClass="rec-summary-card--navy"
        />
        <SummaryCard
          icon={BsShieldFillPlus}
          label="Active Prescriptions"
          value={prescriptionCount}
          colorClass="rec-summary-card--accent"
        />
      </div>

      {/* ── Tabs ───────────────────────────────────────── */}
      <div className="rec-tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`rec-tabs__btn ${activeTab === key ? "rec-tabs__btn--active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon />
            {label}
            <span className="rec-tabs__count">
              {key === "all"
                ? mockRecords.length
                : mockRecords.filter((r) => r.type === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + Sort ──────────────────────────────── */}
      <div className="rec-toolbar">
        {/* Search */}
        <div className="rec-search">
          <FaSearch className="rec-search__icon" />
          <input
            type="text"
            className="rec-search__input"
            placeholder="Search by title, doctor, hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort dropdown */}
        <div className="rec-sort">
          <FaSortAmountDown className="rec-sort__icon" />
          <select
            className="rec-sort__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Record List ────────────────────────────────── */}
      <div className="rec-list">
        {filtered.length === 0 ? (
          // Empty state
          <div className="rec-empty">
            <BsFileEarmarkMedicalFill className="rec-empty__icon" />
            <p className="rec-empty__text">No records found.</p>
            <p className="rec-empty__hint">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          filtered.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))
        )}
      </div>
    </div>
  );
}
