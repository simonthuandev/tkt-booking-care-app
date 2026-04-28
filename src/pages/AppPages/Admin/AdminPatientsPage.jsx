// ─────────────────────────────────────────────────────────────────────────────
// AdminPatientsPage.jsx  —  Patients Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaUserInjured,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTint,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaCheckCircle,
  FaVenusMars,
  FaBirthdayCake,
} from "react-icons/fa";
import { BsPersonBadgeFill, BsFileEarmarkMedicalFill } from "react-icons/bs";
import "./AdminPatientsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "#0ba3a3",
  "#534ab7",
  "#f5a623",
  "#1a9e5c",
  "#e24b4a",
  "#ff6b35",
];
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CATEGORIES = ["new", "regular", "critical"];

const CAT_CFG = {
  new: { label: "New", cls: "cat-new" },
  regular: { label: "Regular", cls: "cat-regular" },
  critical: { label: "Critical", cls: "cat-critical" },
};

// Mock medical history dùng trong View modal
const MOCK_HISTORY = [
  {
    date: "Apr 17, 2026",
    doctor: "Dr. Nguyen Van An",
    type: "Check-up",
    note: "BP stable. Continue medication.",
  },
  {
    date: "Jan 10, 2026",
    doctor: "Dr. Le Thi Bich",
    type: "Follow-up",
    note: "ECG normal. Annual review done.",
  },
  {
    date: "Oct 5, 2025",
    doctor: "Dr. Tran Quoc Hung",
    type: "Consultation",
    note: "Prescribed Amlodipine 5mg.",
  },
  {
    date: "Jul 2, 2025",
    doctor: "Dr. Nguyen Van An",
    type: "Follow-up",
    note: "Dizziness reported. Dosage adjusted.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 10 patients
// ─────────────────────────────────────────────────────────────────────────────
const INIT_PATIENTS = [
  {
    id: 1,
    firstName: "Tran Thi",
    lastName: "Mai",
    email: "mai.tran@email.com",
    phone: "+84 912 345 678",
    dob: "Mar 12, 1980",
    gender: "Female",
    bloodType: "A+",
    allergies: "Penicillin",
    address: "12 Le Loi, D1, HCMC",
    category: "regular",
    color: "#0ba3a3",
    lastVisit: "Apr 17, 2026",
    lastReason: "Hypertension Follow-up",
    emergencyName: "Tran Van Hai",
    emergencyPhone: "+84 901 111 222",
    notes: "Long-term hypertension patient.",
  },
  {
    id: 2,
    firstName: "Le Van",
    lastName: "Binh",
    email: "binh.le@email.com",
    phone: "+84 909 876 543",
    dob: "Aug 5, 1963",
    gender: "Male",
    bloodType: "O+",
    allergies: "None",
    address: "45 Nguyen Hue, D1, HCMC",
    category: "critical",
    color: "#e24b4a",
    lastVisit: "Apr 17, 2026",
    lastReason: "Chest Pain Consultation",
    emergencyName: "Le Thi Lan",
    emergencyPhone: "+84 902 333 444",
    notes: "Requires urgent cardiac monitoring.",
  },
  {
    id: 3,
    firstName: "Pham Duc",
    lastName: "Thanh",
    email: "thanh.pham@email.com",
    phone: "+84 936 111 222",
    dob: "Nov 20, 1987",
    gender: "Male",
    bloodType: "B+",
    allergies: "Aspirin",
    address: "78 Tran Hung Dao, D5, HCMC",
    category: "new",
    color: "#f5a623",
    lastVisit: "Apr 17, 2026",
    lastReason: "Annual Heart Check-up",
    emergencyName: "Pham Thi Nga",
    emergencyPhone: "+84 903 555 666",
    notes: "First visit. No chronic conditions.",
  },
  {
    id: 4,
    firstName: "Nguyen Thi",
    lastName: "Lan",
    email: "lan.nguyen@email.com",
    phone: "+84 918 222 333",
    dob: "Feb 14, 1971",
    gender: "Female",
    bloodType: "AB+",
    allergies: "Sulfa, Latex",
    address: "33 Vo Van Tan, D3, HCMC",
    category: "critical",
    color: "#534ab7",
    lastVisit: "Apr 16, 2026",
    lastReason: "Post-surgery Follow-up",
    emergencyName: "Nguyen Van Duc",
    emergencyPhone: "+84 904 777 888",
    notes: "Post-bypass surgery recovery.",
  },
  {
    id: 5,
    firstName: "Vo Minh",
    lastName: "Khoa",
    email: "khoa.vo@email.com",
    phone: "+84 977 444 555",
    dob: "Sep 7, 1996",
    gender: "Male",
    bloodType: "O-",
    allergies: "None",
    address: "101 Pham Ngu Lao, D1, HCMC",
    category: "new",
    color: "#1a9e5c",
    lastVisit: "Apr 16, 2026",
    lastReason: "ECG Abnormality Check",
    emergencyName: "Vo Van Nam",
    emergencyPhone: "+84 905 999 000",
    notes: "Young patient with minor arrhythmia.",
  },
  {
    id: 6,
    firstName: "Hoang Thi",
    lastName: "Thu",
    email: "thu.hoang@email.com",
    phone: "+84 903 666 777",
    dob: "May 30, 1977",
    gender: "Female",
    bloodType: "A-",
    allergies: "Ibuprofen",
    address: "22 Dien Bien Phu, BT, HCMC",
    category: "regular",
    color: "#077d7d",
    lastVisit: "Apr 15, 2026",
    lastReason: "Valve Disease Monitoring",
    emergencyName: "Hoang Van Thanh",
    emergencyPhone: "+84 906 112 233",
    notes: "Mitral valve regurgitation stable.",
  },
  {
    id: 7,
    firstName: "Dang Van",
    lastName: "Long",
    email: "long.dang@email.com",
    phone: "+84 945 888 999",
    dob: "Dec 3, 1992",
    gender: "Male",
    bloodType: "B-",
    allergies: "None",
    address: "55 CM T8, D10, HCMC",
    category: "new",
    color: "#ff6b35",
    lastVisit: "Apr 14, 2026",
    lastReason: "Sports Cardiac Screening",
    emergencyName: "Dang Thi Hoa",
    emergencyPhone: "+84 907 334 455",
    notes: "Pre-marathon cardiac clearance.",
  },
  {
    id: 8,
    firstName: "Bui Thi",
    lastName: "Huong",
    email: "huong.bui@email.com",
    phone: "+84 908 123 456",
    dob: "Jun 18, 1965",
    gender: "Female",
    bloodType: "AB-",
    allergies: "Codeine, NSAIDs",
    address: "17 Nguyen Van Cu, D5, HCMC",
    category: "regular",
    color: "#9b59b6",
    lastVisit: "Apr 10, 2026",
    lastReason: "Arrhythmia Management",
    emergencyName: "Bui Van Minh",
    emergencyPhone: "+84 908 556 677",
    notes: "Atrial fibrillation on Warfarin.",
  },
  {
    id: 9,
    firstName: "Cao Minh",
    lastName: "Tri",
    email: "tri.cao@email.com",
    phone: "+84 911 234 567",
    dob: "Mar 28, 1984",
    gender: "Male",
    bloodType: "A+",
    allergies: "None",
    address: "99 Ly Thuong Kiet, D11, HCMC",
    category: "regular",
    color: "#e67e22",
    lastVisit: "Apr 8, 2026",
    lastReason: "Diabetes Monitoring",
    emergencyName: "Cao Thi Mai",
    emergencyPhone: "+84 909 778 899",
    notes: "Type 2 diabetes, controlled diet.",
  },
  {
    id: 10,
    firstName: "Dinh Thi",
    lastName: "Nga",
    email: "nga.dinh@email.com",
    phone: "+84 922 345 678",
    dob: "Aug 22, 1958",
    gender: "Female",
    bloodType: "O+",
    allergies: "Penicillin",
    address: "7 Cach Mang T8, D1, HCMC",
    category: "critical",
    color: "#c0392b",
    lastVisit: "Apr 5, 2026",
    lastReason: "Cancer Follow-up",
    emergencyName: "Dinh Van Hung",
    emergencyPhone: "+84 910 990 001",
    notes: "Oncology follow-up, requires close monitoring.",
  },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "Female",
  bloodType: "A+",
  allergies: "",
  address: "",
  category: "new",
  color: AVATAR_COLORS[0],
  emergencyName: "",
  emergencyPhone: "",
  notes: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PatientCard
// ─────────────────────────────────────────────────────────────────────────────
const PatientCard = ({ p, onView, onEdit, onDelete }) => {
  const cat = CAT_CFG[p.category];
  const initials =
    `${p.firstName.trim().split(" ").pop().charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
  // Tính tuổi từ dob
  const age = p.dob
    ? new Date().getFullYear() - new Date(p.dob).getFullYear()
    : "—";

  return (
    <div className="pat-card">
      {/* Avatar + category */}
      <div className="pat-card__top">
        <div className="pat-card__avatar" style={{ background: p.color }}>
          {initials}
        </div>
        <div className="pat-card__identity">
          <p className="pat-card__name">
            {p.firstName} {p.lastName}
          </p>
          <p className="pat-card__age">{age} years old</p>
        </div>
        <span className={`pat-cat ${cat.cls}`}>{cat.label}</span>
      </div>

      {/* Info */}
      <div className="pat-card__info">
        <span>
          <FaPhone /> {p.phone}
        </span>
        <span>
          <FaEnvelope /> <span className="truncate">{p.email}</span>
        </span>
        <span>
          <FaTint /> <strong className="blood">{p.bloodType}</strong>
        </span>
        <span>
          <FaBirthdayCake /> {p.dob}
        </span>
      </div>

      {/* Last visit */}
      <div className="pat-card__visit">
        <p className="pat-card__visit-label">
          <FaCalendarAlt /> Last visit
        </p>
        <p className="pat-card__visit-date">{p.lastVisit}</p>
        <p className="pat-card__visit-reason">{p.lastReason}</p>
      </div>

      {/* Actions */}
      <div className="pat-card__actions">
        <button className="pat-btn pat-btn--view" onClick={() => onView(p)}>
          <FaEye /> View
        </button>
        <button className="pat-btn pat-btn--edit" onClick={() => onEdit(p)}>
          <FaEdit /> Edit
        </button>
        <button className="pat-btn pat-btn--delete" onClick={() => onDelete(p)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PatientFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const PatientFormModal = ({
  mode,
  form,
  onChange,
  onColorPick,
  onSave,
  onClose,
}) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";
  const initials = form.firstName
    ? `${form.firstName.trim().split(" ").pop().charAt(0)}${form.lastName.charAt(0) || ""}`.toUpperCase()
    : "?";

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaUserInjured className="me-2" style={{ color: "#0ba3a3" }} />
                {isEdit ? "Edit Patient" : "Add New Patient"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Avatar preview + color picker */}
              <div className="form-avatar-row">
                <div
                  className="form-avatar-preview"
                  style={{ background: form.color }}
                >
                  {initials}
                </div>
                <div>
                  <p className="form-avatar-label">Avatar Color</p>
                  <div className="color-picker">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`color-swatch ${form.color === c ? "color-swatch--active" : ""}`}
                        style={{ background: c }}
                        onClick={() => onColorPick(c)}
                        type="button"
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="Tran Thi"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="Mai"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="patient@email.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+84 912 345 678"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input
                    className="form-control"
                    name="dob"
                    value={form.dob}
                    onChange={onChange}
                    placeholder="Mar 12, 1990"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Blood Type</label>
                  <select
                    className="form-select"
                    name="bloodType"
                    value={form.bloodType}
                    onChange={onChange}
                  >
                    {BLOOD_TYPES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Allergies</label>
                  <input
                    className="form-control"
                    name="allergies"
                    value={form.allergies}
                    onChange={onChange}
                    placeholder="e.g. Penicillin, NSAIDs"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    placeholder="Street, District, City"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={onChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CAT_CFG[c].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Emergency Contact Name</label>
                  <input
                    className="form-control"
                    name="emergencyName"
                    value={form.emergencyName}
                    onChange={onChange}
                    placeholder="Contact person"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    className="form-control"
                    name="emergencyPhone"
                    value={form.emergencyPhone}
                    onChange={onChange}
                    placeholder="+84 900 000 000"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    name="notes"
                    rows={2}
                    value={form.notes}
                    onChange={onChange}
                    placeholder="Additional notes about this patient..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-save" onClick={onSave}>
                {isEdit ? (
                  <>
                    <FaEdit className="me-1" /> Update
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" /> Save Patient
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: PatientViewModal
// ─────────────────────────────────────────────────────────────────────────────
const PatientViewModal = ({ p, onEdit, onClose }) => {
  if (!p) return null;
  const cat = CAT_CFG[p.category];
  const initials =
    `${p.firstName.trim().split(" ").pop().charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
  const age = p.dob
    ? new Date().getFullYear() - new Date(p.dob).getFullYear()
    : "—";

  const infoItems = [
    { icon: FaPhone, label: "Phone", val: p.phone },
    { icon: FaEnvelope, label: "Email", val: p.email },
    { icon: FaMapMarkerAlt, label: "Address", val: p.address },
    { icon: FaBirthdayCake, label: "Date of Birth", val: p.dob },
    { icon: FaVenusMars, label: "Gender", val: p.gender },
    { icon: FaTint, label: "Blood Type", val: p.bloodType },
    {
      icon: FaExclamationTriangle,
      label: "Allergies",
      val: p.allergies || "None",
    },
    {
      icon: FaPhone,
      label: "Emergency Contact",
      val: `${p.emergencyName} · ${p.emergencyPhone}`,
    },
  ];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Patient Profile</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Header */}
              <div className="view-pat-header">
                <div
                  className="view-pat-avatar"
                  style={{ background: p.color }}
                >
                  {initials}
                </div>
                <div>
                  <h4 className="view-pat-name">
                    {p.firstName} {p.lastName}
                  </h4>
                  <p className="view-pat-age">
                    {age} years old · {p.gender}
                  </p>
                  <span className={`pat-cat ${cat.cls}`}>{cat.label}</span>
                </div>
              </div>

              {/* Info grid */}
              <div className="row g-2 mt-3">
                {infoItems.map(({ icon: Icon, label, val }) => (
                  <div key={label} className="col-md-6">
                    <div className="view-info-item">
                      <Icon className="view-info-icon" />
                      <div>
                        <p className="view-info-label">{label}</p>
                        <p
                          className={`view-info-val ${label === "Blood Type" ? "blood-highlight" : ""}`}
                        >
                          {val}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {p.notes && (
                <div className="view-notes">
                  <p className="view-notes__title">
                    <BsFileEarmarkMedicalFill className="me-1" /> Notes
                  </p>
                  <p className="view-notes__text">{p.notes}</p>
                </div>
              )}

              {/* Medical history */}
              <div className="view-history">
                <p className="view-history__title">
                  <FaCalendarAlt className="me-1" /> Medical History
                </p>
                {MOCK_HISTORY.map((h, i) => (
                  <div key={i} className="view-history-row">
                    <div className="view-history-dot" />
                    <div className="view-history-content">
                      <div className="view-history-top">
                        <span className="view-history-date">
                          <FaCalendarAlt /> {h.date}
                        </span>
                        <span
                          className={`view-history-type view-history-type--${h.type.toLowerCase().replace("-", "")}`}
                        >
                          {h.type}
                        </span>
                      </div>
                      <p className="view-history-doctor">
                        <strong>{h.doctor}</strong>
                      </p>
                      <p className="view-history-note">{h.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-save" onClick={onEdit}>
                <FaEdit className="me-1" /> Edit Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DeleteConfirmModal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ p, onConfirm, onClose }) => {
  if (!p) return null;
  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-4">
              <div className="delete-icon-wrap">
                <FaExclamationTriangle />
              </div>
              <h5 className="delete-title">Delete Patient?</h5>
              <p className="delete-desc">
                Are you sure you want to delete
                <br />
                <strong>
                  {p.firstName} {p.lastName}
                </strong>
                ?<br />
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer justify-content-center gap-2 border-0 pt-0 pb-4">
              <button className="btn btn-light border px-4" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-danger px-4" onClick={onConfirm}>
                <FaTrash className="me-1" /> Delete
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
export default function AdminPatientsPage() {
  const [patients, setPatients] = useState(INIT_PATIENTS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Filters
  const [search, setSearch] = useState("");
  const [filterBlood, setFilterBlood] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (p) => {
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      dob: p.dob,
      gender: p.gender,
      bloodType: p.bloodType,
      allergies: p.allergies,
      address: p.address,
      category: p.category,
      color: p.color,
      emergencyName: p.emergencyName,
      emergencyPhone: p.emergencyPhone,
      notes: p.notes,
    });
    setSelected(p);
    setModal("edit");
  };

  const openView = (p) => {
    setSelected(p);
    setModal("view");
  };
  const openDelete = (p) => {
    setSelected(p);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleColorPick = (c) => setForm({ ...form, color: c });

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const entry = {
      ...form,
      lastVisit: selected?.lastVisit ?? "—",
      lastReason: selected?.lastReason ?? "—",
    };
    if (modal === "add") {
      setPatients((prev) => [...prev, { ...entry, id: Date.now() }]);
    } else {
      setPatients((prev) =>
        prev.map((p) => (p.id === selected.id ? { ...p, ...entry } : p)),
      );
    }
    closeModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    setPatients((prev) => prev.filter((p) => p.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...patients];

    if (filterBlood !== "all")
      list = list.filter((p) => p.bloodType === filterBlood);
    if (filterCat !== "all")
      list = list.filter((p) => p.category === filterCat);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q),
      );
    }

    if (sortBy === "name")
      list.sort((a, b) => a.lastName.localeCompare(b.lastName));
    if (sortBy === "newest") list.sort((a, b) => b.id - a.id);
    if (sortBy === "age")
      list.sort((a, b) => new Date(a.dob) - new Date(b.dob));

    return list;
  }, [patients, filterBlood, filterCat, search, sortBy]);

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = patients.length;
  const newCount = patients.filter((p) => p.category === "new").length;
  const active = patients.filter((p) => p.category === "regular").length;
  const critical = patients.filter((p) => p.category === "critical").length;

  return (
    <div className="admin-pats">
      {/* Header */}
      <div className="pats-header">
        <div>
          <h1 className="pats-title">Patients Management</h1>
          <p className="pats-sub">
            Manage patient profiles and medical records.
          </p>
        </div>
        <div className="pats-header__right">
          <span className="pats-badge">
            <FaUserInjured /> {total} patients
          </span>
          <button className="btn-add-pat" onClick={openAdd}>
            <FaPlus /> Add Patient
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="pats-summary">
        {[
          { label: "Total Patients", value: total, cls: "s-teal" },
          { label: "New This Month", value: newCount, cls: "s-green" },
          { label: "Regular", value: active, cls: "s-navy" },
          { label: "Critical Cases", value: critical, cls: "s-danger" },
        ].map((s) => (
          <div key={s.label} className={`pats-summary__card ${s.cls}`}>
            <p className="pats-summary__value">{s.value}</p>
            <p className="pats-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="pats-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-select">
          <FaTint className="toolbar-select__icon" />
          <select
            value={filterBlood}
            onChange={(e) => setFilterBlood(e.target.value)}
          >
            <option value="all">All Blood Types</option>
            {BLOOD_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CAT_CFG[c].label}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-select">
          <FaSortAmountDown className="toolbar-select__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name A→Z</option>
            <option value="newest">Newest</option>
            <option value="age">Age</option>
          </select>
        </div>
      </div>

      <p className="pats-count">
        Showing <strong>{filtered.length}</strong> of {total} patients
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="pats-empty">
          <FaUserInjured className="pats-empty__icon" />
          <p>No patients found.</p>
          <span>Try adjusting your search or filters.</span>
        </div>
      ) : (
        <div className="pats-grid">
          {filtered.map((p) => (
            <PatientCard
              key={p.id}
              p={p}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <PatientFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onColorPick={handleColorPick}
        onSave={handleSave}
        onClose={closeModal}
      />
      <PatientViewModal
        p={modal === "view" ? selected : null}
        onEdit={() => {
          closeModal();
          openEdit(selected);
        }}
        onClose={closeModal}
      />
      <DeleteConfirmModal
        p={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
