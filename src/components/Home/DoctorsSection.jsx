import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import SectionHeader from "../Common/SectionHeader";
import { FaArrowRight, FaClipboardList, FaHospital } from "react-icons/fa";
import { BsPersonHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { doctorService } from "../../api/appService";
import StarRating from "../Common/StarRating";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    doctorService
      .doctors({ page: 1, limit: 4 })
      .then((res) => {
        if (!isMounted) return;
        setDoctors(res.data?.data?.slice(0, 4) || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bác sĩ:", err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section-pad" id="doctors">
      <Container>
        <SectionHeader
          tag="Bác sĩ nổi bật" tagIcon={<BsPersonHeart />}
          title="Đội ngũ" titleEm="chuyên gia hàng đầu"
          sub="Được lựa chọn kỹ càng từ các bệnh viện uy tín nhất cả nước"
        />
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map((doctor) => {
              const { id, slug, user, specialties, hospitals, rating, totalReviews, consultationFee, imgURL } = doctor;
              const fullName = `${user?.lastName || ""} ${user?.firstName || ""}`.trim();
              const avatar = imgURL || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
              const primarySpecialty =
                specialties?.find((s) => s.isPrimary)?.specialty?.name || "Không có thông tin";
              const hospitalInfo = hospitals?.[0]?.hospital;
              const hospitalDisplay = hospitalInfo
                ? `${hospitalInfo.name}, ${hospitalInfo.city}`
                : "Không có thông tin";
              const priceDisplay = consultationFee
                ? `${consultationFee.toLocaleString("vi-VN")}đ`
                : "Không có thông tin";

              return (
                <div key={id} className="col-sm-6 col-lg-3">
                  <div className="doc-card">
                    <div className="doc-img-wrap">
                      <img src={avatar} alt={fullName} />
                      {/* <div className="doc-avail available">
                        Còn lịch hôm nay
                      </div> */}
                    </div>
                    <div className="doc-body">
                      <div className="doc-name">{fullName}</div>
                      <div className="doc-spec">
                        <FaClipboardList className="me-1" />{primarySpecialty}
                      </div>
                      <div className="doc-hospital">
                        <FaHospital className="me-1" />{hospitalDisplay}
                      </div>
                      <div className="doc-rating">
                        <StarRating rating={rating} showValue reviewCount={totalReviews} size={12} />
                      </div>
                      <div className="doc-price-row">
                        <span className="doc-price">{priceDisplay}</span>
                        <button className="btn-book-doc">
                          <Link to={`/doctors/${slug}`}>
                            Xem bác sĩ
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-5">
          <Link to="/doctors" className="btn-outline-main">
            Xem tất cả bác sĩ
            <FaArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  );
}
