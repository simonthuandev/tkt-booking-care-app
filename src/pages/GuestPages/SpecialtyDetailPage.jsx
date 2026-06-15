import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { specialtyService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import StarRating from "../../components/Common/StarRating";
import "./SpecialtyDetailPage.scss";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0ba3a3&color=fff&size=200&name=";

const SpecialtyDetailPage = () => {
  const { specialtySlug } = useParams();
  const [specialtyData, setSpecialtyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    specialtyService.specialtyDetail(specialtySlug)
      .then((res) => {
        if (!isMounted) return;
        setSpecialtyData(res.data?.data || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết chuyên khoa:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Không thể tải thông tin chuyên khoa");
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [specialtySlug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !specialtyData) {
    return (
      <div className="container p-5 text-center">
        <h3 className="text-danger">Không tìm thấy thông tin chuyên khoa</h3>
        <p className="text-muted">{error || "Đường dẫn không hợp lệ hoặc dữ liệu chuyên khoa không tồn tại."}</p>
        <Link to="/specialties" className="btn btn-primary mt-3">Quay lại danh sách chuyên khoa</Link>
      </div>
    );
  }

  const name = specialtyData.name || "chưa có thông tin";
  const description = specialtyData.description || "chưa có thông tin";
  const logoUrl = specialtyData.imgURL;

  const apiDoctors = (specialtyData.doctors || []).map((item, idx) => {
    const doc  = item.doctor || {};
    const user = doc.user   || {};
    const fullName = `${user.lastName || ""} ${user.firstName || ""}`.trim() || "Chưa cập nhật";
    const avatar = doc.imgURL || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
    const hospitalName = doc.hospitals?.[0]?.hospital?.name || "Chưa cập nhật";
    const experience   = doc.experience !== undefined ? `${doc.experience} năm` : "Chưa cập nhật";
    const rating = doc?.rating ?? 0;
    const totalReviews = doc?.totalReviews ?? 0;
    return {
      id:         doc.id   || idx,
      slug:       doc.slug || null,
      img:        avatar,
      name:       fullName,
      spec:       specialtyData.name || "Chưa cập nhật",
      hospital:   hospitalName,
      experience: experience,
      rating:     rating,
      totalReviews,
    };
  });

  return (
    <>
      <div
        className="specialty-header d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: logoUrl ? `url(${logoUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#f5f5f5",
          minHeight: "200px"
        }}
      >
        <form className="hospital-info-form">
          <div className="specialty-detail-info">
            <h1 className="fw-bold mb-2">{name}</h1>
            <p className="fw-bold mt-3">Mô tả chuyên khoa:</p>
            <p className="mb-3 text-justify">{description}</p>

            <p className="fw-bold mt-4">Thông tin tham khảo:</p>
            {specialtyData.information && Array.isArray(specialtyData.information) && specialtyData.information.length > 0 ? (
              <ul>
                {specialtyData.information.map((item, index) => (
                  <li key={index}> {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Chưa có thông tin</p>
            )}

            <p className="fw-bold mt-3">Các bệnh lý thường gặp:</p>
            {specialtyData.diseases && Array.isArray(specialtyData.diseases) ? (
              <ul>
                {specialtyData.diseases.map((item, index) => (
                  <li key={index}> {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">chưa có thông tin</p>
            )}
          </div>
        </form>
      </div>

      <div className="specialty doctors-page-container">
        <div className="specialty-doctors-list d-flex flex-column gap-2">
          {apiDoctors.length > 0 ? (
            apiDoctors.map(({ id, slug, img, name, spec, hospital, experience, rating, totalReviews }) => (
              <div
                key={id}
                className="doctor-item d-flex align-items-center gap-4 p-4 border-bottom"
              >
                {/* Avatar — luôn có do fallback ui-avatars */}
                <img
                  src={img}
                  alt={name}
                  className="rounded flex-shrink-0"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  onError={(e) => { e.currentTarget.src = `${DEFAULT_AVATAR}${encodeURIComponent(name)}`; }}
                />
                <div className="d-flex flex-column gap-2 flex-grow-1">
                  <div className="fw-bold">{name}</div>
                  <div className="fw-bold text-info small">{spec} | {hospital}</div>
                  <ul className="overflow-hidden mb-0">
                    <li className="text-secondary small">Kinh nghiệm: {experience}</li>
                    <li className="text-secondary small d-inline-flex align-items-center justify-content-between gap-1">
                      Đánh giá:
                      <StarRating rating={rating} showValue reviewCount={totalReviews} size={13} />
                    </li>
                  </ul>
                </div>
                <Link
                  to={slug ? `/doctors/${slug}` : "#"}
                  className="btn-book-doc btn btn-rounded flex-shrink-0"
                >
                  Đặt lịch
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center p-5 text-muted">
              Chưa có danh sách bác sĩ (chưa có thông tin)
            </div>
          )}
        </div>
      </div >
    </>
  );
};

export default SpecialtyDetailPage;
