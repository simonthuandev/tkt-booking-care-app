import { useState, useEffect } from "react";
import { FaLock, FaLockOpen, FaTrash, FaPlus } from "react-icons/fa";
import { FaCheckToSlot } from "react-icons/fa6";
import { toast } from "react-toastify";
import { timeSlotService, doctorService, hospitalService } from "../../../api/appService";
import AppPagination from "../../../components/Common/AppPagination";
import ConfirmModal from "../../../components/Common/ConfirmModal";
import WorkingDaysSelector from "../../../components/Common/WorkingDaysSelector";
import { DAYS_OF_WEEK, DAY_LABELS, parseWorkingDays } from "../../../components/Common/workingDaysUtils";
import "./AdminSchedulesPage.scss";

const PAGE_LIMIT = 20;

function statusBadge(slot) {
  if (slot.isBlocked) return <span className="badge badge--blocked">Đã khóa</span>;
  if (slot.isBooked) return <span className="badge badge--booked">Đã đặt</span>;
  return <span className="badge badge--free">Trống</span>;
}

function GenerateModal({ onClose, doctors, onSuccess }) {
  const [form, setForm] = useState({
    doctorId: "",
    hospitalId: "",
    startDate: "",
    endDate: "",
    dayOfWeek: [],
    startTime: "",
    endTime: "",
    durationMinutes: 30,
    breakStart: "12:00",
    breakEnd: "13:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDoctor = doctors.find((doctor) => doctor.id === form.doctorId);
  const doctorHospitals = selectedDoctor?.hospitals || [];
  const selectedLink = doctorHospitals.find((item) => {
    const hospitalId = item.hospital?.id || item.hospitalId;
    return hospitalId === form.hospitalId;
  });
  const allowedDays = parseWorkingDays(selectedLink?.workingDays);
  const disabledDays = allowedDays.length ? DAYS_OF_WEEK.filter((day) => !allowedDays.includes(day)) : [];
  const allowedStartTime = selectedLink?.startTime || "";
  const allowedEndTime = selectedLink?.endTime || "";

  const set = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleDoctorChange = (e) => {
    setForm((current) => ({
      ...current,
      doctorId: e.target.value,
      hospitalId: "",
      dayOfWeek: [],
      startTime: "",
      endTime: "",
    }));
  };

  const handleHospitalChange = (e) => {
    const hospitalId = e.target.value;
    const link = doctorHospitals.find((item) => (item.hospital?.id || item.hospitalId) === hospitalId);

    setForm((current) => ({
      ...current,
      hospitalId,
      dayOfWeek: parseWorkingDays(link?.workingDays),
      startTime: link?.startTime || "",
      endTime: link?.endTime || "",
    }));
  };

  const isTimeOutsideRange = (value) => {
    if (!value || !allowedStartTime || !allowedEndTime) return false;
    return value < allowedStartTime || value > allowedEndTime;
  };

  const handleSubmit = async () => {
    if (!form.doctorId || !form.hospitalId || !form.startDate || !form.endDate) {
      toast.error("Vui lòng điền đủ thông tin cơ bản!");
      return;
    }
    if (!form.dayOfWeek.length) {
      toast.error("Vui lòng chọn ít nhất một ngày làm việc.");
      return;
    }
    if (!form.startTime || !form.endTime) {
      toast.error("Vui lòng chọn giờ bắt đầu và giờ kết thúc.");
      return;
    }
    if (isTimeOutsideRange(form.startTime) || isTimeOutsideRange(form.endTime)) {
      toast.error(`Giờ sinh slot phải nằm trong khung ${allowedStartTime} - ${allowedEndTime}.`);
      return;
    }
    if (form.startTime >= form.endTime) {
      toast.error("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { ...form, durationMinutes: Number(form.durationMinutes) };
      if (!payload.breakStart) delete payload.breakStart;
      if (!payload.breakEnd) delete payload.breakEnd;

      await timeSlotService.adminGenerateTimeSlots(payload);
      toast.success("Sinh slots thành công!");
      onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi sinh slots. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content generate-slot-modal">
            <div className="modal-header">
              <h5 className="modal-title">Sinh slots tự động</h5>
              <button className="btn-close" onClick={onClose} disabled={isSubmitting} />
            </div>

            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Bác sĩ</label>
                  <select className="form-select" value={form.doctorId} onChange={handleDoctorChange}>
                    <option value="">Chọn bác sĩ</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.user?.lastName} {doctor.user?.firstName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small text-uppercase fw-bold">Cơ sở</label>
                  <select className="form-select" value={form.hospitalId} onChange={handleHospitalChange} disabled={!form.doctorId}>
                    <option value="">{form.doctorId ? "Chọn cơ sở của bác sĩ" : "Chọn bác sĩ trước"}</option>
                    {doctorHospitals.map((item) => {
                      const hospital = item.hospital || item;
                      return <option key={hospital.id} value={hospital.id}>{hospital.name}</option>;
                    })}
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
                <WorkingDaysSelector
                  value={form.dayOfWeek.join(",")}
                  onChange={(value) => setForm((current) => ({ ...current, dayOfWeek: parseWorkingDays(value) }))}
                  disabledDays={disabledDays}
                  disabled={!form.hospitalId}
                />
                {selectedLink && (
                  <div className="form-text">
                    Lịch tại cơ sở này: {allowedDays.map((day) => DAY_LABELS[day]).join(", ") || "Chưa cấu hình"}
                    {allowedStartTime && allowedEndTime ? ` · ${allowedStartTime} - ${allowedEndTime}` : ""}
                  </div>
                )}
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">Giờ bắt đầu</label>
                  <input type="time" className="form-control" value={form.startTime} min={allowedStartTime} max={allowedEndTime} onChange={set("startTime")} disabled={!form.hospitalId} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small text-uppercase fw-bold">Giờ kết thúc</label>
                  <input type="time" className="form-control" value={form.endTime} min={allowedStartTime} max={allowedEndTime} onChange={set("endTime")} disabled={!form.hospitalId} />
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
              <button className="btn btn-primary btn-save-slot" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Sinh slots"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminSchedulesPage() {
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({
    doctorId: "",
    hospitalId: "",
    date: "",
    isBooked: "",
    isBlocked: "",
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [confirmState, setConfirmState] = useState(null);

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
    } catch {
      toast.error("Không thể tải danh sách lịch khám.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [docsRes, hospsRes] = await Promise.all([
          doctorService.adminGetDoctors({ limit: 50 }),
          hospitalService.adminGetHospitals({ limit: 50 }),
        ]);
        setDoctors(docsRes.data?.data || docsRes.data || []);
        setHospitals(hospsRes.data?.data || hospsRes.data || []);
      } catch {
        toast.error("Không thể tải danh sách bác sĩ/cơ sở.");
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const setFilter = (key) => (e) => {
    setFilters((current) => ({ ...current, [key]: e.target.value }));
    setPage(1);
  };

  const toggleSelect = (id) => setSelected((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selected.size === slots.length) setSelected(new Set());
    else setSelected(new Set(slots.map((slot) => slot.id)));
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
    try {
      await timeSlotService.adminDeleteTimeSlot(id);
      toast.success("Xóa slot thành công");
      fetchSlots();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi xóa slot!");
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsLoading(true);
      await Promise.all(Array.from(selected).map((id) => timeSlotService.adminDeleteTimeSlot(id)));
      toast.success(`Đã xóa thành công ${selected.size} slot`);
      fetchSlots();
    } catch {
      toast.error("Có lỗi xảy ra khi xóa một số slot. Có thể một số slot đã được đặt.");
      fetchSlots();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDoctorName = (doctor) => {
    if (!doctor || !doctor.user) return "Chưa có thông tin";
    return `${doctor.user.lastName || ""} ${doctor.user.firstName || ""}`.trim();
  };

  const closeConfirm = () => setConfirmState(null);

  return (
    <div className="schedules-page">
      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          doctors={doctors}
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
            <FaCheckToSlot /> {meta.total ?? 0} slot
          </span>
          <button className="btn-add-slot" onClick={() => setShowGenerate(true)}>
            <FaPlus /> Sinh slots
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <select value={filters.doctorId} onChange={setFilter("doctorId")}>
          <option value="">Tất cả bác sĩ</option>
          {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{formatDoctorName(doctor)}</option>)}
        </select>
        <select value={filters.hospitalId} onChange={setFilter("hospitalId")}>
          <option value="">Tất cả cơ sở</option>
          {hospitals.map((hospital) => <option key={hospital.id} value={hospital.id}>{hospital.name}</option>)}
        </select>
        <input type="date" value={filters.date} onChange={setFilter("date")} title="Lọc theo ngày" />
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
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setFilters({ doctorId: "", hospitalId: "", date: "", isBooked: "", isBlocked: "" });
              setPage(1);
            }}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="bulk-bar">
          <span>Đã chọn <strong>{selected.size}</strong> slot</span>
          <button
            className="btn btn--danger btn--sm"
            onClick={() => setConfirmState({
              title: "Xóa các slot đã chọn?",
              message: `Bạn có chắc chắn muốn xóa ${selected.size} slot đã chọn không?`,
              confirmText: "Xóa slot",
              onConfirm: handleBulkDelete,
            })}
            disabled={isLoading}
          >
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
            ) : slots.map((slot) => (
              <tr key={slot.id} className={selected.has(slot.id) ? "row--selected" : ""}>
                <td className="col-check">
                  <input type="checkbox" checked={selected.has(slot.id)} onChange={() => toggleSelect(slot.id)} />
                </td>
                <td><span className="doctor-name">{formatDoctorName(slot.doctor)}</span></td>
                <td><span className="hospital-tag">{slot.hospital?.name || "Chưa có thông tin"}</span></td>
                <td className="date-cell">{new Date(slot.date).toLocaleDateString("vi-VN")}</td>
                <td className="time-cell"><span className="time-pill">{slot.startTime} - {slot.endTime}</span></td>
                <td>{statusBadge(slot)}</td>
                <td className="col-actions">
                  <div className="slot-actions">
                    <button
                      className={`action-btn ${slot.isBlocked ? "action-btn--unblock" : "action-btn--block"}`}
                      title={slot.isBlocked ? "Mở khóa" : "Khóa slot"}
                      onClick={() => handleBlockToggle(slot.id, slot.isBlocked)}
                    >
                      {slot.isBlocked ? <FaLockOpen /> : <FaLock />}
                    </button>
                    {!slot.isBooked && (
                      <button
                        className="action-btn action-btn--delete"
                        title="Xóa slot"
                        onClick={() => setConfirmState({
                          title: "Xóa slot này?",
                          message: "Slot chưa được đặt sẽ bị xóa khỏi hệ thống.",
                          confirmText: "Xóa slot",
                          onConfirm: () => handleDelete(slot.id),
                        })}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AppPagination
        pageCount={meta.totalPages || 1}
        currentPage={page - 1}
        total={meta.total}
        itemLabel="slot"
        onPageChange={(selectedPage) => setPage(selectedPage + 1)}
      />

      <ConfirmModal
        show={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmText={confirmState?.confirmText}
        saving={isLoading}
        onClose={closeConfirm}
        onConfirm={async () => {
          const action = confirmState?.onConfirm;
          closeConfirm();
          await action?.();
        }}
      />
    </div>
  );
}
