import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  FaUserDoctor,
  FaHospital,
  FaClock,
  FaCalendarDays,
  FaUser,
  FaUsers,
  FaCircleCheck,
  FaStar,
  FaChevronRight,
  FaClipboardList,
  FaNotesMedical,
  FaArrowLeft,
  FaCircleXmark,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa6";
import { patientProfileService, appointmentService, paymentService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import "./UserBookingPage.scss";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";
const AI_BOOKING_REASON_KEY = "tkt_ai_booking_reason";

const RELATIONSHIP_LABELS = {
  self: "Bản thân",
  parent: "Bố / Mẹ",
  child: "Con",
  spouse: "Vợ / Chồng",
  sibling: "Anh / Chị / Em",
  other: "Khác",
};

function formatDob(dobStr) {
  if (!dobStr) return null;
  const d = new Date(dobStr);
  return d.toLocaleDateString("vi-VN");
}

function formatGender(g) {
  if (g === "male") return "Nam";
  if (g === "female") return "Nữ";
  return "Khác";
}

/* ── Payment Modal ──────────────────────────────────────── */
const PaymentModal = ({ onClose, appointmentId, onPayOnline, onPayAtCounter, isProcessingPayment }) => {
  return (
    <div className="ubp-modal-overlay" onClick={onClose}>
      <div className="ubp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ubp-modal-close" onClick={onClose}>
          <FaCircleXmark />
        </button>

        <div className="ubp-modal-icon">
          <FaCircleCheck />
        </div>
        <h2 className="ubp-modal-title">Đặt lịch thành công!</h2>
        <p className="ubp-modal-subtitle">Bạn muốn thanh toán bằng hình thức nào?</p>

        <div className="ubp-payment-options">
          <button
            className="ubp-payment-btn online"
            onClick={onPayOnline}
            disabled={isProcessingPayment}
          >
            <span className="ubp-payment-icon"><FaCreditCard /></span>
            <div className="ubp-payment-info">
              <span className="ubp-payment-label">
                {isProcessingPayment ? "Đang tạo link thanh toán..." : "Thanh toán online"}
              </span>
              <span className="ubp-payment-desc">Thanh toán an toàn qua VNPAY</span>
            </div>
            <FaChevronRight className="ubp-payment-arrow" />
          </button>

          <button
            className="ubp-payment-btn counter"
            onClick={onPayAtCounter}
            disabled={isProcessingPayment}
          >
            <span className="ubp-payment-icon"><FaMoneyBillWave /></span>
            <div className="ubp-payment-info">
              <span className="ubp-payment-label">Thanh toán tại quầy</span>
              <span className="ubp-payment-desc">Trả tiền trực tiếp sau khi khám xong</span>
            </div>
            <FaChevronRight className="ubp-payment-arrow" />
          </button>
        </div>

        <p className="ubp-modal-note">
          Mã lịch hẹn: <strong>#{appointmentId?.slice(0, 8).toUpperCase()}</strong>
        </p>
      </div>
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────── */
const UserBookingPage = () => {
  const { timeSlotId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const doctor = state?.doctor || null;

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [reason, setReason] = useState(
    state?.bookingReason || sessionStorage.getItem(AI_BOOKING_REASON_KEY) || ""
  );
  const [isProfilesLoading, setIsProfilesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdAppointmentId, setCreatedAppointmentId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch patient profiles
  useEffect(() => {
    patientProfileService
      .getProfiles()
      .then((res) => {
        const data = res.data?.data || [];
        setProfiles(data);
        const def = data.find((p) => p.isDefault);
        if (def) setSelectedProfileId(def.id);
        else if (data.length > 0) setSelectedProfileId(data[0].id);
      })
      .catch((err) => {
        console.error("Lỗi lấy hồ sơ bệnh nhân:", err);
      })
      .finally(() => setIsProfilesLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedProfileId || !timeSlotId) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await appointmentService.createAppointment({
        timeSlotId,
        patientProfileId: selectedProfileId,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      sessionStorage.removeItem(AI_BOOKING_REASON_KEY);
      const id = res.data?.data?.id || res.data?.id || null;
      setCreatedAppointmentId(id);
      setShowPaymentModal(true);
    } catch (err) {
      console.error("Lỗi đặt lịch:", err);
      const msg =
        err?.response?.data?.message || "Đặt lịch thất bại. Vui lòng thử lại.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayOnline = async () => {
    if (!createdAppointmentId) {
      toast.error("Không tìm thấy mã lịch hẹn để thanh toán.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await paymentService.createPaymentUrl({
        appointmentId: createdAppointmentId,
        provider: "vn_pay",
      });

      const payUrl = response.data?.payUrl;
      if (!payUrl) {
        throw new Error("Không nhận được link thanh toán từ hệ thống.");
      }

      window.location.href = payUrl;
    } catch (err) {
      console.error("Lỗi tạo link thanh toán:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tạo link thanh toán. Vui lòng thử lại."
      );
      setIsProcessingPayment(false);
    }
  };

  const handlePayAtCounter = async () => {
    if (!createdAppointmentId) {
      toast.error("Không tìm thấy mã lịch hẹn để ghi nhận thanh toán tại quầy.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      await paymentService.createPaymentUrl({
        appointmentId: createdAppointmentId,
        provider: "cash",
      });
      toast.success("Đặt lịch thành công. Bạn có thể thanh toán trực tiếp tại quầy.");
      setShowPaymentModal(false);
      navigate("/app/user/appointments");
    } catch (err) {
      console.error("Lỗi ghi nhận thanh toán tại quầy:", err);
      toast.error(
        err?.response?.data?.message ||
          "Không thể ghi nhận hình thức thanh toán tại quầy. Vui lòng thử lại."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Doctor derived values
  const fullName = doctor
    ? `${doctor.user?.lastName || ""} ${doctor.user?.firstName || ""}`.trim()
    : "";
  const avatar = doctor?.imgURL || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
  const primarySpecialty = doctor?.specialties?.find((s) => s.isPrimary)?.specialty;
  const hospitalInfo = doctor?.hospitals?.[0];
  const priceDisplay = doctor?.consultationFee
    ? doctor.consultationFee.toLocaleString("vi-VN") + "đ"
    : "Liên hệ";

  const canSubmit = !!selectedProfileId && !isSubmitting;

  return (
    <div className="ubp-container">
      {/* ── Header ── */}
      <div className="ubp-header">
        <button className="ubp-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          <span>Quay lại</span>
        </button>
        <h1 className="ubp-page-title">Xác nhận đặt lịch khám</h1>
      </div>

      <div className="ubp-layout">
        {/* ── LEFT COLUMN ── */}
        <div className="ubp-left">

          {/* Profile selector */}
          <section className="ubp-section">
            <div className="ubp-section-head">
              <FaUsers className="ubp-section-icon" />
              <h2>Hồ sơ bệnh nhân</h2>
            </div>

            {isProfilesLoading ? (
              <div className="ubp-profiles-loading"><LoadingSpinner /></div>
            ) : profiles.length === 0 ? (
              <div className="ubp-profiles-empty">
                <FaUser size={28} opacity={0.25} />
                <p>Bạn chưa có hồ sơ nào. Vui lòng tạo hồ sơ trước.</p>
              </div>
            ) : (
              <div className="ubp-profiles-list">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    className={`ubp-profile-card ${selectedProfileId === p.id ? "selected" : ""}`}
                    onClick={() => setSelectedProfileId(p.id)}
                  >
                    <div className="ubp-profile-avatar">
                      {(p.fullName?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="ubp-profile-details">
                      <div className="ubp-profile-name-row">
                        <span className="ubp-profile-name">{p.fullName}</span>
                        {p.isDefault && (
                          <span className="ubp-profile-default-badge">Mặc định</span>
                        )}
                      </div>
                      <div className="ubp-profile-meta">
                        <span>{formatGender(p.gender)}</span>
                        {p.dob && <span>·</span>}
                        {p.dob && <span>{formatDob(p.dob)}</span>}
                        {p.relationship && <span>·</span>}
                        {p.relationship && (
                          <span>{RELATIONSHIP_LABELS[p.relationship] || p.relationship}</span>
                        )}
                      </div>
                      {p.phoneNumber && (
                        <div className="ubp-profile-phone">{p.phoneNumber}</div>
                      )}
                    </div>
                    <div className="ubp-profile-check">
                      {selectedProfileId === p.id && <FaCircleCheck />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Reason */}
          <section className="ubp-section">
            <div className="ubp-section-head">
              <FaNotesMedical className="ubp-section-icon" />
              <h2>Lý do khám</h2>
              <span className="ubp-optional-tag">Không bắt buộc</span>
            </div>
            <textarea
              className="ubp-reason-textarea"
              placeholder="Mô tả triệu chứng hoặc lý do khám để bác sĩ chuẩn bị tốt hơn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="ubp-reason-count">{reason.length}/500</div>
          </section>

          {/* Submit error */}
          {submitError && (
            <div className="ubp-error-banner">
              <FaCircleXmark />
              <span>{submitError}</span>
            </div>
          )}

          {/* CTA */}
          <button
            className={`ubp-confirm-btn ${canSubmit ? "ready" : "disabled"}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isSubmitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
          </button>
        </div>

        {/* ── RIGHT COLUMN: summary ── */}
        <div className="ubp-right">
          <div className="ubp-summary-card">
            <div className="ubp-summary-title">Thông tin lịch khám</div>

            {/* Doctor */}
            {doctor ? (
              <div className="ubp-summary-doctor">
                <img src={avatar} alt={fullName} className="ubp-summary-avatar" />
                <div className="ubp-summary-doctor-info">
                  <div className="ubp-summary-doctor-name">
                    {fullName}
                    {doctor.isVerified && (
                      <FaCircleCheck className="ubp-verified-icon" title="Đã xác minh" />
                    )}
                  </div>
                  {primarySpecialty && (
                    <div className="ubp-summary-specialty">
                      <FaClipboardList />
                      <span>{primarySpecialty.name}</span>
                    </div>
                  )}
                  {(doctor.rating > 0 || doctor.totalReviews > 0) && (
                    <div className="ubp-summary-rating">
                      <FaStar className="ubp-summary-star" />
                      <strong>{doctor.rating}</strong>
                      <span className="ubp-summary-review-count">
                        ({doctor.totalReviews} đánh giá)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="ubp-summary-no-doctor">
                <FaUserDoctor size={24} opacity={0.3} />
                <span>Không có thông tin bác sĩ</span>
              </div>
            )}

            <div className="ubp-summary-divider" />

            {/* Slot info */}
            <div className="ubp-summary-rows">
              {hospitalInfo && (
                <div className="ubp-summary-row">
                  <FaHospital className="ubp-srow-icon" />
                  <div>
                    <div className="ubp-srow-label">Cơ sở khám</div>
                    <div className="ubp-srow-value">
                      {hospitalInfo.hospital.name}
                      {hospitalInfo.hospital.city && `, ${hospitalInfo.hospital.city}`}
                    </div>
                  </div>
                </div>
              )}

              {state?.slot && (
                <div className="ubp-summary-row">
                  <FaCalendarDays className="ubp-srow-icon" />
                  <div>
                    <div className="ubp-srow-label">Ngày khám</div>
                    <div className="ubp-srow-value">{state.slot.date || "—"}</div>
                  </div>
                </div>
              )}

              {state?.slot && (
                <div className="ubp-summary-row">
                  <FaClock className="ubp-srow-icon" />
                  <div>
                    <div className="ubp-srow-label">Giờ khám</div>
                    <div className="ubp-srow-value">
                      {state.slot.startTime} – {state.slot.endTime}
                    </div>
                  </div>
                </div>
              )}

              <div className="ubp-summary-row fee-row">
                <div className="ubp-srow-label">Phí khám</div>
                <div className="ubp-srow-value ubp-fee">{priceDisplay}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showPaymentModal && (
        <PaymentModal
          appointmentId={createdAppointmentId}
          isProcessingPayment={isProcessingPayment}
          onPayOnline={handlePayOnline}
          onPayAtCounter={handlePayAtCounter}
          onClose={() => {
            setShowPaymentModal(false);
            navigate("/app/user/appointments");
          }}
        />
      )}
    </div>
  );
};

export default UserBookingPage;
