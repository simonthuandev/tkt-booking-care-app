import { Link } from "react-router";
import { BrandLogo } from "../../components/Common/BrandLogo";
import RoutePage from "../../components/Common/RoutePage";

const ForgotPasswordPage = () => {
  return (
    <div className="login-container min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
      {/* Logo */}
      <div className="p-3">
        <BrandLogo />
      </div>

      {/* Email Card */}
      <div
        className="card shadow-lg p-5"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h2>Quên mật khẩu ?</h2>
        <p>Điền email gắn với tài khoản của bạn để khôi phục</p>
        {/* Email Input */}
        <div className="mb-4 ">
          <label className="form-label fw-semibold text-secondary">
            E-mail
          </label>
          <input
            type="email"
            placeholder=""
            className="form-control form-control-lg"
          />
        </div>

        {/* Button go to gmail */}
        <button className="btn-search-go">Tiếp tục</button>

        {/* Goback Login */}
        <div className="d-flex justify-content-center align-items-center text-secondary pt-3">
          <Link
            to="/auth/login"
            className="text-secondary text-decoration-none"
          >
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
