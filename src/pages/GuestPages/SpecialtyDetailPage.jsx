import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { toSlug } from "../../utils/helpers";
import { specialtyService } from "../../api/appService";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

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
  const logoUrl = specialtyData.icon; // assuming backend returns image or logo

  const apiDoctors = (specialtyData.doctors || []).map((item, idx) => {
    const doc = item.doctor || {};
    const user = doc.user || {};
    const fullName = user.firstName || user.lastName ? `${user.lastName || ''} ${user.firstName || ''}`.trim() : "chưa có thông tin";
    const avatar = user.avatar || "";
    const hospitalName = doc.hospitals?.[0]?.hospital?.name || "chưa có thông tin";
    const experience = doc.experience !== undefined ? `${doc.experience} năm` : "chưa có thông tin";
    return {
      id: doc.id || idx,
      img: avatar,
      name: fullName,
      spec: specialtyData.name || "chưa có thông tin",
      hospital: hospitalName,
      experience: experience,
      bio: doc.bio || "chưa có thông tin",
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
        <form className="hospital-info-form d-flex align-items-center gap-4">
          <div className="flex-grow-1">
            <h1 className="fw-bold mb-2">{name}</h1>
            <p className="fw-bold mt-3">Mô tả chuyên khoa:</p>
            <p className="mb-3 text-justify">{description}</p>

            <p className="fw-bold mt-4">Thông tin tham khảo:</p>
            {specialtyData.info && Array.isArray(specialtyData.info) ? (
              <ul>
                {specialtyData.info.map((item, index) => (
                  <li key={index}> {item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">chưa có thông tin</p>
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

      <div className="specialty doctors-page-container p-5">
        <div className="d-flex flex-column">
          {apiDoctors.length > 0 ? (
            apiDoctors.map(({ id, img, name, spec, hospital, experience, bio }) => (
              <div
                key={id}
                className="doctor-item d-flex align-items-center gap-4 p-4 border-bottom"
              >
                {img ? (
                  <img src={img} alt={name} className="rounded flex-shrink-0" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                ) : (
                  <div className="rounded flex-shrink-0 d-flex align-items-center justify-content-center bg-light text-muted" style={{ width: "80px", height: "80px", fontSize: "12px" }}>
                    ko có ảnh
                  </div>
                )}
                <div className="d-flex flex-column gap-2 flex-grow-1">
                  <div className="fw-bold">{name}</div>
                  <div className="text-muted small">{spec} | {hospital}</div>
                  <ul className="info mb-0">
                    <li>Kinh nghiệm: {experience}</li>
                    <li>Mô tả: {bio}</li>
                  </ul>
                </div>
                <Link
                  to={name !== "chưa có thông tin" ? `/doctors/${toSlug(name)}` : "#"}
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
