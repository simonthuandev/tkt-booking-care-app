// ─────────────────────────────────────────────────────────────────────────────
// AdminServicesPage.jsx  —  Services Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaStethoscope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaTag,
  FaClock,
  FaMoneyBillWave,
  FaUserMd,
  FaStar,
  FaExclamationTriangle,
  FaListAlt,
  FaShieldAlt,
  FaClipboardList,
} from "react-icons/fa";
import "./AdminServicesPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = {
  Diagnostic: { icon: "🔬", gradient: ["#0ba3a3", "#077d7d"] },
  Treatment: { icon: "💊", gradient: ["#7c3aed", "#5b21b6"] },
  Surgery: { icon: "🔪", gradient: ["#e24b4a", "#be123c"] },
  Consultation: { icon: "🩺", gradient: ["#0d2b45", "#1a3a5c"] },
  Preventive: { icon: "🛡️", gradient: ["#10b981", "#047857"] },
};

const COLOR_PRESETS = [
  { name: "Teal", from: "#0ba3a3", to: "#077d7d" },
  { name: "Navy", from: "#1a3a5c", to: "#0d2b45" },
  { name: "Purple", from: "#7c3aed", to: "#5b21b6" },
  { name: "Rose", from: "#f43f5e", to: "#be123c" },
  { name: "Amber", from: "#f59e0b", to: "#b45309" },
  { name: "Green", from: "#10b981", to: "#047857" },
];

const ICON_PRESETS = [
  "🔬",
  "💊",
  "🔪",
  "🩺",
  "🛡️",
  "🩻",
  "💉",
  "🧪",
  "🏥",
  "❤️",
];

const CAT_NAMES = Object.keys(SERVICE_CATEGORIES);

// Mock doctors per service
const MOCK_DOCS = {
  "Full Blood Panel": [
    {
      name: "Dr. Nguyen Van An",
      spec: "Cardiology",
      img: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Dr. Pham Duc Minh",
      spec: "Orthopedics",
      img: "https://i.pravatar.cc/150?img=12",
    },
  ],
  "Cardiac Stress Test": [
    {
      name: "Dr. Nguyen Van An",
      spec: "Cardiology",
      img: "https://i.pravatar.cc/150?img=11",
    },
  ],
  "Hypertension Management": [
    {
      name: "Dr. Le Thi Bich",
      spec: "Neurology",
      img: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Dr. Nguyen Van An",
      spec: "Cardiology",
      img: "https://i.pravatar.cc/150?img=11",
    },
  ],
  "Cataract Surgery": [
    {
      name: "Dr. Vo Thi Lan",
      spec: "Ophthalmology",
      img: "https://i.pravatar.cc/150?img=48",
    },
  ],
  "General Consultation": [
    {
      name: "Dr. Hoang Van Nam",
      spec: "Pediatrics",
      img: "https://i.pravatar.cc/150?img=57",
    },
    {
      name: "Dr. Le Thi Bich",
      spec: "Neurology",
      img: "https://i.pravatar.cc/150?img=47",
    },
  ],
  "Annual Health Checkup": [
    {
      name: "Dr. Pham Duc Minh",
      spec: "Orthopedics",
      img: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Dr. Hoang Van Nam",
      spec: "Pediatrics",
      img: "https://i.pravatar.cc/150?img=57",
    },
  ],
  "Skin Laser Treatment": [
    {
      name: "Dr. Tran Quoc Hung",
      spec: "Dermatology",
      img: "https://i.pravatar.cc/150?img=15",
    },
  ],
  "Vaccination Package": [
    {
      name: "Dr. Hoang Van Nam",
      spec: "Pediatrics",
      img: "https://i.pravatar.cc/150?img=57",
    },
    {
      name: "Dr. Dang Thi Hoa",
      spec: "Gynecology",
      img: "https://i.pravatar.cc/150?img=44",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 8 services
// ─────────────────────────────────────────────────────────────────────────────
const INIT_SERVICES = [
  {
    id: 1,
    name: "Full Blood Panel",
    category: "Diagnostic",
    icon: "🔬",
    color: COLOR_PRESETS[0],
    duration: 30,
    price: 350000,
    rating: 4.7,
    usage: 1240,
    status: "active",
    requirements:
      "No food or drink (except water) for 8 hours before the test.",
    description:
      "A comprehensive blood test measuring red and white blood cells, platelets, hemoglobin, and other key indicators of health.",
  },
  {
    id: 2,
    name: "Cardiac Stress Test",
    category: "Diagnostic",
    icon: "❤️",
    color: COLOR_PRESETS[0],
    duration: 60,
    price: 800000,
    rating: 4.8,
    usage: 542,
    status: "active",
    requirements:
      "Avoid caffeine 24 hours before. Wear comfortable walking shoes.",
    description:
      "Evaluates heart function during physical exertion using a treadmill with continuous ECG monitoring.",
  },
  {
    id: 3,
    name: "Hypertension Management",
    category: "Treatment",
    icon: "💊",
    color: COLOR_PRESETS[2],
    duration: 45,
    price: 500000,
    rating: 4.6,
    usage: 876,
    status: "active",
    requirements:
      "Bring previous blood pressure records and current medication list.",
    description:
      "A structured treatment program for managing high blood pressure, including medication review, lifestyle counseling, and monitoring plan.",
  },
  {
    id: 4,
    name: "Cataract Surgery",
    category: "Surgery",
    icon: "🔪",
    color: COLOR_PRESETS[3],
    duration: 90,
    price: 8500000,
    rating: 4.9,
    usage: 198,
    status: "active",
    requirements:
      "No food/drink 6h before. Arrange transport. Stop blood thinners as advised.",
    description:
      "Minimally invasive phacoemulsification surgery to remove the clouded lens and replace it with a clear intraocular lens.",
  },
  {
    id: 5,
    name: "General Consultation",
    category: "Consultation",
    icon: "🩺",
    color: COLOR_PRESETS[1],
    duration: 20,
    price: 200000,
    rating: 4.5,
    usage: 3420,
    status: "active",
    requirements: "Bring ID card and any previous medical records.",
    description:
      "A one-on-one consultation with a general practitioner to assess symptoms, provide diagnosis, and recommend treatment options.",
  },
  {
    id: 6,
    name: "Annual Health Checkup",
    category: "Preventive",
    icon: "🛡️",
    color: COLOR_PRESETS[5],
    duration: 120,
    price: 1500000,
    rating: 4.8,
    usage: 2100,
    status: "active",
    requirements:
      "Fasting for 8–12 hours. Avoid strenuous exercise the day before.",
    description:
      "A comprehensive annual health screening covering blood tests, ECG, chest X-ray, abdominal ultrasound, and specialist consultations.",
  },
  {
    id: 7,
    name: "Skin Laser Treatment",
    category: "Treatment",
    icon: "🔬",
    color: COLOR_PRESETS[2],
    duration: 45,
    price: 1200000,
    rating: 4.6,
    usage: 312,
    status: "active",
    requirements:
      "Avoid sun exposure 2 weeks prior. Remove makeup before session.",
    description:
      "Advanced laser therapy for skin rejuvenation, acne scar reduction, pigmentation correction, and anti-aging treatments.",
  },
  {
    id: 8,
    name: "Vaccination Package",
    category: "Preventive",
    icon: "🛡️",
    color: COLOR_PRESETS[5],
    duration: 30,
    price: 450000,
    rating: 4.7,
    usage: 1580,
    status: "inactive",
    requirements: "Inform doctor of any allergies or current medications.",
    description:
      "A customizable vaccination package covering flu, hepatitis, typhoid, and other recommended vaccines based on age and travel history.",
  },
];

const EMPTY_FORM = {
  name: "",
  category: "Diagnostic",
  icon: "🔬",
  color: COLOR_PRESETS[0],
  duration: "",
  price: "",
  status: "active",
  requirements: "",
  description: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const formatPrice = (p) => `₫${Number(p).toLocaleString()}`;

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ServiceCard
// ─────────────────────────────────────────────────────────────────────────────
const ServiceCard = ({ s, onView, onEdit, onDelete }) => (
  <div className="svc-card">
    {/* Gradient header */}
    <div
      className="svc-card__header"
      style={{
        background: `linear-gradient(135deg, ${s.color.from} 0%, ${s.color.to} 100%)`,
      }}
    >
      <span className="svc-card__icon">{s.icon}</span>
      <h3 className="svc-card__name">{s.name}</h3>
      <span
        className={`svc-card__status-badge ${s.status === "active" ? "st-active" : "st-inactive"}`}
      >
        {s.status === "active" ? <FaCheckCircle /> : <FaTimesCircle />}
        {s.status === "active" ? "Active" : "Inactive"}
      </span>
    </div>

    {/* Body */}
    <div className="svc-card__body">
      {/* Category tag */}
      <div className="svc-card__meta-row">
        <span className="svc-cat-tag">
          {SERVICE_CATEGORIES[s.category]?.icon} {s.category}
        </span>
        <span className="svc-duration">
          <FaClock /> {s.duration} min
        </span>
      </div>

      {/* Description */}
      <p className="svc-card__desc">{s.description}</p>

      {/* Stats row */}
      <div className="svc-card__stats">
        <span className="svc-stat">
          <FaStar className="svc-stat__icon--star" /> {s.rating}
        </span>
        <span className="svc-stat">
          <FaUserMd className="svc-stat__icon" /> {s.usage.toLocaleString()}{" "}
          uses
        </span>
      </div>

      {/* Price */}
      <div className="svc-card__price">{formatPrice(s.price)}</div>

      {/* Actions */}
      <div className="svc-card__actions">
        <button className="svc-btn svc-btn--view" onClick={() => onView(s)}>
          <FaEye /> View
        </button>
        <button className="svc-btn svc-btn--edit" onClick={() => onEdit(s)}>
          <FaEdit /> Edit
        </button>
        <button className="svc-btn svc-btn--delete" onClick={() => onDelete(s)}>
          <FaTrash />
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ServiceFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const ServiceFormModal = ({
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
                <FaListAlt className="me-2" style={{ color: "#0ba3a3" }} />
                {isEdit ? "Edit Service" : "Add New Service"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {/* LEFT: form */}
                <div className="col-md-7">
                  <div className="row g-3">
                    {/* Name */}
                    <div className="col-12">
                      <label className="form-label">Service Name</label>
                      <input
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="e.g. Full Blood Panel"
                      />
                    </div>

                    {/* Category + Status */}
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={form.category}
                        onChange={onChange}
                      >
                        {CAT_NAMES.map((c) => (
                          <option key={c} value={c}>
                            {SERVICE_CATEGORIES[c].icon} {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
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

                    {/* Duration + Price */}
                    <div className="col-md-6">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        className="form-control"
                        name="duration"
                        type="number"
                        min="5"
                        value={form.duration}
                        onChange={onChange}
                        placeholder="30"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price (VND)</label>
                      <input
                        className="form-control"
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={onChange}
                        placeholder="500000"
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
                      <div className="svc-color-picker">
                        {COLOR_PRESETS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            className={`svc-color-swatch ${form.color.name === c.name ? "svc-color-swatch--active" : ""}`}
                            style={{
                              background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                            }}
                            onClick={() => onColorPick(c)}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="col-12">
                      <label className="form-label">
                        Requirements{" "}
                        <small className="text-muted">(before service)</small>
                      </label>
                      <textarea
                        className="form-control"
                        name="requirements"
                        rows={2}
                        value={form.requirements}
                        onChange={onChange}
                        placeholder="e.g. Fasting 8 hours before..."
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={onChange}
                        placeholder="Full description of the service..."
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT: live preview */}
                <div className="col-md-5">
                  <label className="form-label">Preview</label>
                  <div className="svc-preview">
                    <div
                      className="svc-preview__header"
                      style={{
                        background: `linear-gradient(135deg, ${form.color.from} 0%, ${form.color.to} 100%)`,
                      }}
                    >
                      <span className="svc-preview__icon">{form.icon}</span>
                      <p className="svc-preview__name">
                        {form.name || "Service Name"}
                      </p>
                    </div>
                    <div className="svc-preview__body">
                      <div className="svc-preview__meta">
                        <span className="svc-cat-tag">
                          {SERVICE_CATEGORIES[form.category]?.icon}{" "}
                          {form.category}
                        </span>
                        {form.duration && (
                          <span className="svc-duration">
                            <FaClock /> {form.duration} min
                          </span>
                        )}
                      </div>
                      <p className="svc-preview__desc">
                        {form.description || "Description..."}
                      </p>
                      {form.price && (
                        <p className="svc-preview__price">
                          {formatPrice(form.price)}
                        </p>
                      )}
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
                    Save Service
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
// SUB-COMPONENT: ServiceViewModal
// ─────────────────────────────────────────────────────────────────────────────
const ServiceViewModal = ({ s, onEdit, onClose }) => {
  if (!s) return null;
  const docs = MOCK_DOCS[s.name] || [];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Gradient header */}
            <div
              className="svc-view-header"
              style={{
                background: `linear-gradient(135deg, ${s.color.from} 0%, ${s.color.to} 100%)`,
              }}
            >
              <button
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                onClick={onClose}
              />
              <span className="svc-view-header__icon">{s.icon}</span>
              <h4 className="svc-view-header__name">{s.name}</h4>
              <div className="svc-view-header__badges">
                <span
                  className={
                    s.status === "active" ? "st-active" : "st-inactive"
                  }
                >
                  {s.status === "active" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                  {s.status === "active" ? "Active" : "Inactive"}
                </span>
                <span className="svc-view-rating">
                  <FaStar /> {s.rating}
                </span>
              </div>
            </div>

            <div className="modal-body">
              {/* Stats grid */}
              <div className="svc-view-stats">
                {[
                  {
                    icon: FaTag,
                    label: "Category",
                    val: `${SERVICE_CATEGORIES[s.category]?.icon} ${s.category}`,
                  },
                  {
                    icon: FaClock,
                    label: "Duration",
                    val: `${s.duration} minutes`,
                  },
                  {
                    icon: FaMoneyBillWave,
                    label: "Price",
                    val: formatPrice(s.price),
                  },
                  {
                    icon: FaUserMd,
                    label: "Total Uses",
                    val: `${s.usage.toLocaleString()} sessions`,
                  },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="svc-view-stat-item">
                    <Icon className="svc-view-stat-icon" />
                    <div>
                      <p className="svc-view-stat-label">{label}</p>
                      <p className="svc-view-stat-val">{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              {s.requirements && (
                <div className="svc-view-requirements">
                  <p className="svc-view-section-title">
                    <FaShieldAlt className="me-1" /> Requirements
                  </p>
                  <p>{s.requirements}</p>
                </div>
              )}

              {/* Description */}
              <div className="svc-view-description">
                <p className="svc-view-section-title">
                  <FaClipboardList className="me-1" /> Description
                </p>
                <p>{s.description}</p>
              </div>

              {/* Doctors */}
              <div>
                <p className="svc-view-section-title">
                  <FaUserMd className="me-1" /> Doctors Providing This Service
                </p>
                {docs.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: ".82rem" }}>
                    No doctors assigned yet.
                  </p>
                ) : (
                  <div className="svc-view-doc-list">
                    {docs.map((doc, i) => (
                      <div key={i} className="svc-view-doc-item">
                        <img
                          src={doc.img}
                          alt={doc.name}
                          className="svc-view-doc-avatar"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0ba3a3&color=fff`;
                          }}
                        />
                        <div>
                          <p className="svc-view-doc-name">{doc.name}</p>
                          <p className="svc-view-doc-spec">
                            <FaStethoscope /> {doc.spec}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-save" onClick={onEdit}>
                <FaEdit className="me-1" /> Edit Service
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
              <h5 className="delete-title">Delete Service?</h5>
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
export default function AdminServicesPage() {
  const [services, setServices] = useState(INIT_SERVICES);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
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
      category: s.category,
      icon: s.icon,
      color: s.color,
      duration: String(s.duration),
      price: String(s.price),
      status: s.status,
      requirements: s.requirements,
      description: s.description,
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleColorPick = (c) => setForm({ ...form, color: c });
  const handleIconPick = (i) => setForm({ ...form, icon: i });

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const entry = {
      ...form,
      duration: Number(form.duration) || 30,
      price: Number(form.price) || 0,
      rating: selected?.rating ?? 0,
      usage: selected?.usage ?? 0,
    };
    if (modal === "add") {
      setServices((prev) => [...prev, { ...entry, id: Date.now() }]);
    } else {
      setServices((prev) =>
        prev.map((s) => (s.id === selected.id ? { ...s, ...entry } : s)),
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    setServices((prev) => prev.filter((s) => s.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...services];
    if (filterCat !== "all")
      list = list.filter((s) => s.category === filterCat);
    if (filterStat !== "all")
      list = list.filter((s) => s.status === filterStat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "popular") list.sort((a, b) => b.usage - a.usage);
    return list;
  }, [services, filterCat, filterStat, search, sortBy]);

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = services.length;
  const active = services.filter((s) => s.status === "active").length;
  const avgPrice = Math.round(
    services.reduce((sum, s) => sum + s.price, 0) / services.length,
  );
  const mostPop =
    [...services]
      .sort((a, b) => b.usage - a.usage)[0]
      ?.name.split(" ")
      .slice(0, 2)
      .join(" ") || "—";

  return (
    <div className="admin-svc">
      {/* Header */}
      <div className="svc-header">
        <div>
          <h1 className="svc-title">Services Management</h1>
          <p className="svc-sub">
            Manage medical services, pricing, and availability.
          </p>
        </div>
        <div className="svc-header__right">
          <span className="svc-badge">
            <FaListAlt /> {total} services
          </span>
          <button className="btn-add-svc" onClick={openAdd}>
            <FaPlus /> Add Service
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="svc-summary">
        {[
          { label: "Total Services", value: total, cls: "s-teal" },
          { label: "Active", value: active, cls: "s-green" },
          {
            label: "Average Price",
            value: formatPrice(avgPrice),
            cls: "s-navy",
          },
          { label: "Most Popular", value: mostPop, cls: "s-amber" },
        ].map((s) => (
          <div key={s.label} className={`svc-summary__card ${s.cls}`}>
            <p className="svc-summary__value">{s.value}</p>
            <p className="svc-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="svc-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search service name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-select">
          <FaFilter className="toolbar-select__icon" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CAT_NAMES.map((c) => (
              <option key={c} value={c}>
                {SERVICE_CATEGORIES[c].icon} {c}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-select">
          <FaCheckCircle className="toolbar-select__icon" />
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
            <option value="price-asc">Price Low→High</option>
            <option value="price-desc">Price High→Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <p className="svc-count">
        Showing <strong>{filtered.length}</strong> of {total} services
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="svc-empty">
          <FaListAlt className="svc-empty__icon" />
          <p>No services found.</p>
          <span>Try adjusting your search or filters.</span>
        </div>
      ) : (
        <div className="svc-grid">
          {filtered.map((s) => (
            <ServiceCard
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
      <ServiceFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onColorPick={handleColorPick}
        onIconPick={handleIconPick}
        onSave={handleSave}
        onClose={closeModal}
      />
      <ServiceViewModal
        s={modal === "view" ? selected : null}
        onEdit={() => {
          closeModal();
          openEdit(selected);
        }}
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
