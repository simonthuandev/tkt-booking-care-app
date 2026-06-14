import { useState, useEffect } from "react";
import {
  FaStar,
  FaCalendarAlt,
  FaUserMd,
  FaHospital,
  FaComments,
  FaEyeSlash,
  FaEye,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaBan
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./AdminReviewsPage.scss";
import { reviewService } from "../../../api/appService";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import AppPagination from "../../../components/Common/AppPagination";

const PAGE_LIMIT = 10;

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: ReviewDetailModal
// ─────────────────────────────────────────────────────────────────────────────
const ReviewDetailModal = ({ review, onClose, onToggleVisibility, toggling }) => {
  if (!review) return null;

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
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '16px' }}>
            <div className="modal-header bg-light border-bottom-0" style={{ borderRadius: '16px 16px 0 0' }}>
              <h5 className="modal-title fw-bold">Chi tiết Đánh giá</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded border shadow-sm">
                <div>
                  <small className="text-muted d-block mb-1">Mã đánh giá</small>
                  <strong className="text-dark fs-5">#{review.id.substring(0, 8).toUpperCase()}</strong>
                </div>
                <div className="text-end">
                  {review.isVisible ? (
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fs-6">
                      <FaEye className="me-1" /> Đang hiển thị
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 fs-6">
                      <FaEyeSlash className="me-1" /> Đã bị ẩn
                    </span>
                  )}
                </div>
              </div>

              <div className="row g-4">
                {/* Người đánh giá */}
                <div className="col-md-6">
                  <div className="h-100 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Người đánh giá</h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Hồ sơ bệnh nhân</small>
                      <div className="fw-semibold fs-6">{review.patientProfile?.fullName || "Chưa có thông tin"}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Mã hồ sơ</small>
                      <div className="text-muted small">{review.patientProfile?.id}</div>
                    </div>
                  </div>
                </div>

                {/* Bác sĩ & Bệnh viện */}
                <div className="col-md-6">
                  <div className="h-100 p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Nơi khám & Bác sĩ</h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Bác sĩ phụ trách</small>
                      <div className="fw-semibold fs-6">
                        {review.doctor?.user?.lastName} {review.doctor?.user?.firstName}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Bệnh viện / Phòng khám</small>
                      <div className="fw-semibold">{review.hospital?.name}</div>
                    </div>
                  </div>
                </div>

                {/* Nội dung đánh giá */}
                <div className="col-12">
                  <div className="p-3 bg-light rounded border">
                    <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">Nội dung đánh giá</h6>
                    <div className="row">
                      <div className="col-md-3 mb-3 mb-md-0 border-end">
                        <small className="text-muted d-block mb-1">Mức độ hài lòng</small>
                        <div className="d-flex flex-column align-items-start">
                          {renderStars(review.rating)}
                          <strong className="mt-1 fs-5 text-dark">{review.rating} / 5</strong>
                        </div>
                      </div>
                      <div className="col-md-9">
                        <small className="text-muted d-block mb-1">Bình luận</small>
                        <div className="p-3 bg-white rounded border">
                          {review.comment ? (
                            <span className="text-dark" style={{ whiteSpace: 'pre-wrap' }}>{review.comment}</span>
                          ) : (
                            <span className="text-muted fst-italic">Người dùng không để lại bình luận.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 bg-light justify-content-between p-3" style={{ borderRadius: '0 0 16px 16px' }}>
              <div className="text-muted small">
                Ngày tạo: {new Date(review.createdAt).toLocaleString('vi-VN')}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-secondary px-4" onClick={onClose} disabled={toggling}>Đóng</button>
                <button 
                  className={`btn px-4 ${review.isVisible ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => onToggleVisibility(review.id, !review.isVisible)}
                  disabled={toggling}
                >
                  {toggling ? <span className="spinner-border spinner-border-sm" /> : review.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
                </button>
              </div>
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
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterRating, setFilterRating] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("");

  // Modal
  const [selectedReview, setSelectedReview] = useState(null);
  const [toggling, setToggling] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage + 1,
        limit: PAGE_LIMIT,
      };

      if (filterRating) params.rating = filterRating;
      if (filterVisibility !== "") params.isVisible = filterVisibility;

      const res = await reviewService.adminGetReviews(params);
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
  }, [currentPage, filterRating, filterVisibility]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterRatingChange = (e) => {
    setFilterRating(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterVisibilityChange = (e) => {
    setFilterVisibility(e.target.value);
    setCurrentPage(0);
  };

  const handleViewDetail = async (id) => {
    try {
      toast.info("Đang tải chi tiết...");
      const res = await reviewService.adminGetReviewDetail(id);
      setSelectedReview(res.data?.data || res.data);
    } catch (err) {
      console.error("Lỗi xem chi tiết đánh giá:", err);
      toast.error("Không thể tải chi tiết đánh giá.");
    }
  };

  const handleToggleVisibility = async (id, newVisibility) => {
    try {
      setToggling(true);
      await reviewService.adminUpdateReviewVisibility(id, { isVisible: newVisibility });
      toast.success(newVisibility ? "Đã hiện đánh giá thành công!" : "Đã ẩn đánh giá thành công!");
      
      // Update local state if modal is open
      if (selectedReview && selectedReview.id === id) {
        setSelectedReview({ ...selectedReview, isVisible: newVisibility });
      }
      
      // Refresh list to recalculate pagination and get latest data
      fetchReviews();
    } catch (err) {
      console.error("Lỗi đổi trạng thái hiển thị:", err);
      toast.error(err.response?.data?.message || "Không thể cập nhật trạng thái hiển thị.");
    } finally {
      setToggling(false);
    }
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
    <div className="admin-reviews-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="page-title">Quản lý đánh giá</h1>
          <p className="page-sub">Duyệt và kiểm duyệt phản hồi từ bệnh nhân.</p>
        </div>
        <div className="header-stats bg-white border shadow-sm px-4 py-2 rounded-pill d-flex align-items-center gap-2">
          <FaComments className="text-primary" />
          <span className="fw-bold text-dark">{totalCount}</span>
          <span className="text-muted small">tổng đánh giá</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3">
            <label className="form-label text-muted small fw-semibold">
              <FaFilter className="me-1" /> Trạng thái
            </label>
            <select className="form-select border-0 bg-light" value={filterVisibility} onChange={handleFilterVisibilityChange}>
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hiển thị</option>
              <option value="false">Đã bị ẩn</option>
            </select>
          </div>
          
          <div className="col-12 col-md-3">
            <label className="form-label text-muted small fw-semibold">
              <FaStar className="me-1 text-warning" /> Điểm đánh giá
            </label>
            <select className="form-select border-0 bg-light" value={filterRating} onChange={handleFilterRatingChange}>
              <option value="">Tất cả số sao</option>
              <option value="5">5 Sao</option>
              <option value="4">4 Sao</option>
              <option value="3">3 Sao</option>
              <option value="2">2 Sao</option>
              <option value="1">1 Sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="admin-reviews-table-wrapper position-relative" style={{ minHeight: "300px" }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center rounded-3" style={{ backgroundColor: "rgba(255,255,255,0.8)", zIndex: 10 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && reviews.length === 0 ? (
          <div className="empty-state text-center py-5 bg-white rounded-3 shadow-sm border">
            <div className="empty-icon mb-3">
              <FaSearch size={50} className="text-muted opacity-50" />
            </div>
            <h5>Không tìm thấy đánh giá nào</h5>
            <p className="text-muted small">Hãy thử thay đổi bộ lọc tìm kiếm.</p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded bg-white">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Người đánh giá</th>
                  <th>Nơi khám / Bác sĩ</th>
                  <th>Đánh giá</th>
                  <th>Bình luận</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className={!r.isVisible ? 'bg-light text-muted' : ''}>
                    <td>
                      <div className="fw-semibold text-dark">
                        {r.patientProfile?.fullName || "Chưa có thông tin"}
                      </div>
                      <div className="small text-muted">
                        {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-semibold text-dark">
                          <FaUserMd className="text-primary me-1" />
                          {r.doctor?.user?.lastName} {r.doctor?.user?.firstName}
                        </span>
                        <span className="small text-muted mt-1 text-truncate" style={{ maxWidth: '180px' }} title={r.hospital?.name}>
                          <FaHospital className="me-1" />
                          {r.hospital?.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      {renderStars(r.rating)}
                    </td>
                    <td>
                      <div className={`review-comment-preview p-2 rounded small ${!r.isVisible ? 'bg-white opacity-50' : 'bg-light text-dark'}`} style={{ maxWidth: '250px' }}>
                        {r.comment ? (
                          <div className="text-truncate" style={{ maxHeight: '40px', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', whiteSpace: 'normal' }}>
                            {r.comment}
                          </div>
                        ) : (
                          <span className="text-muted fst-italic">Không có bình luận</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      {r.isVisible ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded">
                          Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          className="btn btn-sm btn-light border shadow-sm text-primary" 
                          onClick={() => handleViewDetail(r.id)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className={`btn btn-sm shadow-sm border ${r.isVisible ? 'btn-light text-danger' : 'btn-light text-success'}`} 
                          onClick={() => handleToggleVisibility(r.id, !r.isVisible)}
                          title={r.isVisible ? "Ẩn bình luận này" : "Cho phép hiển thị"}
                          disabled={toggling}
                        >
                          {r.isVisible ? <FaEyeSlash /> : <FaCheckCircle />}
                        </button>
                      </div>
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

      {/* Detail Modal */}
      <ReviewDetailModal 
        review={selectedReview} 
        onClose={() => setSelectedReview(null)} 
        onToggleVisibility={handleToggleVisibility}
        toggling={toggling}
      />
    </div>
  );
}
