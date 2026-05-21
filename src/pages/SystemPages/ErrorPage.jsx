import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";
import "./ErrorPage.scss";
import { Link } from "react-router";
import { IoReload } from "react-icons/io5";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="floating-icon error-icon">
          <FaExclamationTriangle />
        </div>

        <div className="error-number">500</div>

        <h1 className="error-title">Server Error</h1>
        <p className="error-description">
          Có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau
        </p>
        <Link to={"/"} className="btn-home m-3">
          <FaHome />
        </Link>
        <Link to={window.location.pathname} className="btn-home m-3">
          <IoReload />
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
