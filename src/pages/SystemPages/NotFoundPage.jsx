import { useNavigate } from "react-router-dom";
import { FaHome, FaCog } from "react-icons/fa";
import "./NotFoundPage.scss";
import { Link } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Floating Icon */}
        <div className="floating-icon">
          <FaCog />
        </div>

        {/* 404 Number */}
        <div className="error-number">404</div>

        {/* Error Text */}
        <h1 className="error-title">Page not found</h1>
        <p className="error-description">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa
        </p>
        <Link to={"/"} className="btn-home">
          <FaHome /> Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
