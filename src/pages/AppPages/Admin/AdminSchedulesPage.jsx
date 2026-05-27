import { useState, useEffect } from "react";
import { FaLock, FaLockOpen, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { timeSlotService, doctorService, hospitalService } from "../../../api/appService";
import "./AdminSchedulesPage.scss";
import { FaCheckToSlot } from "react-icons/fa6";

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS = { MON: "T2", TUE: "T3", WED: "T4", THU: "T5", FRI: "T6", SAT: "T7", SUN: "CN" };

const PAGE_LIMIT = 20;

function statusBadge(slot) {
  if (slot.isBlocked) return <span className="badge badge--blocked">Đã khóa</span>;
  if (slot.isBooked) return <span className="badge badge--booked">Đã đặt</span>;
  return <span className="badge badge--free">Trống</span>;
}

// ─── Generate Modal ───────────────────────────────────────────
function GenerateModal({ onClose, doctors, hospitals, onSuccess }) {
  const [form, setForm] = useState({
    doctorId: doctors.length > 0 ? doctors[0].id : "",
    hospitalId: hospitals.length > 0 ? hospitals[0].id : "",
    startDate: "", endDate: "",
    dayOfWeek: ["MON", "WED", "FRI"],
    startTime: "08:00", endTime: "17:00",
    durationMinutes: 30,
    breakStart: "12:00", breakEnd: "13:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (day) => setForm(f => ({
    ...f,
    dayOfWeek: f.dayOfWeek.includes(day)
      ? f.dayOfWeek.filter(d => d !== day)
      : [...f.dayOfWeek, day],
  }));

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.doctorId || !form.hospitalId || !form.startDate || !form.endDate) {
      toast.error("Vui lòng điền đủ thông tin cơ bản!");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = { ...form };
      if (!payload.breakStart) delete payload.breakStart;
      if (!payload.breakEnd) delete payload.breakEnd;
      payload.durationMinutes = Number(payload.durationMinutes);

      await timeSlotService.adminGenerateTimeSlots(payload);
      toast.success("Sinh slots thành công!");
      onSuccess();
    } catch (error) {
      const msg = error?.response?.data?.message || "Lỗi khi sinh slots. Vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Lớp nền đen xám của Bootstrap */}
      <div className="modal-backdrop fade show" onClick={onClose} />

      {/* Khung Modal của Bootstrap */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sinh slots tự động</h5>
              <button className="btn-close" onClick={onClose} disabled={isSubmitting} />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Bác sĩ</label>
                  <select className="form-select" value={form.doctorId} onChange={set("doctorId")}>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.lastName} {d.user?.firstName}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Cơ sở</label>
                  <select className="form-select" value={form.hospitalId} onChange={set("hospitalId")}>
                    {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Từ ngày</label>
                  <input type="date" className="form-control" value={form.startDate} onChange={set("startDate")} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Đến ngày</label>
                  <input type="date" className="form-control" value={form.endDate} onChange={set("endDate")} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small text-uppercase fw-bold">Ngày trong tuần</label>
                <div className="d-flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(d => (
                    <button
                      key={d}
                      type="button"
                      className={`btn btn-sm ${form.dayOfWeek.includes(d) ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => toggle(d)}
                    >
                      {DAY_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">Giờ bắt đầu</label>
                  <input type="time" className="form-control" value={form.startTime} onChange={set("startTime")} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">Giờ kết thúc</label>
                  <input type="time" className="form-control" value={form.endTime} onChange={set("endTime")} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">Mỗi slot (phút)</label>
                  <input type="number" className="form-control" min={15} max={120} value={form.durationMinutes} onChange={set("durationMinutes")} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Nghỉ từ</label>
                  <input type="time" className="form-control" value={form.breakStart} onChange={set("breakStart")} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Đến</label>
                  <input type="time" className="form-control" value={form.breakEnd} onChange={set("breakEnd")} />
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button className="btn btn-light border" onClick={onClose} disabled={isSubmitting}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting} style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}>
                {isSubmitting ? "Đang xử lý..." : "Sinh slots"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function AdminSchedulesPage() {
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const [filters, setFilters] = useState({
    doctorId: "", hospitalId: "", date: "", isBooked: "", isBlocked: "",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [docsRes, hospsRes] = await Promise.all([
          doctorService.adminGetDoctors({ limit: 50 }),
          hospitalService.adminGetHospitals({ limit: 50 })
        ]);
        setDoctors(docsRes.data?.data || docsRes.data || []);
        setHospitals(hospsRes.data?.data || hospsRes.data || []);
      } catch (err) {
        toast.error("Không thể tải danh sách bác sĩ/cơ sở.");
      }
    };
    fetchMasterData();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const params = { page, limit: PAGE_LIMIT };
      if (filters.doctorId) params.doctorId = filters.doctorId;
      if (filters.hospitalId) params.hospitalId = filters.hospitalId;
      if (filters.date) params.date = filters.date;
      if (filters.isBooked !== "") params.isBooked = filters.isBooked === "true";
      if (filters.isBlocked !== "") params.isBlocked = filters.isBlocked === "true";

      const res = await timeSlotService.adminGetTimeSlots(params);
      const data = res.data;
      setSlots(data.data || []);
      setMeta(data.meta || { total: 0, totalPages: 1, page: 1 });
      setSelected(new Set());
    } catch (err) {
      toast.error("Không thể tải danh sách lịch khám.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const setFilter = (k) => (e) => {
    setFilters(f => ({ ...f, [k]: e.target.value }));
    setPage(1);
  };

  const toggleSelect = (id) => setSelected(s => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selected.size === slots.length) setSelected(new Set());
    else setSelected(new Set(slots.map(s => s.id)));
  };

  const handleBlockToggle = async (id, currentBlocked) => {
    try {
      await timeSlotService.adminBlockTimeSlot(id, { isBlocked: !currentBlocked });
      toast.success(currentBlocked ? "Đã mở khóa slot" : "Đã khóa slot");
      fetchSlots();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi thao tác!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa slot này?")) return;
    try {
      await timeSlotService.adminDeleteTimeSlot(id);
      toast.success("Xóa slot thành công");
      fetchSlots();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi xóa slot!");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selected.size} slot đã chọn?`)) return;
    try {
      setIsLoading(true);
      await Promise.all(Array.from(selected).map(id => timeSlotService.adminDeleteTimeSlot(id)));
      toast.success(`Đã xóa thành công ${selected.size} slot`);
      fetchSlots();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa một số slot. Có thể một số slot đã được đặt.");
      fetchSlots();
    }
  };

  const pageRange = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(meta.totalPages || 1, page + delta); i++) range.push(i);
    return range;
  };

  const formatDoctorName = (doctor) => {
    if (!doctor || !doctor.user) return "N/A";
    return `${doctor.user.lastName || ""} ${doctor.user.firstName || ""}`.trim();
  };

  return (
    <div className="schedules-page">
      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          doctors={doctors}
          hospitals={hospitals}
          onSuccess={() => {
            setShowGenerate(false);
            setPage(1);
            fetchSlots();
          }}
        />
      )}

      <div className="slots-header">
        <div>
          <h1 className="slots-title">Quản lý lịch khám</h1>
          <p className="slots-sub">Quản lý slot của bác sĩ và hỗ trợ sinh slots theo luật.</p>
        </div>
        <div className="slots-header__right">
          <span className="slots-total-badge">
            <FaCheckToSlot /> {meta.total ?? 0} slots
          </span>
          <button className="btn-add-slot" onClick={() => setShowGenerate(true)}>
            <FaPlus /> Sinh slots
          </button>
        </div>
      </div>

      {/* <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý lịch khám</h1>
          <p className="page-sub">Tổng <strong>{meta.total}</strong> slots · Trang {page}/{meta.totalPages || 1}</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowGenerate(true)}>
          <FaPlus /> Sinh slots
        </button>
      </div> */}

      <div className="filter-bar">
        <select value={filters.doctorId} onChange={setFilter("doctorId")}>
          <option value="">Tất cả bác sĩ</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{formatDoctorName(d)}</option>)}
        </select>
        <select value={filters.hospitalId} onChange={setFilter("hospitalId")}>
          <option value="">Tất cả cơ sở</option>
          {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={setFilter("date")}
          title="Lọc theo ngày"
        />
        <select value={filters.isBooked} onChange={setFilter("isBooked")}>
          <option value="">Trạng thái đặt</option>
          <option value="true">Đã đặt</option>
          <option value="false">Chưa đặt</option>
        </select>
        <select value={filters.isBlocked} onChange={setFilter("isBlocked")}>
          <option value="">Trạng thái khóa</option>
          <option value="true">Đã khóa</option>
          <option value="false">Chưa khóa</option>
        </select>
        {(filters.doctorId || filters.hospitalId || filters.date || filters.isBooked || filters.isBlocked) && (
          <button className="btn btn--ghost btn--sm" onClick={() => { setFilters({ doctorId: "", hospitalId: "", date: "", isBooked: "", isBlocked: "" }); setPage(1); }}>
            Xóa lọc
          </button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span>Đã chọn <strong>{selected.size}</strong> slot</span>
          <button className="btn btn--danger btn--sm" onClick={handleBulkDelete} disabled={isLoading}>
            <FaTrash /> Xóa hàng loạt
          </button>
          <button className="btn btn--ghost btn--sm" onClick={() => setSelected(new Set())}>Bỏ chọn</button>
        </div>
      )}

      <div className="table-wrap">
        <table className="slot-table">
          <thead>
            <tr>
              <th className="col-check">
                <input type="checkbox" checked={selected.size === slots.length && slots.length > 0} onChange={toggleAll} />
              </th>
              <th>Bác sĩ</th>
              <th>Cơ sở</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Trạng thái</th>
              <th className="col-actions">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="empty-state">Đang tải dữ liệu...</td></tr>
            ) : slots.length === 0 ? (
              <tr><td colSpan={7} className="empty-state">Không tìm thấy slot nào</td></tr>
            ) : slots.map(slot => (
              <tr key={slot.id} className={selected.has(slot.id) ? "row--selected" : ""}>
                <td className="col-check">
                  <input type="checkbox" checked={selected.has(slot.id)} onChange={() => toggleSelect(slot.id)} />
                </td>
                <td>
                  <span className="doctor-name">{formatDoctorName(slot.doctor)}</span>
                </td>
                <td><span className="hospital-tag">{slot.hospital?.name || "N/A"}</span></td>
                <td className="date-cell">{new Date(slot.date).toLocaleDateString("vi-VN")}</td>
                <td className="time-cell">
                  <span className="time-pill">{slot.startTime} – {slot.endTime}</span>
                </td>
                <td>{statusBadge(slot)}</td>
                <td className="col-actions">
                  <button
                    className={`action-btn ${slot.isBlocked ? "action-btn--unblock" : "action-btn--block"}`}
                    title={slot.isBlocked ? "Mở khóa" : "Khóa slot"}
                    onClick={() => handleBlockToggle(slot.id, slot.isBlocked)}
                  >
                    {slot.isBlocked ? <FaLockOpen /> : <FaLock />}
                  </button>
                  {!slot.isBooked && (
                    <button className="action-btn action-btn--delete" title="Xóa slot" onClick={() => handleDelete(slot.id)}>
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(meta.totalPages > 1) && (
        <nav className="pagination" aria-label="Phân trang">
          <ul>
            <li className={page === 1 ? "disabled" : ""}>
              <button onClick={() => setPage(1)} disabled={page === 1} aria-label="Trang đầu">«</button>
            </li>
            <li className={page === 1 ? "disabled" : ""}>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1} aria-label="Trang trước">‹</button>
            </li>

            {page > 3 && (
              <>
                <li><button onClick={() => setPage(1)}>1</button></li>
                {page > 4 && <li className="ellipsis"><span>…</span></li>}
              </>
            )}

            {pageRange().map(p => (
              <li key={p} className={p === page ? "active" : ""}>
                <button onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}

            {page < meta.totalPages - 2 && (
              <>
                {page < meta.totalPages - 3 && <li className="ellipsis"><span>…</span></li>}
                <li><button onClick={() => setPage(meta.totalPages)}>{meta.totalPages}</button></li>
              </>
            )}

            <li className={page === meta.totalPages ? "disabled" : ""}>
              <button onClick={() => setPage(p => p + 1)} disabled={page === meta.totalPages} aria-label="Trang sau">›</button>
            </li>
            <li className={page === meta.totalPages ? "disabled" : ""}>
              <button onClick={() => setPage(meta.totalPages)} disabled={page === meta.totalPages} aria-label="Trang cuối">»</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
