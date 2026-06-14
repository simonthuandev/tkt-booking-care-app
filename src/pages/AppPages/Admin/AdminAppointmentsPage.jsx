// ─────────────────────────────────────────────────────────────────────────────
// AdminAppointmentsPage.jsx  —  Appointments Management CRUD
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaEdit,
  FaBan,
  FaClock,
  FaCheckCircle,
  FaCheckDouble,
  FaTimesCircle,
  FaUser,
  FaUserMd,
  FaHospital,
  FaStethoscope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { appointmentService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import AppPagination from "../../../components/Common/AppPagination";
import "./AdminAppointmentsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LIMIT = 12;

const STATUS_CFG = {
  pending: { label: "Chờ xác nhận", color: "#f5a623", bg: "#fff8e6", icon: FaClock },
  confirmed: { label: "Đã xác nhận", color: "#0ba3a3", bg: "#e6f7f7", icon: FaCheckCircle },
  processing: { label: "Đang khám", color: "#3b82f6", bg: "#eff6ff", icon: FaStethoscope },
  completed: { label: "Hoàn thành", color: "#1a9e5c", bg: "#e6f9f0", icon: FaCheckDouble },
  no_show: { label: "Không đến", color: "#6b7280", bg: "#f3f4f6", icon: FaBan },
  cancelled: { label: "Đã hủy", color: "#e24b4a", bg: "#fef2f2", icon: FaTimesCircle },
};

const TERMINAL_STATUSES = ["completed", "cancelled", "no_show"];

const ADMIN_NEXT_STATUSES = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["completed", "no_show", "cancelled"],
};

const PAYMENT_STATUS_CFG = {
  pending: { label: "Chờ thanh toán", color: "#f5a623" },
  completed: { label: "Đã thanh toán", color: "#1a9e5c" },
  refunded: { label: "Đã hoàn tiền", color: "#6b7f8e" },
  failed: { label: "Thanh toán lỗi", color: "#e24b4a" },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "Chưa có";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const formatDateTime = (dateStr, startTime, endTime) => {
  if (!dateStr) return "Chưa có";
  const date = new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  if (startTime && endTime) {
    return `${startTime} - ${endTime} | ${date}`;
  }
  return date;
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AppointmentRow
// ─────────────────────────────────────────────────────────────────────────────
const AppointmentRow = ({ appt, onView, onEditStatus, onCancel }) => {
  const statusCfg = STATUS_CFG[appt.status] || STATUS_CFG.pending;
  const StatusIcon = statusCfg.icon;

  const paymentStatus = PAYMENT_STATUS_CFG[appt.paymentStatus] || PAYMENT_STATUS_CFG.pending;
  const isTerminal = TERMINAL_STATUSES.includes(appt.status);

  return (
    <div className="appt-row">
      <div className="appt-row__patient">
        <p className="appt-row__name">
          <FaUser className="me-1 text-muted" /> {appt.patientProfile?.fullName || "Chưa có thông tin"}
        </p>
        <p className="appt-row__phone">
          {appt.patientProfile?.phoneNumber || "Chưa có SĐT"}
        </p>
      </div>

      <div className="appt-row__doctor">
        <p className="appt-row__name">
          <FaUserMd className="me-1 text-primary" /> {appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}
        </p>
        <p className="appt-row__hospital text-truncate" title={appt.hospital?.name}>
          <FaHospital className="me-1 text-muted" /> {appt.hospital?.name || "Chưa có thông tin"}
        </p>
      </div>

      <div className="appt-row__datetime">
        <span className="fw-semibold text-dark">
          {appt.timeSlot?.startTime} - {appt.timeSlot?.endTime}
        </span>
        <span className="text-muted small">
          {appt.timeSlot?.date ? new Date(appt.timeSlot.date).toLocaleDateString("vi-VN") : "Chưa có"}
        </span>
      </div>

      <div className="appt-row__payment">
        <span className="fw-semibold">{formatCurrency(appt.totalAmount)}</span>
        <span className="small fw-semibold" style={{ color: paymentStatus.color }}>
          {paymentStatus.label}
        </span>
      </div>

      <div className="appt-row__status">
        <span
          className="appt-status-badge"
          style={{ color: statusCfg.color, background: statusCfg.bg }}
        >
          <StatusIcon /> {statusCfg.label}
        </span>
      </div>

      <div className="appt-row__actions">
        <button className="appt-btn appt-btn--view" onClick={() => onView(appt)} title="Xem chi tiết">
          <FaEye />
        </button>
        {!isTerminal && (
          <button className="appt-btn appt-btn--edit" onClick={() => onEditStatus(appt)} title="Đổi trạng thái">
            <FaEdit />
          </button>
        )}
        {!isTerminal && (
          <button className="appt-btn appt-btn--ban" onClick={() => onCancel(appt)} title="Hủy lịch hẹn">
            <FaBan />
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StatusModal
// ─────────────────────────────────────────────────────────────────────────────
const StatusModal = ({ appt, onSave, onClose, saving }) => {
  const [status, setStatus] = useState(appt?.status || "pending");
  if (!appt) return null;
  const currentStatusCfg = STATUS_CFG[appt.status] || STATUS_CFG.pending;
  const statusOptions = ADMIN_NEXT_STATUSES[appt.status] || [];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cập nhật trạng thái</h5>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>
            <div className="modal-body">
              <div className="text-center mb-3">
                <span className="appt-status-badge mb-2 d-inline-flex" style={{ color: currentStatusCfg.color, background: currentStatusCfg.bg }}>
                  Hiện tại: {currentStatusCfg.label}
                </span>
                <p className="mb-0 fw-semibold">{appt.patientProfile?.fullName}</p>
                <small className="text-muted">ID: {appt.id.substring(0, 8)}...</small>
              </div>
              <label className="form-label">Trạng thái mới</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)} disabled={saving}>
                <option value={appt.status}>{currentStatusCfg.label}</option>
                {statusOptions.map((key) => {
                  const cfg = STATUS_CFG[key];
                  return (
                  <option key={key} value={key}>{cfg.label}</option>
                  );
                })}
              </select>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light border w-100 mb-2" onClick={onClose} disabled={saving}>Hủy</button>
              <button className="btn btn-save w-100 m-0" onClick={() => onSave(appt.id, status)} disabled={saving || status === appt.status}>
                {saving ? "Đang lưu..." : "Lưu trạng thái"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: CancelModal
// ─────────────────────────────────────────────────────────────────────────────
const CancelModal = ({ appt, onConfirm, onClose, saving }) => {
  const [cancelReason, setCancelReason] = useState("");
  if (!appt) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Hủy lịch hẹn</h5>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>
            <div className="modal-body py-4">
              <div className="alert alert-danger">
                Bạn có chắc chắn muốn hủy lịch hẹn của <strong>{appt.patientProfile?.fullName}</strong> không?
              </div>
              <div className="mb-3">
                <label className="form-label">Lý do hủy (không bắt buộc)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Nhập lý do hủy lịch..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  maxLength={500}
                  disabled={saving}
                ></textarea>
                <div className="form-text text-end">{cancelReason.length}/500</div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light border" onClick={onClose} disabled={saving}>Đóng</button>
              <button className="btn btn-danger" onClick={() => onConfirm(appt.id, cancelReason)} disabled={saving}>
                {saving ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: AppointmentViewModal
// ─────────────────────────────────────────────────────────────────────────────
const AppointmentViewModal = ({ appt, onClose }) => {
  if (!appt) return null;
  const statusCfg = STATUS_CFG[appt.status] || STATUS_CFG.pending;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết lịch hẹn</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded border">
                <div>
                  <small className="text-muted d-block">Mã lịch hẹn</small>
                  <strong className="text-dark">{appt.id}</strong>
                </div>
                <div>
                  <span className="appt-status-badge px-3 py-2 fs-6" style={{ color: statusCfg.color, background: statusCfg.bg }}>
                    <statusCfg.icon className="me-2" /> {statusCfg.label}
                  </span>
                </div>
              </div>

              <div className="row g-4">
                {/* Patient Info */}
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-3 border-bottom pb-2"><FaUser className="me-2" />Thông tin bệnh nhân</h6>
                  <div className="mb-2">
                    <small className="text-muted d-block">Họ và tên</small>
                    <div className="fw-semibold">{appt.patientProfile?.fullName || "Chưa có thông tin"}</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Số điện thoại</small>
                    <div>{appt.patientProfile?.phoneNumber || "Chưa có SĐT"}</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Ngày sinh</small>
                    <div>{appt.patientProfile?.dob ? new Date(appt.patientProfile.dob).toLocaleDateString('vi-VN') : "Chưa có"}</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Giới tính</small>
                    <div className="text-capitalize">{appt.patientProfile?.gender || "Chưa có"}</div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-3 border-bottom pb-2"><FaUserMd className="me-2" />Thông tin bác sĩ</h6>
                  <div className="mb-2">
                    <small className="text-muted d-block">Tên bác sĩ</small>
                    <div className="fw-semibold">{appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Bệnh viện</small>
                    <div>{appt.hospital?.name}</div>
                    <div className="small text-muted">{appt.hospital?.address}, {appt.hospital?.city}</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Chuyên khoa</small>
                    <div>
                      {appt.doctor?.specialties?.map(s => s.specialty.name).join(', ') || "Chưa có"}
                    </div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-3 border-bottom pb-2"><FaCalendarAlt className="me-2" />Lịch khám và thanh toán</h6>
                  <div className="mb-2">
                    <small className="text-muted d-block">Ngày và giờ</small>
                    <div className="fw-semibold">
                      {formatDateTime(appt.timeSlot?.date, appt.timeSlot?.startTime, appt.timeSlot?.endTime)}
                    </div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Tổng tiền</small>
                    <div className="fw-bold text-success">{formatCurrency(appt.totalAmount)}</div>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-block">Trạng thái thanh toán</small>
                    <div className="text-capitalize fw-semibold">
                      {appt.paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="col-md-6">
                  <h6 className="fw-bold text-primary mb-3 border-bottom pb-2"><FaEdit className="me-2" />Thông tin bổ sung</h6>
                  <div className="mb-2">
                    <small className="text-muted d-block">Lý do khám</small>
                    <div className="p-2 bg-light rounded border">{appt.reason || "Không ghi rõ"}</div>
                  </div>
                  {appt.cancelReason && (
                    <div className="mb-2 mt-3">
                      <small className="text-danger d-block fw-semibold">Lý do hủy</small>
                      <div className="p-2 bg-danger-subtle text-danger rounded border border-danger">{appt.cancelReason}</div>
                    </div>
                  )}
                  <div className="mb-2 mt-3">
                    <small className="text-muted d-block">Ngày tạo</small>
                    <div>{appt.createdAt ? new Date(appt.createdAt).toLocaleString('vi-VN') : "Chưa có"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 justify-content-end">
              <button className="btn btn-light border px-4" onClick={onClose}>Đóng</button>
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
export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modals
  const [modal, setModal] = useState(null); // 'view' | 'status' | 'cancel'
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage + 1, // backend 1-indexed
        limit: PAGE_LIMIT,
      };

      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await appointmentService.adminGetAppointments(params);

      const respData = res.data?.data;

      if (Array.isArray(respData)) {
        setAppointments(respData);
        setTotalPages(res.data?.meta?.totalPages ?? 1);
        setTotalCount(res.data?.meta?.total ?? 0);
      } else {
        setAppointments(respData?.items || respData?.appointments || []);
        const metaObj = respData?.meta || respData?.pagination || res.data?.meta || {};
        setTotalPages(metaObj.totalPages ?? 1);
        setTotalCount(metaObj.totalItems ?? metaObj.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, filterStatus, fromDate, toDate]);

  // 2. Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(inputSearch);
    setCurrentPage(0);
  };

  const handleFilterChange = () => {
    setCurrentPage(0);
    // Filters are already tracked in state and trigger useEffect
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => {
    setModal(null);
    setSelectedAppt(null);
  };

  const openModal = (type, appt) => {
    setSelectedAppt(appt);
    setModal(type);
  };

  // 3. API Actions
  const handleSaveStatus = async (id, newStatus) => {
    setSaving(true);
    try {
      await appointmentService.adminUpdateAppointmentStatus(id, { status: newStatus });
      closeModal();
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error(err?.response?.data?.message || "Không thể cập nhật trạng thái.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmCancel = async (id, reason) => {
    setSaving(true);
    try {
      await appointmentService.adminCancelAppointment(id, { cancelReason: reason });
      closeModal();
      fetchAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      toast.error(err?.response?.data?.message || "Không thể hủy lịch hẹn.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-appts">
      {/* Header */}
      <div className="appts-header">
        <div>
          <h1 className="appts-title">Quản lý Lịch hẹn</h1>
          <p className="appts-sub">
            Quản lý toàn bộ lịch hẹn hệ thống, cập nhật trạng thái và hủy lịch.
          </p>
        </div>
        <div className="appts-header__right">
          <span className="appts-badge">
            <FaCalendarAlt /> {totalCount} lịch hẹn
          </span>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><FaSearch className="text-muted" /></span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Tìm kiếm bệnh nhân, bác sĩ..."
                  value={inputSearch}
                  onChange={e => setInputSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-3" style={{ backgroundColor: "#0ba3a3", borderColor: "#0ba3a3" }}>Tìm</button>
              </div>
            </form>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); handleFilterChange(); }}>
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">Khám từ</span>
              <input type="date" className="form-control" value={fromDate} onChange={(e) => { setFromDate(e.target.value); handleFilterChange(); }} />
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">Khám đến</span>
              <input type="date" className="form-control" value={toDate} onChange={(e) => { setToDate(e.target.value); handleFilterChange(); }} />
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="appts-list position-relative" style={{ minHeight: "200px" }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && appointments.length === 0 ? (
          <div className="appts-empty py-5 text-center text-muted">
            <FaCalendarAlt className="appts-empty__icon mb-3" style={{ fontSize: '3rem', opacity: 0.2 }} />
            <p className="mb-0 fs-5">Không tìm thấy lịch hẹn nào.</p>
            <span className="small">Vui lòng thay đổi bộ lọc tìm kiếm.</span>
          </div>
        ) : (
          appointments.map((appt) => (
            <AppointmentRow
              key={appt.id}
              appt={appt}
              onView={(a) => openModal("view", a)}
              onEditStatus={(a) => openModal("status", a)}
              onCancel={(a) => openModal("cancel", a)}
            />
          ))
        )}
      </div>

      <AppPagination
        pageCount={totalPages}
        currentPage={currentPage}
        total={totalCount}
        itemLabel="lịch hẹn"
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      <AppointmentViewModal
        appt={modal === "view" ? selectedAppt : null}
        onClose={closeModal}
      />
      {modal === "status" && (
        <StatusModal
          appt={selectedAppt}
          onSave={handleSaveStatus}
          onClose={closeModal}
          saving={saving}
        />
      )}
      {modal === "cancel" && (
        <CancelModal
          appt={selectedAppt}
          onConfirm={handleConfirmCancel}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </div>
  );
}
