// ─────────────────────────────────────────────────────────────────────────────
// AdminDoctorsPage.jsx  —  Doctors Management CRUD
// Bootstrap Modal (React state controlled)
// Align đầy đủ với CreateDoctorDto & UpdateDoctorDto (Admin)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  FaUserMd,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStethoscope,
  FaHospital,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaIdCard,
  FaMoneyBillWave,
  FaTimesCircle,
  FaLock,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./AdminDoctorsPage.scss";
import {
  doctorService,
  hospitalService,
  specialtyService,
} from "../../../api/appService";
import ImageUploadField from "../../../components/Common/ImageUploadField";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import AppPagination from "../../../components/Common/AppPagination";
import WorkingDaysSelector from "../../../components/Common/WorkingDaysSelector";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LIMIT = 12;

// Form state khởi tạo — align với CreateDoctorDto / UpdateDoctorDto
const EMPTY_FORM = {
  // --- User account ---
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  // --- Doctor profile ---
  slug: "",
  imgURL: "",
  licenseNumber: "",
  experience: "",
  consultationFee: "",
  information: [],   // string[]
  treatment: [],     // string[]
  // --- Admin-only flags ---
  isActive: true,
  isUserActive: true,
  isVerified: false,
  // --- Relations ---
  specialtyIds: [],  // string[]  (bắt buộc khi create)
  hospitals: [],     // DoctorHospitalLinkDto[] (bắt buộc khi create)
};

// Hospital link mẫu rỗng
const EMPTY_HOSPITAL_LINK = {
  hospitalId: "",
  workingDays: "",
  startTime: "",
  endTime: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: build payload chuẩn cho API
// ─────────────────────────────────────────────────────────────────────────────
const buildPayload = (form, isEdit = false) => {
  const base = {
    firstName: form.firstName,
    lastName: form.lastName,
    imgURL: form.imgURL || undefined,
    slug: form.slug || undefined,
    licenseNumber: form.licenseNumber || undefined,
    experience: form.experience !== "" ? Number(form.experience) : undefined,
    consultationFee: form.consultationFee !== "" ? Number(form.consultationFee) : undefined,
    information: form.information.filter(Boolean),
    treatment: form.treatment.filter(Boolean),
    // Relations
    specialtyIds: form.specialtyIds.filter(Boolean),
    hospitals: form.hospitals
      .filter((h) => h.hospitalId)
      .map((h) => ({
        hospitalId: h.hospitalId,
        workingDays: h.workingDays || undefined,
        startTime: h.startTime || undefined,
        endTime: h.endTime || undefined,
      })),
  };

  if (isEdit) {
    base.isActive = form.isActive;
    base.isUserActive = form.isUserActive;
    base.isVerified = form.isVerified;
  } else {
    // Create: cần thêm email + password
    base.email = form.email;
    base.password = form.password;
  }

  return base;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DoctorRow
// ─────────────────────────────────────────────────────────────────────────────
const DoctorRow = ({ doc, onView, onEdit, onDelete }) => {
  const fullName = `${doc.user?.lastName ?? ""} ${doc.user?.firstName ?? ""}`.trim();
  const specialty = doc.specialties?.[0]?.specialty?.name ?? "—";
  const hospital = doc.hospitals?.[0]?.hospital?.name ?? "—";

  return (
    <div className="doc-row">
      <div className="doc-row__avatar-wrap">
        {doc.imgURL ? (
          <img src={doc.imgURL} alt={fullName} className="doc-row__avatar" />
        ) : (
          <div className="doc-row__avatar-placeholder"><FaUserMd /></div>
        )}
      </div>

      <div className="doc-row__identity">
        <p className="doc-row__name">BS. {fullName}</p>
        <p className="doc-row__spec">
          <FaStethoscope className="me-1 text-primary" /> {specialty}
        </p>
      </div>

      <div className="doc-row__info">
        <p className="doc-row__hospital text-truncate" title={hospital}>
          <FaHospital className="me-1 text-muted" /> {hospital}
        </p>
        <p className="doc-row__experience text-muted small">
          <FaCalendarAlt className="me-1" /> {doc.experience ?? "—"} năm kinh nghiệm
        </p>
      </div>

      <div className="doc-row__status">
        {doc.isActive ? (
          <span className="doc-status-badge st-active"><FaToggleOn className="me-1" /> Đang hoạt động</span>
        ) : (
          <span className="doc-status-badge st-inactive"><FaToggleOff className="me-1" /> Ngừng hoạt động</span>
        )}
      </div>

      <div className="doc-row__actions">
        <button className="doc-btn doc-btn--view" onClick={() => onView(doc.id)} title="Xem chi tiết">
          <FaEye />
        </button>
        <button className="doc-btn doc-btn--edit" onClick={() => onEdit(doc.id)} title="Sửa bác sĩ">
          <FaEdit />
        </button>
        <button className="doc-btn doc-btn--delete" onClick={() => onDelete(doc)} title="Xóa bác sĩ">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: TagListEditor — nhập/xóa từng item trong string[]
// ─────────────────────────────────────────────────────────────────────────────
const TagListEditor = ({ label, items, onAdd, onRemove, placeholder }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const val = input.trim();
    if (!val) return;
    onAdd(val);
    setInput("");
  };

  return (
    <div className="col-12">
      <label className="form-label">{label}</label>
      <div className="d-flex gap-2 mb-2">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
        />
        <button type="button" className="btn btn-outline-primary btn-sm px-3" onClick={handleAdd}>
          <FaPlus />
        </button>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="badge bg-light text-dark border d-flex align-items-center gap-1 py-2 px-2">
            {item}
            <FaTimesCircle
              className="text-danger ms-1"
              style={{ cursor: "pointer" }}
              onClick={() => onRemove(i)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: HospitalLinkEditor — quản lý mảng DoctorHospitalLinkDto
// ─────────────────────────────────────────────────────────────────────────────
const HospitalLinkEditor = ({ links, hospitals, onAdd, onRemove, onChangeLink }) => {
  return (
    <div className="col-12">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0">Bệnh viện / Phòng khám <span className="text-danger">*</span></label>
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={onAdd}>
          <FaPlus className="me-1" /> Thêm
        </button>
      </div>
      {links.length === 0 && (
        <p className="text-muted small">Chưa có bệnh viện nào. Nhấn "Thêm" để thêm.</p>
      )}
      {links.map((link, i) => (
        <div key={i} className="border rounded p-3 mb-2 bg-light">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold small">Bệnh viện #{i + 1}</span>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemove(i)}>
              <FaTimesCircle />
            </button>
          </div>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label form-label-sm">Chọn bệnh viện <span className="text-danger">*</span></label>
              <select
                className="form-select form-select-sm"
                value={link.hospitalId}
                onChange={(e) => onChangeLink(i, "hospitalId", e.target.value)}
              >
                <option value="">-- Chọn --</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Ngày làm việc</label>
              <WorkingDaysSelector
                value={link.workingDays}
                onChange={(value) => onChangeLink(i, "workingDays", value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Giờ bắt đầu</label>
              <input
                className="form-control form-control-sm"
                type="time"
                value={link.startTime}
                onChange={(e) => onChangeLink(i, "startTime", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label form-label-sm">Giờ kết thúc</label>
              <input
                className="form-control form-control-sm"
                type="time"
                value={link.endTime}
                onChange={(e) => onChangeLink(i, "endTime", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: DoctorFormModal  (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const DoctorFormModal = ({
  mode, form, onChange, onFormChange,
  onSave, onClose, saving,
  specialties, hospitals,
}) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";

  // Handlers cho information[]
  const handleAddInfo = (val) =>
    onFormChange({ ...form, information: [...form.information, val] });
  const handleRemoveInfo = (i) =>
    onFormChange({ ...form, information: form.information.filter((_, idx) => idx !== i) });

  // Handlers cho treatment[]
  const handleAddTreatment = (val) =>
    onFormChange({ ...form, treatment: [...form.treatment, val] });
  const handleRemoveTreatment = (i) =>
    onFormChange({ ...form, treatment: form.treatment.filter((_, idx) => idx !== i) });

  // Handlers cho specialtyIds[]
  const handleToggleSpecialty = (id) => {
    const ids = form.specialtyIds.includes(id)
      ? form.specialtyIds.filter((s) => s !== id)
      : [...form.specialtyIds, id];
    onFormChange({ ...form, specialtyIds: ids });
  };

  // Handlers cho hospitals[]
  const handleAddHospital = () =>
    onFormChange({ ...form, hospitals: [...form.hospitals, { ...EMPTY_HOSPITAL_LINK }] });
  const handleRemoveHospital = (i) =>
    onFormChange({ ...form, hospitals: form.hospitals.filter((_, idx) => idx !== i) });
  const handleChangeHospitalLink = (i, field, val) => {
    const updated = form.hospitals.map((h, idx) =>
      idx === i ? { ...h, [field]: val } : h
    );
    onFormChange({ ...form, hospitals: updated });
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <FaUserMd className="me-2 text-primary" />
                {isEdit ? "Chỉnh sửa Bác sĩ" : "Thêm Bác sĩ mới"}
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row g-3">

                {/* ── SECTION: Tài khoản ───────────────────── */}
                <div className="col-12 doctor-form-section-title-wrap doctor-form-section-title-wrap--first">
                  <p className="form-section-title">
                    <FaEnvelope className="me-2 text-primary" />
                    Thông tin tài khoản
                  </p>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Họ (Last Name) <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="Nguyễn"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Tên (First Name) <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="Văn An"
                  />
                </div>

                {/* Email & Password chỉ hiện khi ADD */}
                {!isEdit && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="bacsi@email.com"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        <FaLock className="me-1" />
                        Mật khẩu <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        placeholder="Tối thiểu 8 ký tự, chữ hoa, số, ký tự đặc biệt"
                      />
                    </div>
                  </>
                )}

                {/* ── SECTION: Hồ sơ bác sĩ ───────────────── */}
                <div className="col-12 doctor-form-section-title-wrap">
                  <p className="form-section-title">
                    <FaIdCard className="me-2 text-primary" />
                    Hồ sơ bác sĩ
                  </p>
                </div>

                <div className="col-md-6">
                  <ImageUploadField
                    label="Ảnh đại diện bác sĩ (imgURL)"
                    value={form.imgURL}
                    uploadType="doctors"
                    onChange={(imgURL) => onFormChange({ ...form, imgURL })}
                    disabled={saving}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Slug</label>
                  <input
                    className="form-control"
                    name="slug"
                    value={form.slug}
                    onChange={onChange}
                    placeholder="nguyen-van-an"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <FaIdCard className="me-1" /> Số giấy phép hành nghề
                  </label>
                  <input
                    className="form-control"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={onChange}
                    placeholder="GP-123456"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <FaCalendarAlt className="me-1" /> Số năm kinh nghiệm
                  </label>
                  <input
                    className="form-control"
                    name="experience"
                    type="number"
                    min="0"
                    max="60"
                    value={form.experience}
                    onChange={onChange}
                    placeholder="VD: 10"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    <FaMoneyBillWave className="me-1" /> Phí tư vấn (VND)
                  </label>
                  <input
                    className="form-control"
                    name="consultationFee"
                    type="number"
                    min="0"
                    value={form.consultationFee}
                    onChange={onChange}
                    placeholder="VD: 500000"
                  />
                </div>

                {/* Information[] */}
                <TagListEditor
                  label="Thông tin giới thiệu (information)"
                  items={form.information}
                  onAdd={handleAddInfo}
                  onRemove={handleRemoveInfo}
                  placeholder="Nhập một dòng giới thiệu rồi nhấn Enter hoặc +"
                />

                {/* Treatment[] */}
                <TagListEditor
                  label="Phương pháp điều trị (treatment)"
                  items={form.treatment}
                  onAdd={handleAddTreatment}
                  onRemove={handleRemoveTreatment}
                  placeholder="Nhập phương pháp điều trị rồi nhấn Enter hoặc +"
                />

                {/* ── SECTION: Admin flags ─────────────────── */}
                {isEdit && (
                  <>
                    <div className="col-12 doctor-form-section-title-wrap">
                      <p className="form-section-title">
                        <FaToggleOn className="me-2 text-primary" />
                        Trạng thái (Admin)
                      </p>
                    </div>

                    <div className="col-md-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="chk-isActive"
                          checked={form.isActive}
                          onChange={(e) => onFormChange({ ...form, isActive: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="chk-isActive">
                          Hồ sơ đang hoạt động (isActive)
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="chk-isUserActive"
                          checked={form.isUserActive}
                          onChange={(e) => onFormChange({ ...form, isUserActive: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="chk-isUserActive">
                          Tài khoản kích hoạt (isUserActive)
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="chk-isVerified"
                          checked={form.isVerified}
                          onChange={(e) => onFormChange({ ...form, isVerified: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="chk-isVerified">
                          Đã xác thực (isVerified)
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* ── SECTION: Chuyên khoa ─────────────────── */}
                <div className="col-12 doctor-form-section-title-wrap">
                  <p className="form-section-title">
                    <FaStethoscope className="me-2 text-primary" />
                    Chuyên khoa <span className="text-danger">*</span>
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {specialties.map((s) => {
                      const checked = form.specialtyIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={`btn btn-sm ${checked ? "btn-primary" : "btn-outline-secondary"}`}
                          onClick={() => handleToggleSpecialty(s.id)}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                    {specialties.length === 0 && (
                      <span className="text-muted small">Đang tải chuyên khoa...</span>
                    )}
                  </div>
                </div>

                {/* ── SECTION: Bệnh viện ───────────────────── */}
                <div className="col-12 doctor-form-section-title-wrap">
                  <p className="form-section-title">
                    <FaHospital className="me-2 text-primary" />
                    Lịch làm việc tại bệnh viện
                  </p>
                </div>

                <HospitalLinkEditor
                  links={form.hospitals}
                  hospitals={hospitals}
                  onAdd={handleAddHospital}
                  onRemove={handleRemoveHospital}
                  onChangeLink={handleChangeHospitalLink}
                />

              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose} disabled={saving}>
                Hủy
              </button>
              <button className="btn btn-save" onClick={onSave} disabled={saving}>
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-1" />
                ) : isEdit ? (
                  <FaEdit className="me-1" />
                ) : (
                  <FaPlus className="me-1" />
                )}
                {isEdit ? "Cập nhật" : "Lưu bác sĩ"}
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

  const fullName = `${doc.user?.lastName ?? ""} ${doc.user?.firstName ?? ""}`.trim();
  const specialtyNames = doc.specialties?.map((s) => s.specialty?.name).filter(Boolean).join(", ") || "—";
  const hospitalList = doc.hospitals ?? [];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Hồ sơ Bác sĩ</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {/* Avatar + tên */}
              <div className="view-header">
                {doc.imgURL ? (
                  <img src={doc.imgURL} alt={fullName} className="view-avatar" />
                ) : (
                  <div className="view-avatar d-flex align-items-center justify-content-center bg-light text-primary">
                    <FaUserMd size={30} />
                  </div>
                )}
                <div>
                  <h4 className="view-name">BS. {fullName}</h4>
                  <p className="view-spec">
                    <FaStethoscope className="me-1" />
                    {specialtyNames}
                  </p>
                  <div className="d-flex gap-2 flex-wrap mt-1">
                    <span className={`badge ${doc.isActive ? "bg-success" : "bg-secondary"}`}>
                      {doc.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                    <span className={`badge ${doc.isVerified ? "bg-info text-dark" : "bg-warning text-dark"}`}>
                      {doc.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                    </span>
                    <span className={`badge ${doc.user?.isActive !== false ? "bg-success" : "bg-danger"}`}>
                      TK: {doc.user?.isActive !== false ? "Kích hoạt" : "Bị khóa"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="row g-2 mt-3">
                {[
                  { icon: FaPhone, label: "Slug", val: doc.slug ?? "—" },
                  { icon: FaEnvelope, label: "Email", val: doc.user?.email ?? "—" },
                  { icon: FaIdCard, label: "Số GPHN", val: doc.licenseNumber ?? "—" },
                  { icon: FaCalendarAlt, label: "Kinh nghiệm", val: doc.experience != null ? `${doc.experience} năm` : "—" },
                  { icon: FaStar, label: "Đánh giá", val: doc.rating ?? "Chưa có" },
                  { icon: FaMoneyBillWave, label: "Phí tư vấn", val: `₫${Number(doc.consultationFee || 0).toLocaleString()}` },
                ].map((item) => {
                  const InfoIcon = item.icon;

                  return (
                    <div key={item.label} className="col-md-6">
                      <div className="view-info-item">
                        <InfoIcon className="view-info-icon" />
                        <div>
                          <p className="view-info-label">{item.label}</p>
                          <p className="view-info-val">{item.val}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Information */}
              {doc.information?.length > 0 && (
                <div className="view-bio mt-3">
                  <p className="view-bio__title">Giới thiệu</p>
                  <ul className="mb-0">
                    {doc.information.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {/* Treatment */}
              {doc.treatment?.length > 0 && (
                <div className="view-bio mt-2">
                  <p className="view-bio__title">Phương pháp điều trị</p>
                  <ul className="mb-0">
                    {doc.treatment.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}

              {/* Hospital list */}
              {hospitalList.length > 0 && (
                <div className="view-appts mt-3">
                  <p className="view-appts__title">
                    <FaHospital className="me-1" /> Lịch làm việc
                  </p>
                  {hospitalList.map((h, i) => (
                    <div key={i} className="view-appt-row">
                      <div className="view-appt-info">
                        <p className="view-appt-patient">{h.hospital?.name ?? "—"}</p>
                        <p className="view-appt-type">
                          {h.workingDays || "—"} &nbsp;·&nbsp;
                          {h.startTime || "?"} – {h.endTime || "?"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>Đóng</button>
              <button className="btn btn-save" onClick={onEdit}>
                <FaEdit className="me-1" /> Chỉnh sửa
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
const DeleteConfirmModal = ({ doc, onConfirm, onClose, deleting }) => {
  if (!doc) return null;
  const fullName = `${doc.user?.lastName ?? ""} ${doc.user?.firstName ?? ""}`.trim();
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
              <h5 className="delete-title">Xóa bác sĩ?</h5>
              <p className="delete-desc">
                Bạn có chắc muốn xóa
                <br />
                <strong>BS. {fullName}</strong>?
                <br />
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="modal-footer justify-content-center gap-2 border-0 pt-0 pb-4">
              <button className="btn btn-light border px-4" onClick={onClose} disabled={deleting}>
                Hủy
              </button>
              <button className="btn btn-danger px-4" onClick={onConfirm} disabled={deleting}>
                {deleting
                  ? <span className="spinner-border spinner-border-sm me-1" />
                  : <FaTrash className="me-1" />
                }
                Xóa
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
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [modal, setModal] = useState(null); // "add"|"edit"|"view"|"delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterSpecialtyId, setFilterSpecialtyId] = useState("");
  const [filterHospitalId, setFilterHospitalId] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterVerified, setFilterVerified] = useState("");

  // ── Fetch options (chạy 1 lần) ───────────────────────────────────────────
  useEffect(() => {
    specialtyService
      .specialties({ limit: 50 })
      .then((res) => setSpecialties(res.data?.data ?? []))
      .catch((err) => console.error("Lỗi tải chuyên khoa:", err));

    hospitalService
      .hospitals({ limit: 50 })
      .then((res) => setHospitals(res.data?.data ?? []))
      .catch((err) => console.error("Lỗi tải bệnh viện:", err));
  }, []);

  // ── Fetch danh sách bác sĩ ───────────────────────────────────────────────
  const fetchDoctors = useCallback((page) => {
    setIsLoading(true);
    setError(null);
    const params = {
      page: page + 1,
      limit: PAGE_LIMIT,
      ...(search.trim() && { search: search.trim() }),
      ...(filterSpecialtyId && { specialtyId: filterSpecialtyId }),
      ...(filterHospitalId && { hospitalId: filterHospitalId }),
      ...(filterActive !== "" && { isActive: filterActive }),
      ...(filterVerified !== "" && { isVerified: filterVerified }),
    };

    doctorService
      .adminGetDoctors(params)
      .then((res) => {
        setDoctors(res.data?.data ?? []);
        setMeta(res.data?.meta ?? {});
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bác sĩ:", err);
        setError("Không thể tải danh sách bác sĩ.");
      })
      .finally(() => setIsLoading(false));
  }, [filterActive, filterHospitalId, filterSpecialtyId, filterVerified, search]);

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage, fetchDoctors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearch(searchInput);
  };

  // ── Helpers map doc detail → form state ──────────────────────────────────
  const docToForm = (doc) => ({
    email: doc.user?.email ?? "",
    password: "",                              // không map lại password
    firstName: doc.user?.firstName ?? "",
    lastName: doc.user?.lastName ?? "",
    slug: doc.slug ?? "",
    imgURL: doc.imgURL ?? "",
    licenseNumber: doc.licenseNumber ?? "",
    experience: doc.experience != null ? String(doc.experience) : "",
    consultationFee: doc.consultationFee != null ? String(doc.consultationFee) : "",
    information: doc.information ?? [],
    treatment: doc.treatment ?? [],
    isActive: doc.isActive ?? true,
    isUserActive: doc.user?.isActive ?? true,
    isVerified: doc.isVerified ?? false,
    specialtyIds: doc.specialties?.map((s) => s.specialty?.id ?? s.specialtyId).filter(Boolean) ?? [],
    hospitals: doc.hospitals?.map((h) => ({
      hospitalId: h.hospital?.id ?? h.hospitalId ?? "",
      workingDays: h.workingDays ?? "",
      startTime: h.startTime ?? "",
      endTime: h.endTime ?? "",
    })) ?? [],
  });

  // ── Modal openers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = async (id) => {
    try {
      const res = await doctorService.adminGetDoctorDetail(id);
      const doc = res.data?.data ?? {};
      setForm(docToForm(doc));
      setSelected(doc);
      setModal("edit");
    } catch (err) {
      console.error("Lỗi lấy chi tiết bác sĩ:", err);
      toast.error("Không thể tải thông tin bác sĩ.");
    }
  };

  const openView = async (id) => {
    try {
      const res = await doctorService.adminGetDoctorDetail(id);
      setSelected(res.data?.data ?? {});
      setModal("view");
    } catch (err) {
      console.error("Lỗi lấy chi tiết bác sĩ:", err);
      toast.error("Không thể tải thông tin bác sĩ.");
    }
  };

  const openDelete = (doc) => {
    setSelected(doc);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  // ── Form handlers ─────────────────────────────────────────────────────────
  // onChange cho input/select thông thường
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // onFormChange cho các update phức tạp (array, boolean)
  const handleFormChange = (newForm) => setForm(newForm);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const isEdit = modal === "edit";
    const payload = buildPayload(form, isEdit);

    setSaving(true);
    try {
      if (!isEdit) {
        await doctorService.adminCreateDoctor(payload);
      } else {
        await doctorService.adminUpdateDoctor(selected.id, payload);
      }
      closeModal();
      fetchDoctors(currentPage);
    } catch (err) {
      console.error("Lỗi lưu bác sĩ:", err);
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await doctorService.adminDeleteDoctor(selected.id);
      closeModal();
      const isLastItem = doctors.length === 1 && currentPage > 0;
      if (isLastItem) setCurrentPage((p) => p - 1);
      else fetchDoctors(currentPage);
    } catch (err) {
      console.error("Lỗi xóa bác sĩ:", err);
      toast.error(err?.response?.data?.message ?? "Không thể xóa, vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = ({ selected: page }) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="admin-docs">
      {/* Header */}
      <div className="docs-header">
        <div>
          <h1 className="docs-title">Quản lý Bác sĩ</h1>
          <p className="docs-sub">Quản lý hồ sơ và thông tin bác sĩ.</p>
        </div>
        <div className="docs-header__right">
          <span className="docs-total-badge">
            <FaUserMd /> {meta.total ?? 0} bác sĩ
          </span>
          <button className="btn-add-doc" onClick={openAdd}>
            <FaPlus /> Thêm bác sĩ
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-xl-3">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <input
                className="form-control"
                placeholder="Tìm tên hoặc email bác sĩ..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Tìm</button>
            </form>
          </div>
          <div className="col-12 col-md-6 col-xl-2">
            <select
              className="form-select"
              value={filterSpecialtyId}
              onChange={(e) => {
                setFilterSpecialtyId(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả chuyên khoa</option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 col-xl-2">
            <select
              className="form-select"
              value={filterHospitalId}
              onChange={(e) => {
                setFilterHospitalId(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả cơ sở</option>
              {hospitals.map((hosp) => (
                <option key={hosp.id} value={hosp.id}>{hosp.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <select
              className="form-select"
              value={filterActive}
              onChange={(e) => {
                setFilterActive(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả hoạt động</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <select
              className="form-select"
              value={filterVerified}
              onChange={(e) => {
                setFilterVerified(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả xác thực</option>
              <option value="true">Đã xác thực</option>
              <option value="false">Chưa xác thực</option>
            </select>
          </div>
          {(search || filterSpecialtyId || filterHospitalId || filterActive || filterVerified) && (
            <div className="col-12 col-md-4 col-xl-1">
              <button
                className="btn btn-light border w-100"
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setFilterSpecialtyId("");
                  setFilterHospitalId("");
                  setFilterActive("");
                  setFilterVerified("");
                  setCurrentPage(0);
                }}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : doctors.length === 0 ? (
        <div className="docs-empty">
          <FaUserMd className="docs-empty__icon" />
          <p>Không tìm thấy bác sĩ nào</p>
        </div>
      ) : (
        <div className="docs-list">
          {doctors.map((doc) => (
            <DoctorRow
              key={doc.id}
              doc={doc}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      <AppPagination
        pageCount={meta.totalPages ?? 1}
        currentPage={currentPage}
        total={meta.total}
        itemLabel="bác sĩ"
        onPageChange={(selected) => handlePageChange({ selected })}
      />

      {/* ── Modals ── */}
      <DoctorFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onClose={closeModal}
        saving={saving}
        specialties={specialties}
        hospitals={hospitals}
      />

      <DoctorViewModal
        doc={modal === "view" ? selected : null}
        onEdit={() => { closeModal(); openEdit(selected?.id); }}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        doc={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
        deleting={deleting}
      />
    </div>
  );
}
