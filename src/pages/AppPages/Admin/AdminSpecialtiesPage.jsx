// ─────────────────────────────────────────────────────────────────────────────
// AdminSpecialtiesPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  FaStethoscope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDisease,
  FaInfoCircle
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./AdminSpecialtiesPage.scss";
import { specialtyService } from "../../../api/appService";
import ImageUploadField from "../../../components/Common/ImageUploadField";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import AppPagination from "../../../components/Common/AppPagination";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LIMIT = 12;

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  imgURL: "",
  diseases: "",
  information: "",
  isActive: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────
const buildPayload = (form, isEdit = false) => {
  const base = {
    name: form.name?.trim(),
    slug: form.slug?.trim() || undefined,
    description: form.description?.trim() || undefined,
    imgURL: form.imgURL?.trim() || undefined,
    diseases: form.diseases ? form.diseases.split(";").map(d => d.trim()).filter(Boolean) : undefined,
    information: form.information ? form.information.split(";").map(i => i.trim()).filter(Boolean) : undefined,
  };
  
  if (isEdit) {
    base.isActive = form.isActive;
  }
  return base;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const SpecialtyCard = ({ spec, onView, onEdit, onDelete }) => {
  return (
    <div className="spec-card">
      <div className="spec-card__cover-wrap">
        {spec.imgURL ? (
          <img src={spec.imgURL} alt={spec.name} className="spec-card__cover" />
        ) : (
          <FaStethoscope size={48} className="text-secondary opacity-50" />
        )}
      </div>

      <div>
        <h3 className="spec-card__name">{spec.name}</h3>
        <p className="spec-card__address">
          {spec.description ? (spec.description.length > 60 ? spec.description.substring(0, 60) + "..." : spec.description) : "Chưa có mô tả"}
        </p>
        <div className="spec-card__badges">
          <span className={`badge ${spec.isActive ? "badge-active" : "badge-inactive"}`}>
            {spec.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
          </span>
        </div>
      </div>

      <div className="spec-card__info">
        <div className="spec-card__info-item">
          <FaDisease /> {spec.diseases?.length ? `${spec.diseases.length} bệnh liên quan` : "Chưa có thông tin bệnh"}
        </div>
        <div className="spec-card__info-item">
          <FaInfoCircle /> {spec.information?.length ? `${spec.information.length} thông tin` : "Chưa có thông tin thêm"}
        </div>
      </div>

      <div className="spec-card__actions">
        <button className="spec-btn spec-btn--view" onClick={() => onView(spec)}>
          <FaEye /> View
        </button>
        <button className="spec-btn spec-btn--edit" onClick={() => onEdit(spec)}>
          <FaEdit /> Edit
        </button>
        <button className="spec-btn spec-btn--delete" onClick={() => onDelete(spec)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const SpecialtyFormModal = ({
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
                {isEdit ? <><FaEdit className="me-2 text-primary" /> Sửa Chuyên khoa</> : <><FaPlus className="me-2 text-primary" /> Thêm Chuyên khoa</>}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên chuyên khoa <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={onChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Slug (tùy chọn)</label>
                  <input type="text" className="form-control" name="slug" value={form.slug} onChange={onChange} placeholder="tu-sinh-khi-de-trong" />
                </div>

                <div className="col-12">
                  <ImageUploadField
                    label="Hình ảnh minh họa"
                    value={form.imgURL}
                    uploadType="specialties"
                    onChange={(imgURL) => onFormChange({ ...form, imgURL })}
                    disabled={saving}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Mô tả (Tối đa 1000 ký tự)</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={onChange} rows="3" />
                </div>

                <div className="col-12">
                  <label className="form-label">Các bệnh liên quan (Cách nhau bằng dấu chấm phẩy)</label>
                  <input type="text" className="form-control" name="diseases" value={form.diseases} onChange={onChange} placeholder="VD: Đau đầu; Sốt; Cảm cúm" />
                </div>

                <div className="col-12">
                  <label className="form-label">Thông tin khác (Cách nhau bằng dấu chấm phẩy)</label>
                  <input type="text" className="form-control" name="information" value={form.information} onChange={onChange} placeholder="VD: Chữa khỏi 99%; Điều trị ngoại trú" />
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

const SpecialtyViewModal = ({ spec, onEdit, onClose }) => {
  if (!spec) return null;
  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold">Chi tiết Chuyên khoa</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              <div className="view-header">
                {spec.imgURL ? (
                  <img src={spec.imgURL} alt={spec.name} className="view-cover" />
                ) : (
                  <div className="view-cover d-flex align-items-center justify-content-center bg-secondary bg-opacity-25" style={{ width: 100, height: 100 }}>
                    <FaStethoscope size={40} className="text-secondary" />
                  </div>
                )}
                <div>
                  <h4 className="fw-bold mb-1">{spec.name}</h4>
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    <span className={`badge ${spec.isActive ? "badge-active" : "badge-inactive"}`}>
                      {spec.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                  {spec.slug && <p className="mb-0 text-muted small">Slug: {spec.slug}</p>}
                </div>
              </div>

              {spec.description && (
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Mô tả</h6>
                  <p className="text-secondary small" style={{ whiteSpace: "pre-line" }}>{spec.description}</p>
                </div>
              )}

              {spec.diseases && spec.diseases.length > 0 && (
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Các bệnh liên quan</h6>
                  <ul className="text-secondary small">
                    {spec.diseases.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}

              {spec.information && spec.information.length > 0 && (
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Thông tin khác</h6>
                  <ul className="text-secondary small">
                    {spec.information.map((info, i) => <li key={i}>{info}</li>)}
                  </ul>
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

const DeleteConfirmModal = ({ spec, onConfirm, onClose, deleting }) => {
  if (!spec) return null;
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
                Bạn có chắc chắn muốn xóa chuyên khoa <strong>{spec.name}</strong>?<br/>
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
export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [modal, setModal]       = useState(null); // "add"|"edit"|"view"|"delete"
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [meta, setMeta]         = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading]     = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");

  const fetchSpecialties = useCallback((page) => {
    setIsLoading(true);
    setError(null);
    const params = {
      page: page + 1,
      limit: PAGE_LIMIT,
      ...(search.trim() && { search: search.trim() }),
      ...(filterActive !== "" && { isActive: filterActive }),
    };

    specialtyService
      .adminGetSpecialties(params)
      .then((res) => {
        setSpecialties(res.data?.data ?? []);
        setMeta(res.data?.meta ?? {});
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách chuyên khoa:", err);
        setError("Không thể tải danh sách chuyên khoa.");
      })
      .finally(() => setIsLoading(false));
  }, [filterActive, search]);

  useEffect(() => {
    fetchSpecialties(currentPage);
  }, [currentPage, fetchSpecialties]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearch(searchInput);
  };

  const mapToForm = (spec) => ({
    name: spec.name ?? "",
    slug: spec.slug ?? "",
    description: spec.description ?? "",
    imgURL: spec.imgURL ?? "",
    diseases: spec.diseases ? spec.diseases.join("; ") : "",
    information: spec.information ? spec.information.join("; ") : "",
    isActive: spec.isActive ?? true,
  });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = async (spec) => {
    try {
      const res = await specialtyService.specialtyDetail(spec.slug || spec.id);
      const data = res.data?.data ?? {};
      setForm(mapToForm(data));
      setSelected(data);
      setModal("edit");
    } catch (err) {
      console.error("Lỗi lấy chi tiết chuyên khoa:", err);
      toast.error("Không thể tải thông tin chuyên khoa.");
    }
  };

  const openView = async (spec) => {
    try {
      const res = await specialtyService.specialtyDetail(spec.slug || spec.id);
      setSelected(res.data?.data ?? {});
      setModal("view");
    } catch (err) {
      console.error("Lỗi lấy chi tiết chuyên khoa:", err);
      toast.error("Không thể tải thông tin chuyên khoa.");
    }
  };

  const openDelete = (spec) => {
    setSelected(spec);
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

    if (!payload.name) {
      toast.warning("Vui lòng điền tên chuyên khoa!");
      return;
    }

    setSaving(true);
    try {
      if (!isEdit) {
        await specialtyService.adminCreateSpecialty(payload);
      } else {
        await specialtyService.adminUpdateSpecialty(selected.id, payload);
      }
      closeModal();
      fetchSpecialties(currentPage);
    } catch (err) {
      console.error("Lỗi lưu chuyên khoa:", err);
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await specialtyService.adminDeleteSpecialty(selected.id);
      closeModal();
      const isLastItem = specialties.length === 1 && currentPage > 0;
      if (isLastItem) setCurrentPage((p) => p - 1);
      else fetchSpecialties(currentPage);
    } catch (err) {
      console.error("Lỗi xóa chuyên khoa:", err);
      toast.error(err?.response?.data?.message ?? "Không thể xóa, vui lòng thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = ({ selected: page }) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-specialties">
      <div className="spec-header">
        <div>
          <h1 className="spec-title">Quản lý Chuyên khoa</h1>
          <p className="spec-sub">Quản lý danh sách các chuyên khoa y tế.</p>
        </div>
        <div className="spec-header__right">
          <span className="spec-total-badge">
            <FaStethoscope /> {meta.total ?? 0} chuyên khoa
          </span>
          <button className="btn-add-spec" onClick={openAdd}>
            <FaPlus /> Thêm chuyên khoa
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <input
                className="form-control"
                placeholder="Tìm chuyên khoa theo tên..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Tìm</button>
            </form>
          </div>
          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={filterActive}
              onChange={(e) => {
                setFilterActive(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>
          {(search || filterActive) && (
            <div className="col-12 col-md-3">
              <button
                className="btn btn-light border w-100"
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setFilterActive("");
                  setCurrentPage(0);
                }}
              >
                Xóa lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : specialties.length === 0 ? (
        <div className="spec-empty">
          <FaStethoscope className="spec-empty__icon" />
          <p>Không tìm thấy chuyên khoa nào</p>
        </div>
      ) : (
        <div className="spec-grid">
          {specialties.map((spec) => (
            <SpecialtyCard
              key={spec.id}
              spec={spec}
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
        itemLabel="chuyên khoa"
        onPageChange={(selected) => handlePageChange({ selected })}
      />

      <SpecialtyFormModal
        mode={modal}
        form={form}
        onChange={handleChange}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onClose={closeModal}
        saving={saving}
      />

      <SpecialtyViewModal
        spec={modal === "view" ? selected : null}
        onEdit={() => { closeModal(); openEdit(selected); }}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        spec={modal === "delete" ? selected : null}
        onConfirm={handleDelete}
        onClose={closeModal}
        deleting={deleting}
      />
    </div>
  );
}
