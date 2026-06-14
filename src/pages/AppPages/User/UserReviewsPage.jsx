import { useState, useEffect } from "react";
import {
  FaStar,
  FaCalendarAlt,
  FaUserMd,
  FaHospital,
  FaComments,
  FaEyeSlash
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./UserReviewsPage.scss";
import { reviewService } from "../../../api/appService";
import AppPagination from "../../../components/Common/AppPagination";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";

const PAGE_LIMIT = 10;

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage + 1,
        limit: PAGE_LIMIT,
      };

      const res = await reviewService.getMyReviews(params);
      const respData = res.data?.data;

      if (Array.isArray(respData)) {
        setReviews(respData);
        setTotalPages(res.data?.meta?.totalPages ?? 1);
        setTotalCount(res.data?.meta?.total ?? 0);
      } else {
        setReviews(respData?.items || respData?.reviews || []);
        const metaObj = respData?.meta || respData?.pagination || res.data?.meta || {};
        setTotalPages(metaObj.totalPages ?? 1);
        setTotalCount(metaObj.totalItems ?? metaObj.total ?? 0);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách đánh giá:", err);
      toast.error("Không thể tải danh sách đánh giá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-warning" : "text-muted opacity-25"}
        />
      );
    }
    return <div className="d-flex gap-1">{stars}</div>;
  };

  return (
    <div className="user-reviews-page">
      {/* Header */}
      <div className="user-reviews-header">
        <div>
          <h2 className="page-title">Lịch sử đánh giá</h2>
          <p className="page-sub">Quản lý các đánh giá của bạn sau mỗi lần khám bệnh.</p>
        </div>
        <div className="bg-light px-3 py-2 rounded-pill border">
          <FaComments className="text-primary me-2" />
          <span className="fw-semibold">Tổng cộng: {totalCount} đánh giá</span>
        </div>
      </div>

      {/* List */}
      <div className="reviews-table-wrapper position-relative" style={{ minHeight: "300px" }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-3" style={{ backgroundColor: "rgba(255,255,255,0.8)", zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && reviews.length === 0 ? (
          <div className="empty-state text-center py-5 bg-white rounded-3 shadow-sm border">
            <div className="empty-icon mb-3">
              <FaComments size={60} className="text-muted opacity-50" />
            </div>
            <h5>Chưa có đánh giá nào</h5>
            <p className="text-muted small">
              Bạn chưa viết đánh giá nào. Đánh giá của bạn giúp cải thiện chất lượng dịch vụ.
            </p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nơi khám / Bác sĩ</th>
                  <th>Hồ sơ bệnh nhân</th>
                  <th>Đánh giá</th>
                  <th>Bình luận</th>
                  <th>Ngày đánh giá</th>
                  <th className="text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">
                          <FaUserMd className="text-primary me-1" />
                          {r.doctor?.user?.lastName} {r.doctor?.user?.firstName}
                        </span>
                        <span className="small text-muted mt-1 text-truncate" style={{ maxWidth: '200px' }} title={r.hospital?.name}>
                          <FaHospital className="me-1" />
                          {r.hospital?.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium text-dark">
                        {r.patientProfile?.fullName || "Chưa có thông tin"}
                      </div>
                      <div className="small text-muted">
                        <FaCalendarAlt className="me-1" /> 
                        {r.appointment?.timeSlot?.date ? new Date(r.appointment.timeSlot.date).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </div>
                    </td>
                    <td>
                      {renderStars(r.rating)}
                      <span className="small text-muted d-block mt-1">{r.rating}/5 điểm</span>
                    </td>
                    <td>
                      <div className="review-comment p-2 bg-light rounded text-dark small" style={{ maxWidth: '250px' }}>
                        {r.comment || <span className="text-muted fst-italic">Không có bình luận</span>}
                      </div>
                    </td>
                    <td>
                      <span className="small fw-semibold text-muted">
                        {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td className="text-center">
                      {r.isVisible ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded" title="Bị ẩn do vi phạm tiêu chuẩn cộng đồng">
                          <FaEyeSlash className="me-1" /> Bị ẩn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppPagination
        pageCount={totalPages}
        currentPage={currentPage}
        total={totalCount}
        itemLabel="đánh giá"
        onPageChange={handlePageChange}
      />
    </div>
  );
}
