import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import authService from "../../api/authService";
import { BrandLogo } from "../../components/Common/BrandLogo";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevLink("");

    try {
      const res = await authService.requestPasswordReset({ email });
      toast.success(res.data?.message || "Nếu email tồn tại, link khôi phục đã được tạo.");
      if (res.data?.devLink) setDevLink(res.data.devLink);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể tạo link khôi phục.");
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
        <h2>Quên mật khẩu?</h2>
        <p>Nhập email gắn với tài khoản của bạn để khôi phục.</p>

        <div className="mb-4">
          <label className="form-label fw-semibold text-secondary">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control form-control-lg"
            required
          />
        </div>

        <button className="btn-search-go" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tiếp tục"}
        </button>

        {devLink && (
          <div className="alert alert-info mt-3 mb-0" style={{ wordBreak: "break-all" }}>
            <strong>Dev reset link:</strong>
            <br />
            <Link to={devLink.replace(window.location.origin, "")}>{devLink}</Link>
          </div>
        )}

        <div className="d-flex justify-content-center align-items-center text-secondary pt-3">
          <Link to="/auth/login" className="text-secondary text-decoration-none">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
