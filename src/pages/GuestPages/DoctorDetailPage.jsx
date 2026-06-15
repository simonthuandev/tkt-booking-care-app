import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaStar,
  FaHospital,
  FaClipboardList,
  FaCircleCheck,
  FaClock,
  FaCalendarDays,
  FaChevronLeft,
  FaChevronRight,
  FaUserDoctor,
  FaQuoteLeft,
} from "react-icons/fa6";
import { doctorService, timeSlotService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StarRating from "../../components/Common/StarRating";
import "./DoctorDetailPage.scss";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";
const AI_BOOKING_REASON_KEY = "tkt_ai_booking_reason";

const DAYS_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DAYS_SHORT = { MON: "T2", TUE: "T3", WED: "T4", THU: "T5", FRI: "T6", SAT: "T7", SUN: "CN" };

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  const dayName = DAYS_VI[d.getDay()];
  const ddmm = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (diff === 0) return { top: "Hôm nay", bottom: ddmm, dayName };
  if (diff === 1) return { top: "Ngày mai", bottom: ddmm, dayName };
  return { top: dayName, bottom: ddmm, dayName };
}

function buildNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    days.push(`${yyyy}-${mm}-${dd}`);
  }
  return days;
}

const DoctorDetailPage = () => {
  const { doctorSlug } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slot state
  const [selectedDate, setSelectedDate] = useState(buildNext7Days()[0]);
  const [slots, setSlots] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dateOffset, setDateOffset] = useState(0); // for scrolling date strip

  const dates = buildNext7Days();
  const visibleDates = dates.slice(dateOffset, dateOffset + 5);

  // Fetch doctor detail
  useEffect(() => {
    setIsLoading(true);
    doctorService
      .doctorDetail(doctorSlug)
      .then((res) => {
        setDoctor(res.data?.data || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy thông tin bác sĩ:", err);
        setError("Không thể tải thông tin bác sĩ.");
        setIsLoading(false);
      });
  }, [doctorSlug]);

  // Fetch slots when doctor loaded or date changes
  useEffect(() => {
    if (!doctor) return;
    setIsSlotsLoading(true);
    setSelectedSlot(null);
    timeSlotService
      .getTimeSlots({ doctorId: doctor.id, date: selectedDate })
      .then((res) => {
        const dateData = res.data?.data?.dates?.find((d) => d.date === selectedDate);
        setSlots(dateData?.slots || []);
        setIsSlotsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy slot:", err);
        setSlots([]);
        setIsSlotsLoading(false);
      });
  }, [doctor, selectedDate]);

  const handleBook = () => {
    if (!selectedSlot) return;
    const bookingReason = sessionStorage.getItem(AI_BOOKING_REASON_KEY) || "";
    navigate(`/app/user/booking/${selectedSlot.id}`, {
      state: { doctor, bookingReason },
    });
  };

  if (isLoading) return <div className="ddp-loading-wrap"><LoadingSpinner /></div>;
  if (error || !doctor) return (
    <div className="ddp-error">
      <FaUserDoctor size={48} />
      <p>{error || "Không tìm thấy bác sĩ."}</p>
    </div>
  );

  const fullName = `${doctor.user?.lastName || ""} ${doctor.user?.firstName || ""}`.trim();
  const avatar = doctor.imgURL || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
  const primarySpecialty = doctor.specialties?.find((s) => s.isPrimary)?.specialty;
  const hospitalInfo = doctor.hospitals?.[0];
  const workingDaysArr = hospitalInfo?.workingDays
    ? hospitalInfo.workingDays.split(",").map((d) => DAYS_SHORT[d.trim()] || d)
    : [];
  const priceDisplay = doctor.consultationFee
    ? doctor.consultationFee.toLocaleString("vi-VN") + "đ"
    : "Liên hệ";
  const selectedDateLabel = formatDateLabel(selectedDate);

  return (
    <div className="ddp-container">
      {/* ── TOP CARD ─────────────────────────────── */}
      <div className="ddp-top-card">
        {/* Left: avatar + identity */}
        <div className="ddp-identity">
          <div className="ddp-avatar-wrap">
            <img src={avatar} alt={fullName} className="ddp-avatar" />
            {doctor.isVerified && (
              <span className="ddp-verified-badge" title="Đã xác minh">
                <FaCircleCheck />
              </span>
            )}
          </div>
          <div className="ddp-identity-info">
            <h1 className="ddp-name">{fullName}</h1>
            <div className="ddp-tags">
              {primarySpecialty && (
                <span className="ddp-tag specialty">
                  <FaClipboardList /> {primarySpecialty.name}
                </span>
              )}
              {doctor.experience && (
                <span className="ddp-tag exp">{doctor.experience} năm kinh nghiệm</span>
              )}
              {doctor.licenseNumber && (
                <span className="ddp-tag license">CC: {doctor.licenseNumber}</span>
              )}
            </div>
            {hospitalInfo && (
              <div className="ddp-hospital-row">
                <FaHospital className="ddp-icon" />
                <span>
                  {hospitalInfo.hospital.name}, {hospitalInfo.hospital.city}
                </span>
              </div>
            )}
            {hospitalInfo && (
              <div className="ddp-schedule-row">
                <FaClock className="ddp-icon" />
                <span>
                  {hospitalInfo.startTime} – {hospitalInfo.endTime}
                  {workingDaysArr.length > 0 && (
                    <span className="ddp-working-days">
                      &nbsp;({workingDaysArr.join(", ")})
                    </span>
                  )}
                </span>
              </div>
            )}
            {(doctor.rating > 0 || doctor.totalReviews > 0) && (
              <div className="ddp-rating-row">
                <StarRating
                  rating={doctor.rating}
                  showValue
                  reviewCount={doctor.totalReviews}
                  size={14}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: price + slot picker */}
        <div className="ddp-booking-panel">
          <div className="ddp-price-block">
            <span className="ddp-price">{priceDisplay}</span>
            <span className="ddp-price-label">Phí khám</span>
          </div>

          {/* Date strip */}
          <div className="ddp-date-section">
            <div className="ddp-date-header">
              <FaCalendarDays className="ddp-icon" />
              <span>Chọn ngày khám</span>
            </div>
            <div className="ddp-date-strip">
              <button
                className="ddp-date-nav"
                onClick={() => setDateOffset((o) => Math.max(0, o - 1))}
                disabled={dateOffset === 0}
              >
                <FaChevronLeft />
              </button>
              <div className="ddp-date-list">
                {visibleDates.map((d) => {
                  const lbl = formatDateLabel(d);
                  return (
                    <button
                      key={d}
                      className={`ddp-date-btn ${selectedDate === d ? "active" : ""}`}
                      onClick={() => setSelectedDate(d)}
                    >
                      <span className="ddp-date-top">{lbl.top}</span>
                      <span className="ddp-date-bottom">{lbl.bottom}</span>
                    </button>
                  );
                })}
              </div>
              <button
                className="ddp-date-nav"
                onClick={() => setDateOffset((o) => Math.min(dates.length - 5, o + 1))}
                disabled={dateOffset >= dates.length - 5}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Slots */}
          <div className="ddp-slots-section">
            <div className="ddp-slots-label">
              Slot khả dụng —{" "}
              <strong>{selectedDateLabel.top === "Hôm nay" || selectedDateLabel.top === "Ngày mai"
                ? `${selectedDateLabel.top} (${selectedDateLabel.bottom})`
                : `${selectedDateLabel.top}, ${selectedDateLabel.bottom}`}</strong>
            </div>
            {isSlotsLoading ? (
              <div className="ddp-slots-loading">Đang tải...</div>
            ) : slots.length === 0 ? (
              <div className="ddp-slots-empty">Không còn slot trống cho ngày này.</div>
            ) : (
              <div className="ddp-slots-grid">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`ddp-slot-btn ${selectedSlot?.id === slot.id ? "active" : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`ddp-book-btn ${selectedSlot ? "ready" : "disabled"}`}
            onClick={handleBook}
            disabled={!selectedSlot}
          >
            {selectedSlot
              ? `Đặt lịch lúc ${selectedSlot.startTime} – ${selectedSlot.endTime}`
              : "Chọn slot để đặt lịch"}
          </button>
        </div>
      </div>

      {/* ── INFORMATION & TREATMENT ──────────────── */}
      {(doctor.information?.length > 0 || doctor.treatment?.length > 0) && (
        <div className="ddp-detail-grid">
          {doctor.information?.length > 0 && (
            <div className="ddp-detail-block">
              <h2 className="ddp-section-title">Giới thiệu</h2>
              <ul className="ddp-detail-list">
                {doctor.information.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {doctor.treatment?.length > 0 && (
            <div className="ddp-detail-block">
              <h2 className="ddp-section-title">Phạm vi điều trị</h2>
              <ul className="ddp-detail-list">
                {doctor.treatment.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── REVIEWS ──────────────────────────────── */}
      <div className="ddp-reviews-section">
        <h2 className="ddp-section-title">
          Đánh giá từ bệnh nhân
          {doctor.totalReviews > 0 && (
            <span className="ddp-reviews-count">{doctor.totalReviews} đánh giá</span>
          )}
        </h2>

        {doctor.reviews?.length === 0 ? (
          <div className="ddp-reviews-empty">
            <FaStar size={32} opacity={0.2} />
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="ddp-reviews-grid">
            {doctor.reviews.map((review) => (
              <div key={review.id} className="ddp-review-card">
                <div className="ddp-review-header">
                  <div className="ddp-review-avatar">
                    {(review.patientProfile?.fullName?.[0] || "?").toUpperCase()}
                  </div>
                  <div className="ddp-review-meta">
                    <span className="ddp-review-name">
                      {review.patientProfile?.fullName || "Ẩn danh"}
                    </span>
                    <span className="ddp-review-date">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <StarRating
                    rating={review.rating}
                    className="ddp-review-stars"
                    size={14}
                  />
                </div>
                {review.comment && (
                  <div className="ddp-review-body">
                    <FaQuoteLeft className="ddp-quote-icon" />
                    <p>{review.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetailPage;
