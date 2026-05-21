import { Link } from "react-router-dom";
import { FaHome, FaLock } from "react-icons/fa";
import "./UnauthorizedPage.scss";
import { IoReload } from "react-icons/io5";
import { BiLogIn } from "react-icons/bi";

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        {/* Grass Decoration */}
        <div className="grass-decoration">
          <div className="grass"></div>
          <div className="grass"></div>
          <div className="grass"></div>
        </div>

        {/* Error Text */}
        <h1 className="error-number">403</h1>
        <p className="error-description">
          Xin lỗi, bạn không có quyền truy cập trang này.
        </p>

        {/* Action Button */}
        <Link to={"/"} className="btn-home m-3">
          <FaHome />
        </Link>
        <Link to={"/auth/login"} className="btn-home m-3">
          <BiLogIn />
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
