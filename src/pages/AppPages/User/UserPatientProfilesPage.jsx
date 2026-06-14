import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaTransgender,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaIdCard
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./UserPatientProfilesPage.scss";
import { patientProfileService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const GENDER_MAP = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

const RELATIONSHIP_MAP = {
  self: "Bản thân",
  parent: "Bố/Mẹ",
  child: "Con cái",
  spouse: "Vợ/Chồng",
  sibling: "Anh/Chị/Em",
  other: "Khác",
};

const EMPTY_FORM = {
  fullName: "",
  dob: "",
  gender: "",
  phoneNumber: "",
  address: "",
  relationship: "self",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ProfileFormModal (Add / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const ProfileFormModal = ({
  mode,
  form,
  onChange,
  onSave,
  onClose,
  saving,
}) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";

  return (
    <>
      <div className="modal-backdrop fade show" onClick={!saving ? onClose : undefined} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? (
                  <><FaEdit className="me-2 text-primary" /> Chỉnh sửa Hồ sơ</>
                ) : (
                  <><FaPlus className="me-2 text-primary" /> Thêm Hồ sơ mới</>
                )}
              </h5>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">
                    Họ và Tên <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    name="fullName"
                    value={form.fullName}
                    onChange={onChange}
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    className="form-control"
                    name="dob"
                    type="date"
                    value={form.dob ? form.dob.substring(0, 10) : ""}
                    onChange={onChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={form.gender || ""}
                    onChange={onChange}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    className="form-control"
                    name="phoneNumber"
                    value={form.phoneNumber || ""}
                    onChange={onChange}
                    placeholder="VD: 0912345678"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Mối quan hệ</label>
                  <select
                    className="form-select"
                    name="relationship"
                    value={form.relationship || "self"}
                    onChange={onChange}
                  >
                    <option value="self">Bản thân</option>
                    <option value="parent">Bố/Mẹ</option>
                    <option value="child">Con cái</option>
                    <option value="spouse">Vợ/Chồng</option>
                    <option value="sibling">Anh/Chị/Em</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Địa chỉ</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="2"
                    value={form.address || ""}
                    onChange={onChange}
                    placeholder="Địa chỉ liên hệ..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose} disabled={saving}>
                Hủy
              </button>
              <button className="btn btn-primary btn-save-profile" onClick={onSave} disabled={saving}>
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : isEdit ? (
                  <FaEdit className="me-2" />
                ) : (
                  <FaPlus className="me-2" />
                )}
                {isEdit ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ProfileViewModal
// ─────────────────────────────────────────────────────────────────────────────
const ProfileViewModal = ({ profile, onEdit, onClose }) => {
  if (!profile) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content profile-modal">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaIdCard className="me-2 text-primary" /> Chi tiết Hồ sơ
              </h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body p-4">
              <div className="text-center mb-4">
                <div className="view-avatar-placeholder mx-auto mb-3">
                  <FaUsers size={40} className="text-primary" />
                </div>
                <h4 className="fw-bold mb-1">{profile.fullName}</h4>
                <span className={`badge rounded-pill ${profile.isDefault ? "bg-success" : "bg-secondary"}`}>
                  {profile.isDefault ? "Hồ sơ Mặc định" : "Hồ sơ Phụ"}
                </span>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="profile-info-item">
                    <FaCalendarAlt className="info-icon" />
                    <div>
                      <small className="text-muted d-block">Ngày sinh</small>
                      <strong>{profile.dob ? new Date(profile.dob).toLocaleDateString("vi-VN") : "—"}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="profile-info-item">
                    <FaTransgender className="info-icon" />
                    <div>
                      <small className="text-muted d-block">Giới tính</small>
                      <strong>{profile.gender ? GENDER_MAP[profile.gender] : "—"}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="profile-info-item">
                    <FaPhone className="info-icon" />
                    <div>
                      <small className="text-muted d-block">Số điện thoại</small>
                      <strong>{profile.phoneNumber || "—"}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="profile-info-item">
                    <FaUsers className="info-icon" />
                    <div>
                      <small className="text-muted d-block">Mối quan hệ</small>
                      <strong>{RELATIONSHIP_MAP[profile.relationship] || "—"}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="profile-info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div>
                      <small className="text-muted d-block">Địa chỉ</small>
                      <strong>{profile.address || "—"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-light border" onClick={onClose}>Đóng</button>
              <button className="btn btn-primary" onClick={onEdit}>
                <FaEdit className="me-2" /> Chỉnh sửa
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
const DeleteConfirmModal = ({ profile, onConfirm, onClose, deleting }) => {
  if (!profile) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={!deleting ? onClose : undefined} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              <div className="text-danger mb-3">
                <FaTimesCircle size={50} />
              </div>
              <h5 className="mb-3">Xóa hồ sơ?</h5>
              <p className="text-muted small mb-4">
                Bạn có chắc chắn muốn xóa hồ sơ của <strong>{profile.fullName}</strong>? Hành động này không thể hoàn tác.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-light border px-4" onClick={onClose} disabled={deleting}>
                  Hủy
                </button>
                <button className="btn btn-danger px-4" onClick={onConfirm} disabled={deleting}>
                  {deleting ? <span className="spinner-border spinner-border-sm" /> : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UserPatientProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modal states
  const [formMode, setFormMode] = useState(null); // 'add' | 'edit' | null
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const [viewProfile, setViewProfile] = useState(null);
  
  const [deleteProfile, setDeleteProfile] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch data
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await patientProfileService.getProfiles();
      // Assume res.data is the wrapper and res.data.data is the array, 
      // or res.data is the array directly based on axios setup
      const data = res.data?.data || res.data || [];
      setProfiles(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hồ sơ:", error);
      setErrorMsg("Không thể tải danh sách hồ sơ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    setFormData({ ...EMPTY_FORM });
    setFormMode("add");
  };

  const openEdit = (profile) => {
    setFormData({
      id: profile.id,
      fullName: profile.fullName || "",
      dob: profile.dob || "",
      gender: profile.gender || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      relationship: profile.relationship || "self",
    });
    setFormMode("edit");
    setViewProfile(null);
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      toast.warning("Vui lòng nhập Họ và Tên");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        fullName: formData.fullName,
        dob: formData.dob || undefined,
        gender: formData.gender || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
        relationship: formData.relationship || undefined,
      };

      if (formMode === "add") {
        await patientProfileService.createProfile(payload);
        toast.success("Tạo hồ sơ thành công!");
      } else {
        await patientProfileService.updateProfile(formData.id, payload);
        toast.success("Cập nhật hồ sơ thành công!");
      }
      
      setFormMode(null);
      fetchProfiles();
    } catch (err) {
      console.error("Lỗi lưu hồ sơ:", err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi lưu hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await patientProfileService.deleteProfile(deleteProfile.id);
      toast.success("Xóa hồ sơ thành công!");
      setDeleteProfile(null);
      fetchProfiles();
    } catch (err) {
      console.error("Lỗi xóa hồ sơ:", err);
      toast.error(err.response?.data?.message || "Không thể xóa hồ sơ lúc này.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await patientProfileService.setDefaultProfile(id);
      toast.success("Đã đặt làm hồ sơ mặc định!");
      fetchProfiles();
    } catch (err) {
      console.error("Lỗi set default:", err);
      toast.error(err.response?.data?.message || "Không thể đặt mặc định lúc này.");
    }
  };

  // Render
  return (
    <div className="patient-profiles-page">
      <div className="patient-profiles-header">
        <div>
          <h2 className="page-title">Hồ sơ bệnh nhân</h2>
          <p className="page-sub">Quản lý hồ sơ khám bệnh của bạn và người thân (tối đa 5 hồ sơ).</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2" 
          onClick={openAdd}
          disabled={profiles.length >= 5}
          title={profiles.length >= 5 ? "Bạn đã đạt giới hạn 5 hồ sơ" : ""}
        >
          <FaPlus /> Thêm hồ sơ
        </button>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : profiles.length === 0 ? (
        <div className="empty-state text-center py-5">
          <div className="empty-icon mb-3">
            <FaUsers size={60} className="text-muted opacity-50" />
          </div>
          <h5>Chưa có hồ sơ nào</h5>
          <p className="text-muted">Vui lòng thêm hồ sơ để dễ dàng đặt lịch khám.</p>
          <button className="btn btn-outline-primary mt-2" onClick={openAdd}>
            <FaPlus className="me-2" /> Thêm hồ sơ ngay
          </button>
        </div>
      ) : (
        <div className="table-responsive profiles-table-wrapper shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Họ và Tên</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Mối quan hệ</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="fw-semibold">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-circle">
                        <FaUsers className="text-primary opacity-75" />
                      </div>
                      {p.fullName}
                    </div>
                  </td>
                  <td>{p.dob ? new Date(p.dob).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>{p.gender ? GENDER_MAP[p.gender] : "—"}</td>
                  <td>{p.phoneNumber || "—"}</td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {RELATIONSHIP_MAP[p.relationship] || "—"}
                    </span>
                  </td>
                  <td className="text-center">
                    {p.isDefault ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                        <FaStar className="me-1 mb-1" /> Mặc định
                      </span>
                    ) : (
                      <button 
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() => handleSetDefault(p.id)}
                        title="Đặt làm hồ sơ mặc định"
                      >
                        Đặt mặc định
                      </button>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="action-buttons d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-light" onClick={() => setViewProfile(p)} title="Xem chi tiết">
                        <FaEye className="text-primary" />
                      </button>
                      <button className="btn btn-sm btn-light" onClick={() => openEdit(p)} title="Chỉnh sửa">
                        <FaEdit className="text-warning" />
                      </button>
                      <button 
                        className="btn btn-sm btn-light" 
                        onClick={() => setDeleteProfile(p)} 
                        title="Xóa hồ sơ"
                        disabled={p.isDefault && profiles.length === 1}
                      >
                        <FaTrash className={p.isDefault && profiles.length === 1 ? "text-muted" : "text-danger"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ProfileFormModal
        mode={formMode}
        form={formData}
        onChange={handleFormChange}
        onSave={handleSave}
        onClose={() => setFormMode(null)}
        saving={saving}
      />

      <ProfileViewModal
        profile={viewProfile}
        onEdit={() => openEdit(viewProfile)}
        onClose={() => setViewProfile(null)}
      />

      <DeleteConfirmModal
        profile={deleteProfile}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteProfile(null)}
        deleting={deleting}
      />
    </div>
  );
}
