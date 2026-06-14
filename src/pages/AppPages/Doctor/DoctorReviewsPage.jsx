import { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import { reviewService } from "../../../api/appService";
import AppPagination from "../../../components/Common/AppPagination";
import LoadingSpinner from "../../../components/Common/LoadingSpinner";
import StarRating from "../../../components/Common/StarRating";
import "./DoctorReviewsPage.scss";

const PAGE_LIMIT = 10;

const formatDate = (date) => {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleDateString("vi-VN");
};

export default function DoctorReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getDoctorReviews({
        page: currentPage + 1,
        limit: PAGE_LIMIT,
      });
      setReviews(res.data?.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
      setTotalCount(res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch doctor reviews", err);
      toast.error("Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid py-4">
      <div className="doctor-reviews-header">
        <div>
          <h1 className="doctor-reviews-title">Đánh giá từ bệnh nhân</h1>
          <p className="doctor-reviews-sub">Theo dõi phản hồi bệnh nhân đã gửi cho bạn.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
          {totalCount} đánh giá
        </span>
      </div>

      <div className="position-relative" style={{ minHeight: 280 }}>
        {loading && (
          <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 2 }}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && reviews.length === 0 ? (
          <div className="bg-white rounded-3 shadow-sm border p-5 text-center text-muted">
            <FaRegCommentDots className="mb-3" style={{ fontSize: "3rem", opacity: 0.35 }} />
            <p className="fs-5 fw-semibold text-dark mb-1">Chưa có đánh giá nào</p>
            <span className="small">Khi bệnh nhân hoàn thành buổi khám và đánh giá, nội dung sẽ hiển thị tại đây.</span>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((review) => (
              <article key={review.id} className="bg-white rounded-3 shadow-sm border p-4">
                <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
                  <div>
                    <div className="fw-semibold">{review.patientProfile?.fullName || "Bệnh nhân ẩn danh"}</div>
                    <div className="text-muted small">
                      {review.appointment?.timeSlot?.date
                        ? `Khám ngày ${formatDate(review.appointment.timeSlot.date)}`
                        : `Đánh giá ngày ${formatDate(review.createdAt)}`}
                    </div>
                  </div>
                  <div className="text-end">
                    <StarRating rating={review.rating || 0} showValue size={14} />
                    {!review.isVisible && (
                      <div className="badge bg-secondary-subtle text-secondary mt-2">Đang bị ẩn công khai</div>
                    )}
                  </div>
                </div>
                <p className="mb-0 text-dark">{review.comment || "Bệnh nhân không để lại bình luận."}</p>
              </article>
            ))}
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
