import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import authService from "../../api/authService";
import { BrandLogo } from "../../components/Common/BrandLogo";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await authService.confirmPasswordReset({ token, ...form });
      toast.success("Đặt lại mật khẩu thành công.");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
      <div className="p-3">
        <BrandLogo />
      </div>

      <form
        onSubmit={handleSubmit}
        className="card shadow-lg p-5"
        style={{ width: "100%", maxWidth: "440px" }}
      >
        <h2>Đặt lại mật khẩu</h2>
        <p>Nhập mật khẩu mới cho tài khoản của bạn.</p>

        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">Mật khẩu mới</label>
          <div className="position-relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="form-control pe-5"
              required
            />
            <button
              type="button"
              className="auth-icon-btn position-absolute top-50 end-0 translate-middle-y me-2"
              onClick={() => setShowNewPassword((value) => !value)}
              aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <FaEye />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold text-secondary">Xác nhận mật khẩu</label>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="form-control pe-5"
              required
            />
            <button
              type="button"
              className="auth-icon-btn position-absolute top-50 end-0 translate-middle-y me-2"
              onClick={() => setShowConfirmPassword((value) => !value)}
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <FaEye />
            </button>
          </div>
        </div>

        <button className="btn-search-go" disabled={loading}>
          {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
        </button>

        <div className="d-flex justify-content-center align-items-center text-secondary pt-3">
          <Link to="/auth/login" className="text-secondary text-decoration-none">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
