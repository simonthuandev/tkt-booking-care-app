// ─────────────────────────────────────────────────────────────────────────────
// AdminHospitalsPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import {
  FaHospital,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaCity
} from "react-icons/fa";
import "./AdminHospitalsPage.scss";
import { hospitalService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LIMIT = 12;

const EMPTY_FORM = {
  name: "",
  slug: "",
  address: "",
  city: "",
  type: "public",
  imgURL: "",
  description: "",
  isActive: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────
const buildPayload = (form, isEdit = false) => {
  const base = {
    name: form.name?.trim(),
    slug: form.slug?.trim() || undefined,
    address: form.address?.trim(),
    city: form.city?.trim(),
    type: form.type,
    imgURL: form.imgURL?.trim() || undefined,
    description: form.description?.trim() || undefined,
  };
  
  if (isEdit) {
    base.isActive = form.isActive;
  }
  return base;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const HospitalCard = ({ hosp, onView, onEdit, onDelete }) => {
  return (
    <div className="hosp-card">
      <div className="hosp-card__cover-wrap">
        {hosp.imgURL ? (
          <img src={hosp.imgURL} alt={hosp.name} className="hosp-card__cover" />
        ) : (
          <FaHospital size={48} className="text-secondary opacity-50" />
        )}
      </div>

      <div>
        <h3 className="hosp-card__name">{hosp.name}</h3>
        <p className="hosp-card__address"><FaMapMarkerAlt className="me-1"/>{hosp.address || "Chưa có địa chỉ"}</p>
        <div className="hosp-card__badges">
          <span className={`badge ${hosp.isActive ? "badge-active" : "badge-inactive"}`}>
            {hosp.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
          </span>
          <span className="badge badge-type">
            {hosp.type === "private" ? "Tư nhân" : "Công lập"}
          </span>
        </div>
      </div>

      <div className="hosp-card__info">
        <div className="hosp-card__info-item">
          <FaCity /> {hosp.city || "Chưa có TP"}
        </div>
      </div>

      <div className="hosp-card__actions">
        <button className="hosp-btn hosp-btn--view" onClick={() => onView(hosp)}>
          <FaEye /> View
        </button>
        <button className="hosp-btn hosp-btn--edit" onClick={() => onEdit(hosp)}>
          <FaEdit /> Edit
        </button>
        <button className="hosp-btn hosp-btn--delete" onClick={() => onDelete(hosp)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const HospitalFormModal = ({
  mode, form, onChange, onFormChange, onSave, onClose, saving
}) => {
  if (mode !== "add" && mode !== "edit") return null;
  const isEdit = mode === "edit";

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light border-bottom-0 pb-0">
              <h5 className="modal-title fs-4 fw-bold">
                {isEdit ? <><FaEdit className="me-2 text-primary" /> Sửa Bệnh viện</> : <><FaPlus className="me-2 text-primary" /> Thêm Bệnh viện</>}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên bệnh viện <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={onChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Slug (tùy chọn)</label>
                  <input type="text" className="form-control" name="slug" value={form.slug} onChange={onChange} placeholder="tu-sinh-khi-de-trong" />
                </div>

                <div className="col-md-12">
                  <label className="form-label">Địa chỉ cụ thể <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="address" value={form.address} onChange={onChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Thành phố <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="city" value={form.city} onChange={onChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Loại bệnh viện</label>
                  <select className="form-select" name="type" value={form.type} onChange={onChange}>
                    <option value="public">Công lập (Public)</option>
                    <option value="private">Tư nhân (Private)</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Hình ảnh minh họa (URL)</label>
                  <div className="d-flex gap-2">
                    {form.imgURL && <img src={form.imgURL} alt="Preview" className="avatar-preview rounded" style={{width: 36, height: 36, objectFit: "cover"}} />}
                    <input type="text" className="form-control" name="imgURL" value={form.imgURL} onChange={onChange} placeholder="https://..." />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Mô tả chi tiết (Tối đa 2000 ký tự)</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={onChange} rows="4" />
                </div>

                {isEdit && (
                  <div className="col-12">
                    <div className="form-check form-switch py-2 border rounded bg-light">
                      <input
                        className="form-check-input ms-2 me-3"
                        type="checkbox"
                        role="switch"
                        id="isActiveSwitch"
                        checked={form.isActive}
                        onChange={(e) => onFormChange({ ...form, isActive: e.target.checked })}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="isActiveSwitch">
                        Trạng thái hoạt động
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0 bg-light">
              <button className="btn btn-secondary px-4" onClick={onClose} disabled={saving}>Hủy</button>
              <button className="btn btn-primary px-4 btn-save" onClick={onSave} disabled={saving}>
                {saving ? <span className="spinner-border spinner-border-sm"></span> : isEdit ? "Lưu thay đổi" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const HospitalViewModal = ({ hosp, onEdit, onClose }) => {
  if (!hosp) return null;
  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold">Chi tiết Bệnh viện</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              <div className="view-header">
                {hosp.imgURL ? (
                  <img src={hosp.imgURL} alt={hosp.name} className="view-cover" />
                ) : (
                  <div className="view-cover d-flex align-items-center justify-content-center bg-secondary bg-opacity-25" style={{ width: 100, height: 100 }}>
                    <FaHospital size={40} className="text-secondary" />
                  </div>
                )}
                <div>
                  <h4 className="fw-bold mb-1">{hosp.name}</h4>
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    <span className={`badge ${hosp.isActive ? "badge-active" : "badge-inactive"}`}>
                      {hosp.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                    <span className="badge badge-type">
                      {hosp.type === "private" ? "Tư nhân" : "Công lập"}
                    </span>
                  </div>
                  {hosp.slug && <p className="mb-0 text-muted small">Slug: {hosp.slug}</p>}
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12">
                  <p className="mb-1"><FaMapMarkerAlt className="text-primary me-2"/><strong>Địa chỉ:</strong> {hosp.address}</p>
                  <p className="mb-1"><FaCity className="text-primary me-2"/><strong>Thành phố:</strong> {hosp.city}</p>
                </div>
              </div>

              {hosp.description && (
                <div>
                  <h6 className="fw-bold mb-2">Mô tả</h6>
                  <p className="text-secondary small" style={{ whiteSpace: "pre-line" }}>{hosp.description}</p>
                </div>
              )}
            </div>
            <div className="modal-footer bg-light">
              <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
              <button className="btn btn-primary" onClick={onEdit}><FaEdit className="me-1"/> Sửa</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DeleteConfirmModal = ({ hosp, onConfirm, onClose, deleting }) => {
  if (!hosp) return null;
  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-body p-4 text-center">
              <div className="mb-3">
                 <FaTrash size={48} className="text-danger opacity-75" />
              </div>
              <h5 className="fw-bold mb-3">Xác nhận xóa</h5>
              <p className="text-muted mb-4">
                Bạn có chắc chắn muốn xóa bệnh viện <strong>{hosp.name}</strong>?<br/>
                Thao tác này chỉ thực hiện xóa mềm.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-light px-4" onClick={onClose} disabled={deleting}>Hủy</button>
                <button className="btn btn-danger px-4" onClick={onConfirm} disabled={deleting}>
                  {deleting ? <span className="spinner-border spinner-border-sm"></span> : "Xóa"}
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
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [modal, setModal]       = useState(null); // "add"|"edit"|"view"|"delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [meta, setMeta]         = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading]     = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);

  const fetchHospitals = (page) => {
    setIsLoading(true);
    setError(null);
    hospitalService
      .adminGetHospitals({ page: page + 1, limit: PAGE_LIMIT })
      .then((res) => {
        setHospitals(res.data?.data ?? []);
        setMeta(res.data?.meta ?? {});
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bệnh viện:", err);
        setError("Không thể tải danh sách bệnh viện.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchHospitals(currentPage);
  }, [currentPage]);

  const mapToForm = (hosp) => ({
    name: hosp.name ?? "",
    slug: hosp.slug ?? "",
    address: hosp.address ?? "",
    city: hosp.city ?? "",
    type: hosp.type ?? "public",
    imgURL: hosp.imgURL ?? "",
    description: hosp.description ?? "",
    isActive: hosp.isActive ?? true,
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = async (hosp) => {
    try {
      const res = await hospitalService.hospitalDetail(hosp.slug || hosp.id);
      const data = res.data?.data ?? {};
      setForm(mapToForm(data));
      setSelected(data);
      setModal("edit");
    } catch (err) {
      console.error("Lỗi lấy chi tiết bệnh viện:", err);
      alert("Không thể tải thông tin bệnh viện.");
    }
  };

  const openView = async (hosp) => {
    try {
      const res = await hospitalService.hospitalDetail(hosp.slug || hosp.id);
      setSelected(res.data?.data ?? {});
      setModal("view");
    } catch (err) {
      console.error("Lỗi lấy chi tiết bệnh viện:", err);
      alert("Không thể tải thông tin bệnh viện.");
    }
  };

  const openDelete = (hosp) => {
    setSelected(hosp);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormChange = (newForm) => setForm(newForm);

  const handleSave = async () => {
    const isEdit = modal === "edit";
    const payload = buildPayload(form, isEdit);

    if (!payload.name || !payload.address || !payload.city) {
      alert("Vui lòng điền các trường bắt buộc (Tên, Địa chỉ, Thành phố)!");
      return;
    }

    setSaving(true);
    try {
      if (!isEdit) {
        await hospitalService.adminCreateHospital(payload);
      } else {
        await hospitalService.adminUpdateHospital(selected.id, payload);
      }
      closeModal();
      fetchHospitals(currentPage);
    } catch (err) {
      console.error("Lỗi lưu bệnh viện:", err);
      alert(err?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await hospitalService.adminDeleteHospital(selected.id);
      closeModal();
      const isLastItem = hospitals.length === 1 && currentPage > 0;
      if (isLastItem) setCurrentPage((p) => p - 1);
      else fetchHospitals(currentPage);
    } catch (err) {
      console.error("Lỗi xóa bệnh viện:", err);
      alert(err?.response?.data?.message ?? "Không thể xóa, vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = ({ selected: page }) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-hospitals">
      <div className="hosp-header">
        <div>
          <h1 className="hosp-title">Quản lý Bệnh viện</h1>
          <p className="hosp-sub">Quản lý danh sách các cơ sở y tế, bệnh viện, phòng khám.</p>
        </div>
        <div className="hosp-header__right">
          <span className="hosp-total-badge">
            <FaHospital /> {meta.total ?? 0} bệnh viện
          </span>
          <button className="btn-add-hosp" onClick={openAdd}>
            <FaPlus /> Thêm bệnh viện
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {isLoading ? (
        <LoadingSpinner />
      ) : hospitals.length === 0 ? (
        <div className="hosp-empty">
          <FaHospital className="hosp-empty__icon" />
          <p>Không tìm thấy bệnh viện nào</p>
        </div>
      ) : (
        <div className="hosp-grid">
          {hospitals.map((hosp) => (
            <HospitalCard
              key={hosp.id}
              hosp={hosp}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {!isLoading && (meta.totalPages ?? 1) > 1 && (
        <div className="mt-4">
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mb-3">
              <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange({ selected: currentPage - 1 })}
                  disabled={currentPage === 0}
                >
                  <FaChevronLeft /> Trước
                </button>
              </li>

              {Array.from({ length: meta.totalPages }, (_, i) => {
                const start = Math.max(0, currentPage - 2);
                const end = Math.min(meta.totalPages, start + 5);
                const adjustedStart = Math.max(0, end - 5);

                if (i < adjustedStart || i >= end) return null;

                return (
                  <li
                    key={i}
                    className={`page-item ${i === currentPage ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange({ selected: i })}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}

              <li className={`page-item ${currentPage === meta.totalPages - 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange({ selected: currentPage + 1 })}
                  disabled={currentPage === meta.totalPages - 1}
                >
                  Sau <FaChevronRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <HospitalFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onClose={closeModal}
        saving={saving}
      />

      <HospitalViewModal
        hosp={modal === "view" ? selected : null}
        onEdit={() => { closeModal(); openEdit(selected); }}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        hosp={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
        deleting={deleting}
      />
    </div>
  );
}
