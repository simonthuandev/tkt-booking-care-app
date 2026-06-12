import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  FaCalendarDays,
  FaClock,
  FaHospital,
  FaLocationDot,
  FaRegCommentDots,
  FaUserDoctor,
} from "react-icons/fa6";
import { hospitalService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StarRating from "../../components/Common/StarRating";
import "./HospitalDetailPage.scss";

const FALLBACK_HOSPITAL_IMAGE =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=85";
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";

const DAYS_SHORT = {
  MON: "T2",
  TUE: "T3",
  WED: "T4",
  THU: "T5",
  FRI: "T6",
  SAT: "T7",
  SUN: "CN",
};

const getHospitalTypeLabel = (type) => (type === "private" ? "Tư nhân" : "Công lập");

const formatDoctorName = (doctor) => {
  const fullName = `${doctor?.user?.lastName || ""} ${doctor?.user?.firstName || ""}`.trim();
  return fullName || "Bác sĩ chưa cập nhật tên";
};

const formatReviewDoctorName = (doctor) => {
  const fullName = `${doctor?.user?.lastName || ""} ${doctor?.user?.firstName || ""}`.trim();
  return fullName || "Bác sĩ";
};

const formatWorkingDays = (workingDays) => {
  if (!workingDays) return "";
  return workingDays
    .split(",")
    .map((day) => DAYS_SHORT[day.trim()] || day.trim())
    .filter(Boolean)
    .join(", ");
};

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const HospitalDetailPage = () => {
  const { hospitalSlug } = useParams();
  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    hospitalService
      .hospitalDetail(hospitalSlug)
      .then((res) => {
        if (!isMounted) return;
        setHospital(res.data?.data || null);
        setError("");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết bệnh viện:", err);
        const message = err.response?.data?.message || "Không thể tải thông tin bệnh viện.";
        toast.error(message);
        if (!isMounted) return;
        setError(message);
        setHospital(null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hospitalSlug]);

  if (isLoading) {
    return (
      <div className="hospital-detail-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="hospital-detail-error">
        <FaHospital />
        <h1>Không tìm thấy bệnh viện</h1>
        <p>{error || "Bệnh viện này không tồn tại hoặc hiện không hoạt động."}</p>
        <Link to="/hospitals" className="hospital-detail-back">
          Xem danh sách bệnh viện
        </Link>
      </div>
    );
  }

  const {
    name,
    address,
    city,
    type,
    imgURL,
    description,
    doctors = [],
    reviews = [],
  } = hospital;

  return (
    <main className="hospital-detail-page">
      <section
        className="hospital-detail-hero"
        style={{ backgroundImage: `url(${imgURL || FALLBACK_HOSPITAL_IMAGE})` }}
      >
        <div className="hospital-detail-hero-overlay" />
        <div className="hospital-detail-summary">
          <span className={`hospital-detail-type ${type || "public"}`}>
            {getHospitalTypeLabel(type)}
          </span>
          <h1>{name}</h1>
          <div className="hospital-detail-address">
            <FaLocationDot />
            <span>{address || city || "Chưa cập nhật địa chỉ"}</span>
          </div>
          {city && (
            <div className="hospital-detail-city">
              <FaHospital />
              <span>{city}</span>
            </div>
          )}
          {description && <p className="hospital-detail-description">{description}</p>}
        </div>
      </section>

      <section className="hospital-detail-content">
        <div className="hospital-detail-main">
          <div className="hospital-section-heading">
            <div>
              <span className="section-kicker">Đội ngũ chuyên môn</span>
              <h2>Bác sĩ đang làm việc tại bệnh viện</h2>
            </div>
            <span className="section-count">{doctors.length} bác sĩ</span>
          </div>

          <div className="hospital-detail-doctors">
            {doctors.length > 0 ? (
              doctors.map((item) => {
                const doctor = item.doctor || {};
                const fullName = formatDoctorName(doctor);
                const avatar =
                  doctor.imgURL ||
                  doctor.user?.avatar ||
                  `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
                const primarySpecialty = doctor.specialties?.[0]?.specialty?.name;
                const workingDays = formatWorkingDays(item.workingDays);
                const priceDisplay = doctor.consultationFee
                  ? `${doctor.consultationFee.toLocaleString("vi-VN")}đ`
                  : "Liên hệ";

                return (
                  <article key={doctor.id || doctor.slug || fullName} className="hospital-doctor-card">
                    <div className="hospital-doctor-avatar">
                      <img src={avatar} alt={fullName} />
                    </div>
                    <div className="hospital-doctor-info">
                      <h3>{fullName}</h3>
                      <div className="hospital-doctor-tags">
                        {primarySpecialty && (
                          <span>
                            <FaUserDoctor />
                            {primarySpecialty}
                          </span>
                        )}
                        {doctor.experience && <span>{doctor.experience} năm kinh nghiệm</span>}
                      </div>
                      <div className="hospital-doctor-schedule">
                        {(item.startTime || item.endTime) && (
                          <span>
                            <FaClock />
                            {item.startTime || "--:--"} - {item.endTime || "--:--"}
                          </span>
                        )}
                        {workingDays && (
                          <span>
                            <FaCalendarDays />
                            {workingDays}
                          </span>
                        )}
                      </div>
                      <div className="hospital-doctor-rating">
                        <StarRating
                          rating={doctor.rating || 0}
                          showValue
                          reviewCount={doctor.totalReviews || 0}
                          size={13}
                        />
                      </div>
                    </div>
                    <div className="hospital-doctor-action">
                      <div className="hospital-doctor-price">{priceDisplay}</div>
                      <span>Phí khám</span>
                      {doctor.slug && (
                        <Link to={`/doctors/${doctor.slug}`} className="hospital-doctor-link">
                          Xem bác sĩ
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="hospital-empty-box">
                <FaUserDoctor />
                <p>Bệnh viện này chưa có bác sĩ được hiển thị.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="hospital-detail-reviews">
          <div className="hospital-section-heading compact">
            <div>
              <span className="section-kicker">Đánh giá gần đây</span>
              <h2>Nhận xét từ bệnh nhân</h2>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="hospital-review-list">
              {reviews.map((review) => (
                <article key={review.id} className="hospital-review-card">
                  <div className="hospital-review-top">
                    <strong>{review.patientProfile?.fullName || "Người dùng ẩn danh"}</strong>
                    <StarRating rating={review.rating || 0} showValue size={13} />
                  </div>
                  {review.comment && <p>{review.comment}</p>}
                  <div className="hospital-review-meta">
                    <span>Với {formatReviewDoctorName(review.doctor)}</span>
                    {review.createdAt && <span>{formatDate(review.createdAt)}</span>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="hospital-empty-box review-empty">
              <FaRegCommentDots />
              <p>Chưa có đánh giá.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default HospitalDetailPage;
