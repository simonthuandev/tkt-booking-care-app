import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight, FaClipboardList, FaHospital, FaStar } from "react-icons/fa6";
import StarRating from "../../components/Common/StarRating";
import { Link } from "react-router";
import { doctorService } from "../../api/appService";
import "./DoctorsPage.scss";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";
const PAGE_LIMIT = 12;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(0); // react-paginate dùng 0-indexed
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    doctorService
      .doctors({ page: currentPage + 1, limit: PAGE_LIMIT })
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || [];
        const metaInfo = res.data?.meta || {};
        setDoctors(data);
        setMeta(metaInfo);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách bác sĩ:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="doctors-page-container">
        {/* Header Info */}
        <div className="doctors-page-header">
          <h1 className="doctors-page-title">
            Đội ngũ <span className="highlight">chuyên gia</span>
          </h1>
          <p className="doctors-page-sub">
            {isLoading
              ? "Đang tải..."
              : `Tìm thấy ${meta.total || 0} bác sĩ chuyên khoa`}
          </p>
        </div>

        {/* Doctors List */}
        {isLoading ? (
          <div className="doctors-loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="doctor-item-skeleton" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="doctors-empty">
            <FaStar size={48} className="empty-icon" />
            <p>Không tìm thấy bác sĩ nào.</p>
          </div>
        ) : (
          <div className="doctors-list">
            {doctors.map((doctor) => {
              const { id, slug, user, specialties, hospitals, rating, totalReviews, consultationFee, experience } = doctor;
              const fullName = `${user?.lastName || ""} ${user?.firstName || ""}`.trim();
              const avatar = user?.avatar
                ? user.avatar
                : `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
              const primarySpecialty =
                specialties?.find((s) => s.isPrimary)?.specialty?.name ||
                specialties?.[0]?.specialty?.name ||
                "Không có thông tin";
              const hospitalInfo = hospitals?.[0]?.hospital;
              const hospitalDisplay = hospitalInfo
                ? `${hospitalInfo.name}, ${hospitalInfo.city}`
                : "Không có thông tin";
              const priceDisplay = consultationFee
                ? `${consultationFee.toLocaleString("vi-VN")}đ`
                : "Liên hệ";
              const workingDays = hospitals?.[0]?.workingDays;
              const startTime = hospitals?.[0]?.startTime;
              const endTime = hospitals?.[0]?.endTime;

              return (
                <div key={id} className="doctor-item">
                  <div className="doctor-item-avatar-wrap">
                    <img src={avatar} alt={fullName} className="doctor-item-avatar" />
                    <span className="doctor-item-badge available">Còn lịch</span>
                  </div>
                  <div className="doctor-item-info">
                    <div className="doctor-item-name">{fullName}</div>
                    <div className="doctor-item-meta-row">
                      <span className="doctor-item-spec">
                        <FaClipboardList className="icon" /> {primarySpecialty}
                      </span>
                      <span className="doctor-item-hospital">
                        <FaHospital className="icon" /> {hospitalDisplay}
                      </span>
                    </div>
                    {(startTime || endTime) && (
                      <div className="doctor-item-schedule">
                        🕐 {startTime} – {endTime}
                        {workingDays && (
                          <span className="working-days ms-2">
                            ({workingDays.split(",").join(", ")})
                          </span>
                        )}
                      </div>
                    )}
                    <div className="doctor-item-footer">
                      <div className="doctor-item-rating">
                        <StarRating rating={rating || 0} half={!Number.isInteger(rating || 0)} />
                        <span className="rating-text">
                          {rating ? rating.toFixed(1) : "Chưa có"} ({totalReviews || 0} đánh giá)
                        </span>
                      </div>
                      {experience && (
                        <span className="doctor-item-exp">{experience} năm KN</span>
                      )}
                    </div>
                  </div>
                  <div className="doctor-item-right">
                    <div className="doctor-item-price">{priceDisplay}</div>
                    <div className="doctor-item-price-label">Phí khám</div>
                    <Link to={`/doctors/${slug}`} className="btn-view-doctor">
                      Xem bác sĩ
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && meta.totalPages > 1 && (
          <div className="doctors-pagination-wrap">
            <ReactPaginate
              pageCount={meta.totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={currentPage}
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              breakLabel="..."
              containerClassName="doctors-pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item page-prev"
              previousLinkClassName="page-link"
              nextClassName="page-item page-next"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
              disabledClassName="disabled"
            />
            <div className="pagination-info">
              Trang {currentPage + 1} / {meta.totalPages} &nbsp;·&nbsp; Tổng {meta.total} bác sĩ
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorsPage;
