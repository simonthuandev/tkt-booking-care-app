// ─────────────────────────────────────────────────────────────────────────────
// AdminSpecialtiesPage.jsx  —  Specialties Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaUserMd,
  FaStethoscope,
  FaHospital,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import "./AdminSpecialtiesPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────────────────────────────────────────
const ICON_PRESETS = [
  "❤️",
  "🧠",
  "👁️",
  "🦴",
  "💊",
  "🩺",
  "👶",
  "🔬",
  "🫁",
  "🦷",
];

const COLOR_PRESETS = [
  { name: "Teal", from: "#0ba3a3", to: "#077d7d" },
  { name: "Navy", from: "#1a3a5c", to: "#0d2b45" },
  { name: "Purple", from: "#7c3aed", to: "#5b21b6" },
  { name: "Rose", from: "#f43f5e", to: "#be123c" },
  { name: "Amber", from: "#f59e0b", to: "#b45309" },
  { name: "Green", from: "#10b981", to: "#047857" },
];

// Mock doctors cho ViewDoctorsModal
const MOCK_DOCTORS_BY_SPEC = {
  Cardiology: [
    {
      name: "Dr. Nguyen Van An",
      hospital: "TKT Medical",
      rating: 4.9,
      img: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Dr. Pham Duc Minh",
      hospital: "City Hospital",
      rating: 4.7,
      img: "https://i.pravatar.cc/150?img=12",
    },
  ],
  Neurology: [
    {
      name: "Dr. Le Thi Bich",
      hospital: "City Hospital",
      rating: 4.8,
      img: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Dr. Hoang Van Nam",
      hospital: "Riverside",
      rating: 4.6,
      img: "https://i.pravatar.cc/150?img=57",
    },
  ],
  Dermatology: [
    {
      name: "Dr. Tran Quoc Hung",
      hospital: "Riverside",
      rating: 4.7,
      img: "https://i.pravatar.cc/150?img=15",
    },
  ],
  Orthopedics: [
    {
      name: "Dr. Pham Duc Minh",
      hospital: "TKT Medical",
      rating: 4.7,
      img: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Dr. Cao Minh Tri",
      hospital: "City Hospital",
      rating: 4.5,
      img: "https://i.pravatar.cc/150?img=53",
    },
  ],
  Ophthalmology: [
    {
      name: "Dr. Vo Thi Lan",
      hospital: "Riverside",
      rating: 4.6,
      img: "https://i.pravatar.cc/150?img=48",
    },
  ],
  Pediatrics: [
    {
      name: "Dr. Hoang Van Nam",
      hospital: "TKT Medical",
      rating: 4.8,
      img: "https://i.pravatar.cc/150?img=57",
    },
    {
      name: "Dr. Dang Thi Hoa",
      hospital: "City Hospital",
      rating: 4.5,
      img: "https://i.pravatar.cc/150?img=44",
    },
  ],
  Gynecology: [
    {
      name: "Dr. Dang Thi Hoa",
      hospital: "City Hospital",
      rating: 4.5,
      img: "https://i.pravatar.cc/150?img=44",
    },
  ],
  Oncology: [
    {
      name: "Dr. Bui Minh Khoa",
      hospital: "Riverside",
      rating: 4.6,
      img: "https://i.pravatar.cc/150?img=53",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 8 specialties
// ─────────────────────────────────────────────────────────────────────────────
const INIT_SPECIALTIES = [
  {
    id: 1,
    name: "Cardiology",
    icon: "❤️",
    desc: "Diagnosis and treatment of heart and cardiovascular system disorders.",
    color: COLOR_PRESETS[0],
    doctors: 12,
    visits: 1842,
    status: "active",
  },
  {
    id: 2,
    name: "Neurology",
    icon: "🧠",
    desc: "Specializes in disorders of the nervous system including brain and spine.",
    color: COLOR_PRESETS[2],
    doctors: 8,
    visits: 1120,
    status: "active",
  },
  {
    id: 3,
    name: "Dermatology",
    icon: "🔬",
    desc: "Focuses on skin, hair, nail conditions and cosmetic procedures.",
    color: COLOR_PRESETS[4],
    doctors: 6,
    visits: 980,
    status: "active",
  },
  {
    id: 4,
    name: "Orthopedics",
    icon: "🦴",
    desc: "Treatment of musculoskeletal system including bones, joints and muscles.",
    color: COLOR_PRESETS[1],
    doctors: 10,
    visits: 1540,
    status: "active",
  },
  {
    id: 5,
    name: "Ophthalmology",
    icon: "👁️",
    desc: "Care for eyes and vision, including surgery and laser treatments.",
    color: COLOR_PRESETS[5],
    doctors: 5,
    visits: 760,
    status: "active",
  },
  {
    id: 6,
    name: "Pediatrics",
    icon: "👶",
    desc: "Medical care for infants, children and adolescents.",
    color: COLOR_PRESETS[0],
    doctors: 9,
    visits: 2100,
    status: "active",
  },
  {
    id: 7,
    name: "Gynecology",
    icon: "💊",
    desc: "Women's reproductive health, maternal care and minimally invasive surgery.",
    color: COLOR_PRESETS[3],
    doctors: 7,
    visits: 890,
    status: "active",
  },
  {
    id: 8,
    name: "Oncology",
    icon: "🩺",
    desc: "Diagnosis and treatment of cancer using chemotherapy and other methods.",
    color: COLOR_PRESETS[2],
    doctors: 4,
    visits: 430,
    status: "inactive",
  },
];

const EMPTY_FORM = {
  name: "",
  icon: "❤️",
  desc: "",
  color: COLOR_PRESETS[0],
  status: "active",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SpecialtyCard
// ─────────────────────────────────────────────────────────────────────────────
const SpecialtyCard = ({ s, onView, onEdit, onDelete }) => (
  <div className="spec-card">
    {/* Gradient header */}
    <div
      className="spec-card__header"
      style={{
        background: `linear-gradient(135deg, ${s.color.from} 0%, ${s.color.to} 100%)`,
      }}
    >
      <span className="spec-card__icon">{s.icon}</span>
      <h3 className="spec-card__name">{s.name}</h3>
      <span
        className={`spec-card__status ${s.status === "active" ? "status-active" : "status-inactive"}`}
      >
        {s.status === "active" ? (
          <>
            <FaCheckCircle /> Active
          </>
        ) : (
          <>
            <FaTimesCircle /> Inactive
          </>
        )}
      </span>
    </div>

    {/* Body */}
    <div className="spec-card__body">
      <p className="spec-card__desc">{s.desc}</p>

      <div className="spec-card__stats">
        <div className="spec-card__stat">
          <FaUserMd />
          <div>
            <p className="spec-card__stat-value">{s.doctors}</p>
            <p className="spec-card__stat-label">Doctors</p>
          </div>
        </div>
        <div className="spec-card__stat">
          <FaStethoscope />
          <div>
            <p className="spec-card__stat-value">{s.visits.toLocaleString()}</p>
            <p className="spec-card__stat-label">Total Visits</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="spec-card__actions">
        <button className="spec-btn spec-btn--view" onClick={() => onView(s)}>
          <FaEye /> View Doctors
        </button>
        <button className="spec-btn spec-btn--edit" onClick={() => onEdit(s)}>
          <FaEdit />
        </button>
        <button
          className="spec-btn spec-btn--delete"
          onClick={() => onDelete(s)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SpecialtyFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const SpecialtyFormModal = ({
  mode,
  form,
  onChange,
  onColorPick,
  onIconPick,
  onSave,
  onClose,
}) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaStethoscope className="me-2" style={{ color: "#0ba3a3" }} />
                {isEdit ? "Edit Specialty" : "Add New Specialty"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {/* Left: form */}
                <div className="col-md-7">
                  <div className="row g-3">
                    {/* Name */}
                    <div className="col-12">
                      <label className="form-label">Specialty Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="e.g. Cardiology"
                      />
                    </div>

                    {/* Icon picker */}
                    <div className="col-12">
                      <label className="form-label">Icon</label>
                      <div className="icon-picker">
                        {ICON_PRESETS.map((ico) => (
                          <button
                            key={ico}
                            type="button"
                            className={`icon-swatch ${form.icon === ico ? "icon-swatch--active" : ""}`}
                            onClick={() => onIconPick(ico)}
                          >
                            {ico}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color picker */}
                    <div className="col-12">
                      <label className="form-label">Color Theme</label>
                      <div className="spec-color-picker">
                        {COLOR_PRESETS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            className={`spec-color-swatch ${form.color.name === c.name ? "spec-color-swatch--active" : ""}`}
                            style={{
                              background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                            }}
                            onClick={() => onColorPick(c)}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="desc"
                        rows={3}
                        value={form.desc}
                        onChange={onChange}
                        placeholder="Brief description of this specialty..."
                      />
                    </div>

                    {/* Status */}
                    <div className="col-12">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={form.status}
                        onChange={onChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right: preview card */}
                <div className="col-md-5">
                  <label className="form-label">Preview</label>
                  <div className="spec-preview">
                    <div
                      className="spec-preview__header"
                      style={{
                        background: `linear-gradient(135deg, ${form.color.from} 0%, ${form.color.to} 100%)`,
                      }}
                    >
                      <span className="spec-preview__icon">{form.icon}</span>
                      <p className="spec-preview__name">
                        {form.name || "Specialty Name"}
                      </p>
                    </div>
                    <div className="spec-preview__body">
                      <p className="spec-preview__desc">
                        {form.desc || "Description will appear here..."}
                      </p>
                      <span
                        className={`spec-preview__status ${form.status === "active" ? "status-active" : "status-inactive"}`}
                      >
                        {form.status === "active" ? "● Active" : "● Inactive"}
                      </span>
                    </div>
                  </div>
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
                    <FaEdit className="me-1" />
                    Update
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" />
                    Save Specialty
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
// SUB-COMPONENT: ViewDoctorsModal
// ─────────────────────────────────────────────────────────────────────────────
const ViewDoctorsModal = ({ specialty, onClose }) => {
  if (!specialty) return null;
  const doctors = MOCK_DOCTORS_BY_SPEC[specialty.name] || [];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{
                background: `linear-gradient(135deg, ${specialty.color.from}, ${specialty.color.to})`,
              }}
            >
              <h5 className="modal-title text-white">
                <span className="me-2">{specialty.icon}</span>
                Doctors in {specialty.name}
              </h5>
              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <div className="modal-body p-0">
              {doctors.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FaUserMd
                    style={{ fontSize: "2rem", opacity: 0.3, marginBottom: 8 }}
                  />
                  <p className="mb-0">No doctors assigned yet.</p>
                </div>
              ) : (
                <div className="view-doc-list">
                  {doctors.map((doc, i) => (
                    <div key={i} className="view-doc-item">
                      <img
                        src={doc.img}
                        alt={doc.name}
                        className="view-doc-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0ba3a3&color=fff`;
                        }}
                      />
                      <div className="view-doc-info">
                        <p className="view-doc-name">{doc.name}</p>
                        <p className="view-doc-hospital">
                          <FaHospital /> {doc.hospital}
                        </p>
                      </div>
                      <div className="view-doc-rating">
                        <FaStar /> {doc.rating}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
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
const DeleteConfirmModal = ({ s, onConfirm, onClose }) => {
  if (!s) return null;
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
              <h5 className="delete-title">Delete Specialty?</h5>
              <p className="delete-desc">
                Are you sure you want to delete
                <br />
                <strong>
                  {s.icon} {s.name}
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
export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState(INIT_SPECIALTIES);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStat, setFilterStat] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (s) => {
    setForm({
      name: s.name,
      icon: s.icon,
      desc: s.desc,
      color: s.color,
      status: s.status,
    });
    setSelected(s);
    setModal("edit");
  };

  const openView = (s) => {
    setSelected(s);
    setModal("view");
  };
  const openDelete = (s) => {
    setSelected(s);
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
  const handleIconPick = (i) => setForm({ ...form, icon: i });

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (modal === "add") {
      setSpecialties((prev) => [
        ...prev,
        { ...form, id: Date.now(), doctors: 0, visits: 0 },
      ]);
    } else {
      setSpecialties((prev) =>
        prev.map((s) => (s.id === selected.id ? { ...s, ...form } : s)),
      );
    }
    closeModal();
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = () => {
    setSpecialties((prev) => prev.filter((s) => s.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...specialties];
    if (filterStat !== "all")
      list = list.filter((s) => s.status === filterStat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
      );
    }
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "doctors") list.sort((a, b) => b.doctors - a.doctors);
    if (sortBy === "newest") list.sort((a, b) => b.id - a.id);
    return list;
  }, [specialties, filterStat, search, sortBy]);

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = specialties.length;
  const activeCount = specialties.filter((s) => s.status === "active").length;
  const totalDocs = specialties.reduce((sum, s) => sum + s.doctors, 0);

  return (
    <div className="admin-specs">
      {/* Header */}
      <div className="specs-header">
        <div>
          <h1 className="specs-title">Specialties Management</h1>
          <p className="specs-sub">
            Manage medical specialties and assigned doctors.
          </p>
        </div>
        <div className="specs-header__right">
          <span className="specs-badge">
            <FaStethoscope /> {total} specialties
          </span>
          <button className="btn-add-spec" onClick={openAdd}>
            <FaPlus /> Add Specialty
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="specs-summary">
        {[
          { label: "Total Specialties", value: total, cls: "s-teal" },
          { label: "Active", value: activeCount, cls: "s-green" },
          { label: "Doctors Assigned", value: totalDocs, cls: "s-navy" },
        ].map((s) => (
          <div key={s.label} className={`specs-summary__card ${s.cls}`}>
            <p className="specs-summary__value">{s.value}</p>
            <p className="specs-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="specs-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search specialty name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterStat}
            onChange={(e) => setFilterStat(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="toolbar-select">
          <FaSortAmountDown className="toolbar-select__icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name A→Z</option>
            <option value="doctors">Most Doctors</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <p className="specs-count">
        Showing <strong>{filtered.length}</strong> of {total} specialties
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="specs-empty">
          <FaStethoscope className="specs-empty__icon" />
          <p>No specialties found.</p>
          <span>Try adjusting your search or filters.</span>
        </div>
      ) : (
        <div className="specs-grid">
          {filtered.map((s) => (
            <SpecialtyCard
              key={s.id}
              s={s}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SpecialtyFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onColorPick={handleColorPick}
        onIconPick={handleIconPick}
        onSave={handleSave}
        onClose={closeModal}
      />
      <ViewDoctorsModal
        specialty={modal === "view" ? selected : null}
        onClose={closeModal}
      />
      <DeleteConfirmModal
        s={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
