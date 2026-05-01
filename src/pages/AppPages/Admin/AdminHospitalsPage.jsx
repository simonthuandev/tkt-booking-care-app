// ─────────────────────────────────────────────────────────────────────────────
// AdminHospitalsPage.jsx  —  Hospitals Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import {
  FaHospital,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaGlobe,
  FaBed,
  FaParking,
  FaWifi,
  FaAmbulance,
  FaExclamationTriangle,
  FaPills,
  FaFlask,
  FaCalendarAlt,
} from "react-icons/fa";
import "./AdminHospitalsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// AMENITIES CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const AMENITIES_CFG = {
  parking: { label: "Parking", icon: FaParking },
  wifi: { label: "Free WiFi", icon: FaWifi },
  emergency: { label: "24h ER", icon: FaAmbulance },
  pharmacy: { label: "Pharmacy", icon: FaPills },
  lab: { label: "Lab", icon: FaFlask },
};

// Mock doctors per hospital
const MOCK_DOCS = {
  "TKT Medical Center": [
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
    {
      name: "Dr. Hoang Van Nam",
      spec: "Pediatrics",
      img: "https://i.pravatar.cc/150?img=57",
    },
  ],
  "City General Hospital": [
    {
      name: "Dr. Le Thi Bich",
      spec: "Neurology",
      img: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Dr. Dang Thi Hoa",
      spec: "Gynecology",
      img: "https://i.pravatar.cc/150?img=44",
    },
  ],
  "Riverside Clinic": [
    {
      name: "Dr. Tran Quoc Hung",
      spec: "Dermatology",
      img: "https://i.pravatar.cc/150?img=15",
    },
    {
      name: "Dr. Vo Thi Lan",
      spec: "Ophthalmology",
      img: "https://i.pravatar.cc/150?img=48",
    },
  ],
  "Children's Care Center": [
    {
      name: "Dr. Hoang Van Nam",
      spec: "Pediatrics",
      img: "https://i.pravatar.cc/150?img=57",
    },
  ],
  "Heart Care Center": [
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
  "Sunrise Medical": [
    {
      name: "Dr. Bui Minh Khoa",
      spec: "Oncology",
      img: "https://i.pravatar.cc/150?img=53",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 6 hospitals
// ─────────────────────────────────────────────────────────────────────────────
const INIT_HOSPITALS = [
  {
    id: 1,
    name: "TKT Medical Center",
    address: "123 Le Loi St, District 1, HCMC",
    district: "District 1",
    phone: "+84 28 3821 1234",
    email: "info@tktmedical.com",
    website: "www.tktmedical.com",
    beds: 250,
    rating: 4.8,
    established: 2005,
    doctors: 34,
    slotFill: 82,
    status: "active",
    coverUrl: "",
    description:
      "TKT Medical Center is a leading multi-specialty hospital providing world-class healthcare services.",
    amenities: ["parking", "wifi", "emergency", "pharmacy", "lab"],
  },
  {
    id: 2,
    name: "City General Hospital",
    address: "456 Nguyen Hue Blvd, District 5, HCMC",
    district: "District 5",
    phone: "+84 28 3822 5678",
    email: "info@cityhospital.com",
    website: "www.cityhospital.com",
    beds: 400,
    rating: 4.6,
    established: 1998,
    doctors: 28,
    slotFill: 75,
    status: "active",
    coverUrl: "",
    description:
      "One of the largest public hospitals in HCMC, serving over 2,000 patients daily.",
    amenities: ["parking", "emergency", "pharmacy", "lab"],
  },
  {
    id: 3,
    name: "Riverside Clinic",
    address: "789 Dien Bien Phu, Binh Thanh, HCMC",
    district: "Binh Thanh",
    phone: "+84 28 3823 9012",
    email: "contact@riverside.com",
    website: "www.riverside.com",
    beds: 120,
    rating: 4.7,
    established: 2012,
    doctors: 18,
    slotFill: 63,
    status: "active",
    coverUrl: "",
    description:
      "A modern private clinic specializing in outpatient care, dermatology and eye care.",
    amenities: ["parking", "wifi", "pharmacy"],
  },
  {
    id: 4,
    name: "Children's Care Center",
    address: "33 Vo Van Tan, District 3, HCMC",
    district: "District 3",
    phone: "+84 28 3824 3456",
    email: "info@childcare.com",
    website: "www.childcare.com",
    beds: 180,
    rating: 4.8,
    established: 2008,
    doctors: 22,
    slotFill: 88,
    status: "active",
    coverUrl: "",
    description:
      "Dedicated pediatric hospital with state-of-the-art facilities for children's healthcare.",
    amenities: ["wifi", "emergency", "pharmacy", "lab"],
  },
  {
    id: 5,
    name: "Heart Care Center",
    address: "101 Cach Mang T8, District 10, HCMC",
    district: "District 10",
    phone: "+84 28 3825 7890",
    email: "info@heartcare.com",
    website: "www.heartcare.com",
    beds: 90,
    rating: 4.9,
    established: 2015,
    doctors: 14,
    slotFill: 91,
    status: "active",
    coverUrl: "",
    description:
      "Specialized cardiac care center offering advanced heart surgery and interventional cardiology.",
    amenities: ["parking", "wifi", "emergency", "pharmacy", "lab"],
  },
  {
    id: 6,
    name: "Sunrise Medical",
    address: "22 Ly Thuong Kiet, District 3, HCMC",
    district: "District 3",
    phone: "+84 28 3826 1234",
    email: "info@sunrise.com",
    website: "www.sunrise.com",
    beds: 60,
    rating: 4.3,
    established: 2020,
    doctors: 8,
    slotFill: 40,
    status: "inactive",
    coverUrl: "",
    description:
      "A newly opened medical center currently undergoing expansion of services.",
    amenities: ["parking", "wifi"],
  },
];

const DISTRICTS = [
  "District 1",
  "District 3",
  "District 5",
  "Binh Thanh",
  "District 10",
];

const EMPTY_FORM = {
  name: "",
  address: "",
  district: "District 1",
  phone: "",
  email: "",
  website: "",
  beds: "",
  status: "active",
  rating: "",
  established: "",
  amenities: [],
  description: "",
  coverUrl: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <span className="hosp-rating">
    <FaStar className="hosp-rating__icon" />
    <span>{rating}</span>
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: HospitalCard
// ─────────────────────────────────────────────────────────────────────────────
const HospitalCard = ({ h, onView, onEdit, onDelete }) => (
  <div className="hosp-card">
    {/* Cover */}
    <div className="hosp-card__cover">
      {h.coverUrl ? (
        <img
          src={h.coverUrl}
          alt={h.name}
          className="hosp-card__cover-img"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="hosp-card__cover-placeholder"
        style={{ display: h.coverUrl ? "none" : "flex" }}
      >
        🏥
      </div>
      <span
        className={`hosp-card__status ${h.status === "active" ? "st-active" : "st-inactive"}`}
      >
        {h.status === "active" ? <FaCheckCircle /> : <FaTimesCircle />}
        {h.status === "active" ? "Active" : "Inactive"}
      </span>
    </div>

    {/* Body */}
    <div className="hosp-card__body">
      {/* Name + rating */}
      <div className="hosp-card__name-row">
        <h3 className="hosp-card__name">{h.name}</h3>
        <StarRating rating={h.rating} />
      </div>

      {/* Address */}
      <p className="hosp-card__address">
        <FaMapMarkerAlt /> {h.address}
      </p>

      {/* Phone + Email */}
      <div className="hosp-card__contact">
        <span>
          <FaPhone /> {h.phone}
        </span>
        <span>
          <FaEnvelope /> <span className="truncate">{h.email}</span>
        </span>
      </div>

      {/* Stats */}
      <div className="hosp-card__stats">
        <div className="hosp-card__stat">
          <FaUserMd />
          <div>
            <p>{h.doctors}</p>
            <span>Doctors</span>
          </div>
        </div>
        <div className="hosp-card__stat">
          <FaBed />
          <div>
            <p>{h.beds}</p>
            <span>Beds</span>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="hosp-card__amenities">
        {h.amenities.slice(0, 4).map((key) => {
          const cfg = AMENITIES_CFG[key];
          if (!cfg) return null;
          const Icon = cfg.icon;
          return (
            <span key={key} className="amenity-pill">
              <Icon /> {cfg.label}
            </span>
          );
        })}
        {h.amenities.length > 4 && (
          <span className="amenity-pill amenity-pill--more">
            +{h.amenities.length - 4}
          </span>
        )}
      </div>

      {/* Slot fill progress */}
      <div className="hosp-card__progress">
        <div className="hosp-card__progress-header">
          <span>Slot Fill Rate</span>
          <span className="hosp-card__progress-pct">{h.slotFill}%</span>
        </div>
        <div className="hosp-card__progress-bar">
          <div style={{ width: `${h.slotFill}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="hosp-card__actions">
        <button className="hosp-btn hosp-btn--view" onClick={() => onView(h)}>
          <FaEye /> View
        </button>
        <button className="hosp-btn hosp-btn--edit" onClick={() => onEdit(h)}>
          <FaEdit /> Edit
        </button>
        <button
          className="hosp-btn hosp-btn--delete"
          onClick={() => onDelete(h)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: HospitalFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const HospitalFormModal = ({
  mode,
  form,
  onChange,
  onAmenityToggle,
  onSave,
  onClose,
}) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaHospital className="me-2" style={{ color: "#0ba3a3" }} />
                {isEdit ? "Edit Hospital" : "Add New Hospital"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                {/* Name */}
                <div className="col-12">
                  <label className="form-label">Hospital Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g. TKT Medical Center"
                  />
                </div>

                {/* Address */}
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

                {/* District + Phone */}
                <div className="col-md-6">
                  <label className="form-label">District / Area</label>
                  <select
                    className="form-select"
                    name="district"
                    value={form.district}
                    onChange={onChange}
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+84 28 3821 1234"
                  />
                </div>

                {/* Email + Website */}
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="info@hospital.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Website</label>
                  <input
                    className="form-control"
                    name="website"
                    value={form.website}
                    onChange={onChange}
                    placeholder="www.hospital.com"
                  />
                </div>

                {/* Beds + Status */}
                <div className="col-md-4">
                  <label className="form-label">Total Beds</label>
                  <input
                    className="form-control"
                    name="beds"
                    type="number"
                    min="0"
                    value={form.beds}
                    onChange={onChange}
                    placeholder="250"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Rating</label>
                  <input
                    className="form-control"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={onChange}
                    placeholder="4.8"
                  />
                </div>
                <div className="col-md-4">
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

                {/* Established + Cover URL */}
                <div className="col-md-4">
                  <label className="form-label">Established Year</label>
                  <input
                    className="form-control"
                    name="established"
                    type="number"
                    value={form.established}
                    onChange={onChange}
                    placeholder="2005"
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label">Cover Image URL</label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      className="form-control"
                      name="coverUrl"
                      value={form.coverUrl}
                      onChange={onChange}
                      placeholder="https://..."
                    />
                    {form.coverUrl && (
                      <img
                        src={form.coverUrl}
                        alt="cover"
                        className="cover-preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Amenities checkboxes */}
                <div className="col-12">
                  <label className="form-label">Amenities</label>
                  <div className="amenity-checkboxes">
                    {Object.entries(AMENITIES_CFG).map(([key, cfg]) => {
                      const Icon = cfg.icon;
                      const checked = form.amenities.includes(key);
                      return (
                        <label
                          key={key}
                          className={`amenity-checkbox ${checked ? "amenity-checkbox--checked" : ""}`}
                          onClick={() => onAmenityToggle(key)}
                        >
                          <Icon /> {cfg.label}
                        </label>
                      );
                    })}
                  </div>
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
                    placeholder="Brief description of the hospital..."
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
                    <FaEdit className="me-1" />
                    Update
                  </>
                ) : (
                  <>
                    <FaPlus className="me-1" />
                    Save Hospital
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
// SUB-COMPONENT: HospitalViewModal
// ─────────────────────────────────────────────────────────────────────────────
const HospitalViewModal = ({ h, onEdit, onClose }) => {
  if (!h) return null;
  const doctors = MOCK_DOCS[h.name] || [];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <button className="btn-close ms-auto" onClick={onClose} />
            </div>

            <div className="modal-body pt-0">
              {/* Cover */}
              <div
                className="view-hosp-cover"
                style={{
                  background:
                    "linear-gradient(135deg, #1a3a5c 0%, #0d2b45 100%)",
                }}
              >
                {h.coverUrl ? (
                  <img
                    src={h.coverUrl}
                    alt={h.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span>🏥</span>
                )}
              </div>

              {/* Name + status + rating */}
              <div className="view-hosp-header">
                <h3 className="view-hosp-name">{h.name}</h3>
                <div className="view-hosp-badges">
                  <span
                    className={
                      h.status === "active" ? "st-active" : "st-inactive"
                    }
                  >
                    {h.status === "active" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                    {h.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <StarRating rating={h.rating} />
                </div>
              </div>

              {/* Info grid 2 cột */}
              <div className="row g-2 mt-2">
                {[
                  { icon: FaMapMarkerAlt, label: "Address", val: h.address },
                  { icon: FaPhone, label: "Phone", val: h.phone },
                  { icon: FaEnvelope, label: "Email", val: h.email },
                  { icon: FaGlobe, label: "Website", val: h.website },
                  { icon: FaBed, label: "Total Beds", val: `${h.beds} beds` },
                  {
                    icon: FaCalendarAlt,
                    label: "Established",
                    val: h.established,
                  },
                  {
                    icon: FaUserMd,
                    label: "Doctors",
                    val: `${h.doctors} on staff`,
                  },
                  { icon: FaStar, label: "Rating", val: `${h.rating} / 5.0` },
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

              {/* Description */}
              {h.description && (
                <div className="view-hosp-desc">
                  <p>{h.description}</p>
                </div>
              )}

              {/* Amenities */}
              <div className="view-hosp-amenities">
                <p className="view-hosp-section-title">Amenities</p>
                <div className="d-flex flex-wrap gap-2">
                  {h.amenities.map((key) => {
                    const cfg = AMENITIES_CFG[key];
                    if (!cfg) return null;
                    const Icon = cfg.icon;
                    return (
                      <span
                        key={key}
                        className="amenity-pill amenity-pill--view"
                      >
                        <Icon /> {cfg.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Slot fill */}
              <div className="view-hosp-slot">
                <div className="view-hosp-slot-header">
                  <p className="view-hosp-section-title">Slot Fill Rate</p>
                  <span className="view-hosp-slot-pct">{h.slotFill}%</span>
                </div>
                <div className="view-hosp-slot-bar">
                  <div style={{ width: `${h.slotFill}%` }} />
                </div>
              </div>

              {/* Doctors */}
              <div className="view-hosp-doctors">
                <p className="view-hosp-section-title">Doctors on Staff</p>
                {doctors.length === 0 ? (
                  <p className="text-muted" style={{ fontSize: ".82rem" }}>
                    No doctors assigned yet.
                  </p>
                ) : (
                  <div className="view-hosp-doc-list">
                    {doctors.map((doc, i) => (
                      <div key={i} className="view-hosp-doc-item">
                        <img
                          src={doc.img}
                          alt={doc.name}
                          className="view-hosp-doc-avatar"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0ba3a3&color=fff`;
                          }}
                        />
                        <div>
                          <p className="view-hosp-doc-name">{doc.name}</p>
                          <p className="view-hosp-doc-spec">
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
                <FaEdit className="me-1" /> Edit Hospital
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Missing import — thêm FaStethoscope
import { FaStethoscope } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DeleteConfirmModal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteConfirmModal = ({ h, onConfirm, onClose }) => {
  if (!h) return null;
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
              <h5 className="delete-title">Delete Hospital?</h5>
              <p className="delete-desc">
                Are you sure you want to delete
                <br />
                <strong>{h.name}</strong>?<br />
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
export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState(INIT_HOSPITALS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [search, setSearch] = useState("");
  const [filterDist, setFilterDist] = useState("all");
  const [filterStat, setFilterStat] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (h) => {
    setForm({
      name: h.name,
      address: h.address,
      district: h.district,
      phone: h.phone,
      email: h.email,
      website: h.website,
      beds: String(h.beds),
      status: h.status,
      rating: String(h.rating),
      established: String(h.established),
      amenities: [...h.amenities],
      description: h.description,
      coverUrl: h.coverUrl,
    });
    setSelected(h);
    setModal("edit");
  };

  const openView = (h) => {
    setSelected(h);
    setModal("view");
  };
  const openDelete = (h) => {
    setSelected(h);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAmenityToggle = (key) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(key)
        ? f.amenities.filter((a) => a !== key)
        : [...f.amenities, key],
    }));
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    const entry = {
      ...form,
      beds: Number(form.beds) || 0,
      rating: Number(form.rating) || 0,
      established: Number(form.established) || 2000,
      doctors: selected?.doctors ?? 0,
      slotFill: selected?.slotFill ?? 0,
    };
    if (modal === "add") {
      setHospitals((prev) => [...prev, { ...entry, id: Date.now() }]);
    } else {
      setHospitals((prev) =>
        prev.map((h) => (h.id === selected.id ? { ...h, ...entry } : h)),
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    setHospitals((prev) => prev.filter((h) => h.id !== selected.id));
    closeModal();
  };

  // ── Filter pipeline ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...hospitals];
    if (filterDist !== "all")
      list = list.filter((h) => h.district === filterDist);
    if (filterStat !== "all")
      list = list.filter((h) => h.status === filterStat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q),
      );
    }
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "doctors") list.sort((a, b) => b.doctors - a.doctors);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newest") list.sort((a, b) => b.established - a.established);
    return list;
  }, [hospitals, filterDist, filterStat, search, sortBy]);

  // ── Summary ───────────────────────────────────────────────────────────────
  const total = hospitals.length;
  const active = hospitals.filter((h) => h.status === "active").length;
  const totalDocs = hospitals.reduce((s, h) => s + h.doctors, 0);
  const avgRating = (
    hospitals.reduce((s, h) => s + h.rating, 0) / hospitals.length
  ).toFixed(1);

  return (
    <div className="admin-hosp">
      {/* Header */}
      <div className="hosp-header">
        <div>
          <h1 className="hosp-title">Hospitals Management</h1>
          <p className="hosp-sub">
            Manage hospital profiles and affiliated doctors.
          </p>
        </div>
        <div className="hosp-header__right">
          <span className="hosp-badge">
            <FaHospital /> {total} hospitals
          </span>
          <button className="btn-add-hosp" onClick={openAdd}>
            <FaPlus /> Add Hospital
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="hosp-summary">
        {[
          { label: "Total Hospitals", value: total, cls: "s-teal" },
          { label: "Active", value: active, cls: "s-green" },
          { label: "Total Doctors", value: totalDocs, cls: "s-navy" },
          { label: "Avg. Rating", value: avgRating, cls: "s-gold" },
        ].map((s) => (
          <div key={s.label} className={`hosp-summary__card ${s.cls}`}>
            <p className="hosp-summary__value">{s.value}</p>
            <p className="hosp-summary__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="hosp-toolbar">
        <div className="toolbar-search">
          <FaSearch className="toolbar-search__icon" />
          <input
            placeholder="Search hospital name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="toolbar-select">
          <FaMapMarkerAlt className="toolbar-select__icon" />
          <select
            value={filterDist}
            onChange={(e) => setFilterDist(e.target.value)}
          >
            <option value="all">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
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
            <option value="rating">Highest Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <p className="hosp-count">
        Showing <strong>{filtered.length}</strong> of {total} hospitals
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="hosp-empty">
          <FaHospital className="hosp-empty__icon" />
          <p>No hospitals found.</p>
          <span>Try adjusting your search or filters.</span>
        </div>
      ) : (
        <div className="hosp-grid">
          {filtered.map((h) => (
            <HospitalCard
              key={h.id}
              h={h}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <HospitalFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onAmenityToggle={handleAmenityToggle}
        onSave={handleSave}
        onClose={closeModal}
      />
      <HospitalViewModal
        h={modal === "view" ? selected : null}
        onEdit={() => {
          closeModal();
          openEdit(selected);
        }}
        onClose={closeModal}
      />
      <DeleteConfirmModal
        h={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
      />
    </div>
  );
}
