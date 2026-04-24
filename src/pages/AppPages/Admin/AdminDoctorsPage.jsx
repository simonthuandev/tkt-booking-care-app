// ─────────────────────────────────────────────────────────────────────────────
// AdminDoctorsPage.jsx  —  Doctors Management CRUD
// Bootstrap Modal (React state controlled, không dùng data-bs-toggle)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaUserMd,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaStethoscope,
  FaHospital,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import "./AdminDoctorsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const INIT_DOCTORS = [
  {
    id: 1,
    firstName: "Nguyen Van",
    lastName: "An",
    email: "dr.an@tkt.com",
    phone: "+84 912 345 678",
    specialty: "Cardiology",
    hospital: "TKT Medical",
    experience: 12,
    fee: 500000,
    rating: 4.9,
    patients: 312,
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    bio: "Board-certified cardiologist with 12 years of experience in interventional cardiology and heart failure management.",
  },
  {
    id: 2,
    firstName: "Le Thi",
    lastName: "Bich",
    email: "dr.bich@tkt.com",
    phone: "+84 909 876 543",
    specialty: "Neurology",
    hospital: "City Hospital",
    experience: 9,
    fee: 600000,
    rating: 4.8,
    patients: 287,
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    bio: "Specialist in neurological disorders with focus on stroke prevention and epilepsy management.",
  },
  {
    id: 3,
    firstName: "Tran Quoc",
    lastName: "Hung",
    email: "dr.hung@tkt.com",
    phone: "+84 936 111 222",
    specialty: "Dermatology",
    hospital: "Riverside",
    experience: 7,
    fee: 400000,
    rating: 4.7,
    patients: 254,
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    bio: "Experienced dermatologist specializing in skin cancer screening and cosmetic dermatology.",
  },
  {
    id: 4,
    firstName: "Pham Duc",
    lastName: "Minh",
    email: "dr.minh@city.com",
    phone: "+84 918 222 333",
    specialty: "Orthopedics",
    hospital: "City Hospital",
    experience: 15,
    fee: 700000,
    rating: 4.7,
    patients: 231,
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    bio: "Senior orthopedic surgeon specializing in joint replacement and sports injury rehabilitation.",
  },
  {
    id: 5,
    firstName: "Vo Thi",
    lastName: "Lan",
    email: "dr.lan@river.com",
    phone: "+84 977 444 555",
    specialty: "Ophthalmology",
    hospital: "Riverside",
    experience: 6,
    fee: 450000,
    rating: 4.6,
    patients: 198,
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=48",
    bio: "Eye specialist with expertise in cataract surgery and laser vision correction procedures.",
  },
  {
    id: 6,
    firstName: "Hoang Van",
    lastName: "Nam",
    email: "dr.nam@tkt.com",
    phone: "+84 903 666 777",
    specialty: "Pediatrics",
    hospital: "TKT Medical",
    experience: 8,
    fee: 350000,
    rating: 4.8,
    patients: 421,
    status: "active",
    avatarUrl: "https://i.pravatar.cc/150?img=57",
    bio: "Dedicated pediatrician with a gentle approach to child healthcare and developmental assessments.",
  },
  {
    id: 7,
    firstName: "Dang Thi",
    lastName: "Hoa",
    email: "dr.hoa@city.com",
    phone: "+84 945 888 999",
    specialty: "Gynecology",
    hospital: "City Hospital",
    experience: 5,
    fee: 550000,
    rating: 4.5,
    patients: 143,
    status: "pending",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
    bio: "Women's health specialist with focus on maternal care and minimally invasive gynecological procedures.",
  },
  {
    id: 8,
    firstName: "Bui Minh",
    lastName: "Khoa",
    email: "dr.khoa@river.com",
    phone: "+84 908 123 456",
    specialty: "Oncology",
    hospital: "Riverside",
    experience: 11,
    fee: 800000,
    rating: 4.6,
    patients: 89,
    status: "inactive",
    avatarUrl: "https://i.pravatar.cc/150?img=53",
    bio: "Oncologist specializing in breast and colorectal cancer treatment with multidisciplinary approach.",
  },
];

// Mock appointments cho View modal
const MOCK_APPTS = [
  {
    patient: "Tran Thi Mai",
    type: "Check-up",
    date: "Apr 17, 2026",
    status: "completed",
  },
  {
    patient: "Le Van Binh",
    type: "Follow-up",
    date: "Apr 15, 2026",
    status: "completed",
  },
  {
    patient: "Pham Duc Thanh",
    type: "Consultation",
    date: "Apr 13, 2026",
    status: "completed",
  },
];

const SPECIALTIES = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "Ophthalmology",
  "Pediatrics",
  "Gynecology",
  "Oncology",
];
const HOSPITALS = ["TKT Medical", "City Hospital", "Riverside"];

const STATUS_CFG = {
  active: { label: "Active", cls: "badge-active" },
  pending: { label: "Pending", cls: "badge-pending" },
  inactive: { label: "Inactive", cls: "badge-inactive" },
};

// Form trống cho Add
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  specialty: "Cardiology",
  hospital: "TKT Medical",
  experience: "",
  fee: "",
  status: "active",
  avatarUrl: "",
  bio: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DoctorCard
// ─────────────────────────────────────────────────────────────────────────────
const DoctorCard = ({ doc, onView, onEdit, onDelete }) => {
  const s = STATUS_CFG[doc.status];
  return (
    <div className="doc-card">
      {/* Avatar + status badge */}
      <div className="doc-card__avatar-wrap">
        <img
          src={doc.avatarUrl}
          alt={doc.firstName}
          className="doc-card__avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.firstName)}&background=0ba3a3&color=fff`;
          }}
        />
        <span className={`doc-card__status ${s.cls}`}>{s.label}</span>
      </div>

      {/* Name + specialty */}
      <div className="doc-card__identity">
        <p className="doc-card__name">
          Dr. {doc.firstName} {doc.lastName}
        </p>
        <p className="doc-card__spec">
          <FaStethoscope /> {doc.specialty}
        </p>
      </div>

      {/* Info grid */}
      <div className="doc-card__info">
        <span>
          <FaHospital /> {doc.hospital}
        </span>
        <span>
          <FaCalendarAlt /> {doc.experience} yrs exp
        </span>
        <span>
          <FaStar /> {doc.rating}
        </span>
        <span>
          <FaUserMd /> {doc.patients} patients
        </span>
      </div>

      {/* Fee */}
      <p className="doc-card__fee">
        ₫{Number(doc.fee).toLocaleString()} / visit
      </p>

      {/* Actions */}
      <div className="doc-card__actions">
        <button className="doc-btn doc-btn--view" onClick={() => onView(doc)}>
          <FaEye /> View
        </button>
        <button className="doc-btn doc-btn--edit" onClick={() => onEdit(doc)}>
          <FaEdit /> Edit
        </button>
        <button
          className="doc-btn doc-btn--delete"
          onClick={() => onDelete(doc)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DoctorFormModal  (Add / Edit)
// Dùng Bootstrap Modal class, React-controlled
// ─────────────────────────────────────────────────────────────────────────────
const DoctorFormModal = ({ mode, form, onChange, onSave, onClose }) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";

  return (
    <>
      {/* Bootstrap backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose} />

      {/* Modal */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <FaUserMd className="me-2 text-primary" />
                {isEdit ? "Edit Doctor" : "Add New Doctor"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            {/* Body — Bootstrap grid form */}
            <div className="modal-body">
              <div className="row g-3">
                {/* First Name */}
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="Nguyen Van"
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="An"
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="doctor@email.com"
                  />
                </div>

                {/* Phone */}
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

                {/* Specialty */}
                <div className="col-md-6">
                  <label className="form-label">Specialty</label>
                  <select
                    className="form-select"
                    name="specialty"
                    value={form.specialty}
                    onChange={onChange}
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="col-md-6">
                  <label className="form-label">Years of Experience</label>
                  <input
                    className="form-control"
                    name="experience"
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={onChange}
                    placeholder="e.g. 10"
                  />
                </div>

                {/* Hospital */}
                <div className="col-md-6">
                  <label className="form-label">Hospital / Clinic</label>
                  <select
                    className="form-select"
                    name="hospital"
                    value={form.hospital}
                    onChange={onChange}
                  >
                    {HOSPITALS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consultation Fee */}
                <div className="col-md-6">
                  <label className="form-label">Consultation Fee (VND)</label>
                  <input
                    className="form-control"
                    name="fee"
                    type="number"
                    min="0"
                    value={form.fee}
                    onChange={onChange}
                    placeholder="e.g. 500000"
                  />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={onChange}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Avatar URL + preview */}
                <div className="col-md-6">
                  <label className="form-label">Avatar URL</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      className="form-control"
                      name="avatarUrl"
                      value={form.avatarUrl}
                      onChange={onChange}
                      placeholder="https://i.pravatar.cc/150?img=11"
                    />
                    {form.avatarUrl && (
                      <img
                        src={form.avatarUrl}
                        alt="preview"
                        className="avatar-preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="col-12">
                  <label className="form-label">Bio / Introduction</label>
                  <textarea
                    className="form-control"
                    name="bio"
                    rows={3}
                    value={form.bio}
                    onChange={onChange}
                    placeholder="Short introduction about the doctor..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
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
                    <FaPlus className="me-1" /> Save Doctor
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
// SUB-COMPONENT: DoctorViewModal
// ─────────────────────────────────────────────────────────────────────────────
const DoctorViewModal = ({ doc, onEdit, onClose }) => {
  if (!doc) return null;
  const s = STATUS_CFG[doc.status];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Doctor Profile</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Top: avatar + name */}
              <div className="view-header">
                <img
                  src={doc.avatarUrl}
                  alt={doc.firstName}
                  className="view-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.firstName)}&background=0ba3a3&color=fff`;
                  }}
                />
                <div>
                  <h4 className="view-name">
                    Dr. {doc.firstName} {doc.lastName}
                  </h4>
                  <p className="view-spec">
                    <FaStethoscope className="me-1" />
                    {doc.specialty}
                  </p>
                  <span className={`doc-card__status ${s.cls}`}>{s.label}</span>
                </div>
              </div>

              {/* Info grid 2 cột */}
              <div className="row g-2 mt-3">
                {[
                  { icon: FaPhone, label: "Phone", val: doc.phone },
                  { icon: FaEnvelope, label: "Email", val: doc.email },
                  { icon: FaHospital, label: "Hospital", val: doc.hospital },
                  {
                    icon: FaStethoscope,
                    label: "Specialty",
                    val: doc.specialty,
                  },
                  {
                    icon: FaCalendarAlt,
                    label: "Experience",
                    val: `${doc.experience} years`,
                  },
                  { icon: FaStar, label: "Rating", val: doc.rating },
                  {
                    icon: FaUserMd,
                    label: "Patients",
                    val: `${doc.patients} visits`,
                  },
                  {
                    icon: FaUserMd,
                    label: "Fee",
                    val: `₫${Number(doc.fee).toLocaleString()}`,
                  },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="col-md-6">
                    <div className="view-info-item">
                      <Icon className="view-info-icon" />
                      <div>
                        <p className="view-info-label">{label}</p>
                        <p className="view-info-val">{val}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio */}
              {doc.bio && (
                <div className="view-bio">
                  <p className="view-bio__title">Bio</p>
                  <p className="view-bio__text">{doc.bio}</p>
                </div>
              )}

              {/* Recent appointments */}
              <div className="view-appts">
                <p className="view-appts__title">
                  <FaCalendarAlt className="me-1" /> Recent Appointments
                </p>
                {MOCK_APPTS.map((a, i) => (
                  <div key={i} className="view-appt-row">
                    <div className="view-appt-info">
                      <p className="view-appt-patient">{a.patient}</p>
                      <p className="view-appt-type">
                        {a.type} · {a.date}
                      </p>
                    </div>
                    <span className="view-appt-badge">{a.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-save" onClick={onEdit}>
                <FaEdit className="me-1" /> Edit Doctor
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
const DeleteConfirmModal = ({ doc, onConfirm, onClose }) => {
  if (!doc) return null;
  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body text-center py-4">
              <div className="delete-icon-wrap">
                <FaExclamationTriangle />
              </div>
              <h5 className="delete-title">Delete Doctor?</h5>
              <p className="delete-desc">
                Are you sure you want to delete
                <br />
                <strong>
                  Dr. {doc.firstName} {doc.lastName}
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
export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState(INIT_DOCTORS);
  const [modal, setModal] = useState(null); // "add"|"edit"|"view"|"delete"
  const [selected, setSelected] = useState(null); // doctor đang thao tác
  const [form, setForm] = useState(EMPTY_FORM); // form Add/Edit

  // Filters
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // ── Modal openers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (doc) => {
    setForm({
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      specialty: doc.specialty,
      hospital: doc.hospital,
      experience: String(doc.experience),
      fee: String(doc.fee),
      status: doc.status,
      avatarUrl: doc.avatarUrl,
      bio: doc.bio,
    });
    setSelected(doc);
    setModal("edit");
  };

  const openView = (doc) => {
    setSelected(doc);
    setModal("view");
  };
  const openDelete = (doc) => {
    setSelected(doc);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  // ── Form handler ──────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Save (Add / Edit) ─────────────────────────────────────────────────────
  const handleSave = () => {
    const entry = {
      ...form,
      experience: Number(form.experience) || 0,
      fee: Number(form.fee) || 0,
      rating: selected?.rating ?? 0,
      patients: selected?.patients ?? 0,
    };

    if (modal === "add") {
      setDoctors((prev) => [...prev, { ...entry, id: Date.now() }]);
    } else {
      setDoctors((prev) =>
        prev.map((d) => (d.id === selected.id ? { ...d, ...entry } : d)),
      );
    }
    closeModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    setDoctors((prev) => prev.filter((d) => d.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline (useMemo) ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...doctors];

    if (filterSpec !== "all")
      list = list.filter((d) => d.specialty === filterSpec);
    if (filterStatus !== "all")
      list = list.filter((d) => d.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q),
      );
    }

    if (sortBy === "name")
      list.sort((a, b) => a.lastName.localeCompare(b.lastName));
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "patients") list.sort((a, b) => b.patients - a.patients);

    return list;
  }, [doctors, filterSpec, filterStatus, search, sortBy]);

  // ── Summary counts ────────────────────────────────────────────────────────
  const total = doctors.length;
  const active = doctors.filter((d) => d.status === "active").length;
  const pending = doctors.filter((d) => d.status === "pending").length;

  return (
    <div className="admin-docs">
      {/* Header */}
      <div className="docs-header">
        <div>
          <h1 className="docs-title">Doctors Management</h1>
          <p className="docs-sub">Manage doctor profiles and credentials.</p>
        </div>
        <div className="docs-header__right">
          <span className="docs-total-badge">
            <FaUserMd /> {total} doctors
          </span>
          <button className="btn-add-doc" onClick={openAdd}>
            <FaPlus /> Add Doctor
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="docs-summary">
        <div className="docs-summary__item s-teal">
          <FaUserMd />
          <div>
            <p>{total}</p>
            <span>Total Doctors</span>
          </div>
        </div>
        <div className="docs-summary__item s-green">
          <FaCheckCircle />
          <div>
            <p>{active}</p>
            <span>Active</span>
          </div>
        </div>
        <div className="docs-summary__item s-amber">
          <FaClock />
          <div>
            <p>{pending}</p>
            <span>Pending Approval</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="docs-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-select">
          <FaStethoscope className="toolbar-select__icon" />
          <select
            value={filterSpec}
            onChange={(e) => setFilterSpec(e.target.value)}
          >
            <option value="all">All Specialties</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="toolbar-select">
          <FaSortAmountDown className="toolbar-select__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name A→Z</option>
            <option value="rating">Top Rating</option>
            <option value="patients">Most Patients</option>
          </select>
        </div>
      </div>

      <p className="docs-count">
        Showing <strong>{filtered.length}</strong> of {total} doctors
      </p>

      {/* Doctor Grid */}
      {filtered.length === 0 ? (
        <div className="docs-empty">
          <FaUserMd className="docs-empty__icon" />
          <p>No doctors found.</p>
          <span>Try adjusting your search or filters.</span>
        </div>
      ) : (
        <div className="docs-grid">
          {filtered.map((doc) => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <DoctorFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onSave={handleSave}
        onClose={closeModal}
      />

      <DoctorViewModal
        doc={modal === "view" ? selected : null}
        onEdit={() => {
          closeModal();
          openEdit(selected);
        }}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        doc={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
