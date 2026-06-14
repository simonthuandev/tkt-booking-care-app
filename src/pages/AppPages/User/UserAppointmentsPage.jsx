import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaBan,
  FaClock,
  FaCheckCircle,
  FaCheckDouble,
  FaTimesCircle,
  FaUserMd,
  FaHospital,
  FaStethoscope,
  FaMoneyBillWave,
  FaStar,
  FaCreditCard,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { appointmentService, paymentService, reviewService } from "../../../api/appService";
import AppPagination from "../../../components/Common/AppPagination";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import "./UserAppointmentsPage.scss";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LIMIT = 10;

const STATUS_CFG = {
  pending: { label: "Chờ xác nhận", color: "#f5a623", bg: "#fff8e6", icon: FaClock },
  confirmed: { label: "Đã xác nhận", color: "#0ba3a3", bg: "#e6f7f7", icon: FaCheckCircle },
  processing: { label: "Đang khám", color: "#3b82f6", bg: "#eff6ff", icon: FaStethoscope },
  completed: { label: "Hoàn thành", color: "#1a9e5c", bg: "#e6f9f0", icon: FaCheckDouble },
  cancelled: { label: "Đã hủy", color: "#e24b4a", bg: "#fef2f2", icon: FaTimesCircle },
  no_show: { label: "Không đến", color: "#6b7280", bg: "#f3f4f6", icon: FaBan },
};

const PAYMENT_STATUS_CFG = {
  pending: { label: "Chờ thanh toán", color: "#f5a623" },
  completed: { label: "Đã thanh toán", color: "#1a9e5c" },
  refunded: { label: "Đã hoàn tiền", color: "#6b7f8e" },
  failed: { label: "Lỗi thanh toán", color: "#e24b4a" },
};

const STATUS_TABS = [
  { key: "all", label: "Tất cả", statusVal: "" },
  { key: "pending", label: "Chờ xác nhận", statusVal: "pending" },
  { key: "confirmed", label: "Đã xác nhận", statusVal: "confirmed" },
  { key: "processing", label: "Đang khám", statusVal: "processing" },
  { key: "completed", label: "Hoàn thành", statusVal: "completed" },
  { key: "no_show", label: "Không đến", statusVal: "no_show" },
  { key: "cancelled", label: "Đã hủy", statusVal: "cancelled" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  if (amount == null) return "Miễn phí";
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
const AppointmentRow = ({ appt, onView, onCancel, onReview, onPay }) => {
  const statusCfg = STATUS_CFG[appt.status] || STATUS_CFG.pending;
  const StatusIcon = statusCfg.icon;

  const paymentStatus = PAYMENT_STATUS_CFG[appt.paymentStatus] || PAYMENT_STATUS_CFG.pending;
  const canReview = appt.status === "completed" && !appt.review;
  const canPay = appt.status === "pending" && ["pending", "failed"].includes(appt.paymentStatus);

  return (
    <div className="user-appt-row">
      <div className="user-appt-row__doctor">
        <p className="user-appt-row__name">
          <FaUserMd className="me-1 text-primary" /> {appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}
        </p>
        <p className="user-appt-row__hospital text-truncate" title={appt.hospital?.name}>
          <FaHospital className="me-1 text-muted" /> {appt.hospital?.name || "Chưa có thông tin"}
        </p>
      </div>

      <div className="user-appt-row__patient">
        <p className="user-appt-row__title">Hồ sơ khám</p>
        <p className="fw-semibold mb-0">{appt.patientProfile?.fullName || "Chưa có thông tin"}</p>
      </div>

      <div className="user-appt-row__datetime">
        <span className="fw-semibold text-dark">
          {appt.timeSlot?.startTime} - {appt.timeSlot?.endTime}
        </span>
        <span className="text-muted small">
          {appt.timeSlot?.date ? new Date(appt.timeSlot.date).toLocaleDateString("vi-VN") : "Chưa có"}
        </span>
      </div>

      <div className="user-appt-row__payment">
        <span className="fw-semibold">{formatCurrency(appt.totalAmount)}</span>
        <span className="small fw-semibold" style={{ color: paymentStatus.color }}>
          {paymentStatus.label}
        </span>
      </div>

      <div className="user-appt-row__status">
        <span
          className="user-appt-status-badge"
          style={{ color: statusCfg.color, background: statusCfg.bg }}
        >
          <StatusIcon /> {statusCfg.label}
        </span>
      </div>

      <div className="user-appt-row__actions">
        <button className="user-appt-btn user-appt-btn--view" onClick={() => onView(appt)} title="Xem chi tiết">
          <FaEye />
        </button>
        {/* Chỉ cho phép hủy nếu lịch đang ở trạng thái pending hoặc confirmed */}
        {(appt.status === 'pending' || appt.status === 'confirmed') && (
          <button className="user-appt-btn user-appt-btn--cancel" onClick={() => onCancel(appt)} title="Hủy lịch">
            <FaBan />
          </button>
        )}
        {canReview && (
          <button className="user-appt-btn user-appt-btn--view" onClick={() => onReview(appt)} title="Đánh giá">
            <FaStar />
          </button>
        )}
        {canPay && (
          <button className="user-appt-btn user-appt-btn--view" onClick={() => onPay(appt)} title="Thanh toán">
            <FaCreditCard />
          </button>
        )}
      </div>
    </div>
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
              <div className="alert alert-warning">
                Bạn có chắc chắn muốn hủy lịch hẹn khám với bác sĩ <strong>{appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}</strong> không?
              </div>
              <div className="mb-3">
                <label className="form-label">Lý do hủy (Không bắt buộc)</label>
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
                {saving ? "Đang xử lý..." : "Xác nhận Hủy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ReviewModal
// ─────────────────────────────────────────────────────────────────────────────
const ReviewModal = ({ appt, onConfirm, onClose, saving }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!appt) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-primary">Đánh giá buổi khám</h5>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>
            <div className="modal-body py-4">
              <div className="mb-3">
                <div className="fw-semibold">
                  {appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}
                </div>
                <div className="text-muted small">{appt.hospital?.name}</div>
              </div>

              <label className="form-label fw-semibold">Mức độ hài lòng</label>
              <div className="d-flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`btn ${value <= rating ? "btn-warning text-white" : "btn-outline-warning"}`}
                    onClick={() => setRating(value)}
                    disabled={saving}
                    aria-label={`${value} sao`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Bình luận</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Chia sẻ trải nghiệm khám bệnh của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={1000}
                  disabled={saving}
                />
                <div className="form-text text-end">{comment.length}/1000</div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light border" onClick={onClose} disabled={saving}>Đóng</button>
              <button
                className="btn btn-primary"
                onClick={() => onConfirm(appt.id, rating, comment)}
                disabled={saving}
              >
                {saving ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PaymentChoiceModal = ({ appt, onOnline, onCash, onClose, saving }) => {
  if (!appt) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={saving ? undefined : onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-primary">Chọn phương thức thanh toán</h5>
              <button className="btn-close" onClick={onClose} disabled={saving} />
            </div>
            <div className="modal-body py-4">
              <div className="mb-3">
                <div className="fw-semibold">
                  {appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}
                </div>
                <div className="text-muted small">{formatDateTime(appt.timeSlot?.date, appt.timeSlot?.startTime, appt.timeSlot?.endTime)}</div>
                <div className="fw-bold text-success mt-2">{formatCurrency(appt.totalAmount)}</div>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => onOnline(appt)} disabled={saving}>
                  <FaCreditCard className="me-2" />
                  {saving ? "Đang tạo link..." : "Thanh toán online qua VNPAY"}
                </button>
                <button className="btn btn-outline-success" onClick={() => onCash(appt)} disabled={saving}>
                  <FaMoneyBillWave className="me-2" />
                  Thanh toán tại quầy
                </button>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light border" onClick={onClose} disabled={saving}>Hủy</button>
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
  const paymentStatus = PAYMENT_STATUS_CFG[appt.paymentStatus] || PAYMENT_STATUS_CFG.pending;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
            <div className="modal-header bg-light border-bottom-0" style={{ borderRadius: '16px 16px 0 0' }}>
              <h5 className="modal-title fw-bold text-dark">Chi tiết lịch hẹn</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded border shadow-sm">
                <div>
                  <small className="text-muted d-block mb-1">Mã lịch hẹn</small>
                  <strong className="text-dark fs-5">#{appt.id.substring(0, 8).toUpperCase()}</strong>
                </div>
                <div className="text-end">
                  <span className="user-appt-status-badge px-3 py-2 fs-6 mb-2" style={{ color: statusCfg.color, background: statusCfg.bg }}>
                    <statusCfg.icon className="me-2" /> {statusCfg.label}
                  </span>
                  <div className="small fw-semibold mt-1" style={{ color: paymentStatus.color }}>
                    Thanh toán: {paymentStatus.label}
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* Patient Info */}
                <div className="col-md-6">
                  <div className="h-100 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2 d-flex align-items-center">
                      <FaStethoscope className="me-2" /> Hồ sơ bệnh nhân
                    </h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Họ và tên</small>
                      <div className="fw-semibold fs-6">{appt.patientProfile?.fullName || "Chưa có thông tin"}</div>
                    </div>
                    <div className="row">
                      <div className="col-6 mb-2">
                        <small className="text-muted d-block">Số điện thoại</small>
                        <div>{appt.patientProfile?.phoneNumber || "Chưa có SĐT"}</div>
                      </div>
                      <div className="col-6 mb-2">
                        <small className="text-muted d-block">Giới tính</small>
                        <div className="text-capitalize">{appt.patientProfile?.gender === 'male' ? 'Nam' : appt.patientProfile?.gender === 'female' ? 'Nữ' : 'Khác'}</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Ngày sinh</small>
                      <div>{appt.patientProfile?.dob ? new Date(appt.patientProfile.dob).toLocaleDateString('vi-VN') : "Chưa có"}</div>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="col-md-6">
                  <div className="h-100 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2 d-flex align-items-center">
                      <FaUserMd className="me-2" /> Thông tin bác sĩ
                    </h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Bác sĩ phụ trách</small>
                      <div className="fw-semibold fs-6">{appt.doctor?.user?.lastName} {appt.doctor?.user?.firstName}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Bệnh viện / Phòng khám</small>
                      <div className="fw-semibold">{appt.hospital?.name}</div>
                      <div className="small text-muted">{appt.hospital?.address}</div>
                    </div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="col-md-6">
                  <div className="h-100 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2 d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Lịch khám
                    </h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Thời gian</small>
                      <div className="fw-bold text-dark fs-6">
                        {formatDateTime(appt.timeSlot?.date, appt.timeSlot?.startTime, appt.timeSlot?.endTime)}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Tổng phí</small>
                      <div className="fw-bold text-success fs-5">{formatCurrency(appt.totalAmount)}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="col-md-6">
                  <div className="h-100 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2 d-flex align-items-center">
                      <FaMoneyBillWave className="me-2" /> Ghi chú & Khác
                    </h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Lý do khám</small>
                      <div className="p-2 bg-white rounded border">{appt.reason || "Không có ghi chú"}</div>
                    </div>
                    {appt.cancelReason && (
                      <div className="mb-2 mt-3">
                        <small className="text-danger d-block fw-semibold">Lý do hủy</small>
                        <div className="p-2 bg-danger-subtle text-danger rounded border border-danger">{appt.cancelReason}</div>
                      </div>
                    )}
                    <div className="mb-2 mt-3 text-end">
                      <small className="text-muted">Ngày tạo: {appt.createdAt ? new Date(appt.createdAt).toLocaleString('vi-VN') : "Chưa có"}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 justify-content-end bg-light" style={{ borderRadius: '0 0 16px 16px' }}>
              <button className="btn btn-secondary px-4 rounded-pill" onClick={onClose}>Đóng</button>
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
export default function UserAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");

  // Modals
  const [modal, setModal] = useState(null); // 'view' | 'cancel' | 'review' | 'payment'
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage + 1, // backend 1-indexed
        limit: PAGE_LIMIT,
      };

      if (filterStatus) params.status = filterStatus;

      const res = await appointmentService.getMyAppointments(params);

      // Handle backend response structure
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
      console.error("Failed to fetch user appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus]);

  // Handlers
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(0);
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

  const handleConfirmCancel = async (id, reason) => {
    setSaving(true);
    try {
      await appointmentService.cancelAppointment(id, { cancelReason: reason });
      toast.success("Hủy lịch thành công!");
      closeModal();
      fetchAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment", err);
      toast.error(err?.response?.data?.message || "Không thể hủy lịch. Vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmReview = async (appointmentId, rating, comment) => {
    setSaving(true);
    try {
      await reviewService.createReview({
        appointmentId,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      closeModal();
      fetchAppointments();
    } catch (err) {
      console.error("Failed to create review", err);
      toast.error(err?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  const handleOnlinePayment = async (appt) => {
    setSaving(true);
    try {
      const res = await paymentService.createPaymentUrl({
        appointmentId: appt.id,
        provider: "vn_pay",
      });
      const payUrl = res.data?.payUrl || res.data?.data?.payUrl;
      if (!payUrl) {
        throw new Error("Không nhận được link thanh toán");
      }
      window.location.href = payUrl;
    } catch (err) {
      console.error("Failed to create VNPAY payment", err);
      toast.error(err?.response?.data?.message || "Không thể tạo link thanh toán. Vui lòng thử lại.");
      setSaving(false);
    }
  };

  const handleCashPayment = async (appt) => {
    setSaving(true);
    try {
      await paymentService.createPaymentUrl({
        appointmentId: appt.id,
        provider: "cash",
      });
      toast.success("Đã chọn thanh toán tại quầy. Lịch hẹn đã được xác nhận.");
      closeModal();
      fetchAppointments();
    } catch (err) {
      console.error("Failed to choose cash payment", err);
      toast.error(err?.response?.data?.message || "Không thể chọn thanh toán tại quầy. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-appts-page">
      {/* Header */}
      <div className="user-appts-header">
        <div>
          <h1 className="user-appts-title">Quản lý lịch hẹn</h1>
          <p className="user-appts-sub">
            Theo dõi và quản lý lịch khám bệnh của bạn.
          </p>
        </div>
        <div className="user-appts-header__right">
          <span className="user-appts-badge bg-primary text-white px-3 py-2 rounded-pill">
            <FaCalendarAlt className="me-2" /> Tổng cộng: {totalCount}
          </span>
        </div>
      </div>

      <div className="user-appts-tabs">
        {STATUS_TABS.map(({ key, label, statusVal }) => (
          <button
            key={key}
            className={`user-appts-tabs__btn ${filterStatus === statusVal ? "user-appts-tabs__btn--active" : ""}`}
            onClick={() => handleFilterChange(statusVal)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="user-appts-list position-relative" style={{ minHeight: "300px" }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-3" style={{ backgroundColor: "rgba(255,255,255,0.8)", zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && appointments.length === 0 ? (
          <div className="user-appts-empty py-5 text-center text-muted bg-white rounded-3 shadow-sm border">
            <div className="mb-3 d-inline-flex justify-content-center align-items-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f8f9fa' }}>
              <FaCalendarAlt style={{ fontSize: '2.5rem', color: '#dee2e6' }} />
            </div>
            <p className="mb-1 fs-5 fw-semibold text-dark">Chưa có lịch hẹn nào</p>
            <span className="small">Hãy đặt lịch khám để trải nghiệm dịch vụ của chúng tôi.</span>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {appointments.map((appt) => (
              <AppointmentRow
                key={appt.id}
                appt={appt}
                onView={(a) => openModal("view", a)}
                onCancel={(a) => openModal("cancel", a)}
                onReview={(a) => openModal("review", a)}
                onPay={(a) => openModal("payment", a)}
              />
            ))}
          </div>
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
      <CancelModal
        appt={modal === "cancel" ? selectedAppt : null}
        onConfirm={handleConfirmCancel}
        onClose={closeModal}
        saving={saving}
      />
      {modal === "review" && (
        <ReviewModal
          appt={selectedAppt}
          onConfirm={handleConfirmReview}
          onClose={closeModal}
          saving={saving}
        />
      )}
      {modal === "payment" && (
        <PaymentChoiceModal
          appt={selectedAppt}
          onOnline={handleOnlinePayment}
          onCash={handleCashPayment}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </div>
  );
}
