import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VerifyEmailPage.scss";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("user@example.com");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(5);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Gọi API xác thực mã
      // const response = await authService.verifyEmail(code);

      // Tạm thời giả lập thành công
      setTimeout(() => {
        setSuccess("✓ Email xác thực thành công!");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Mã xác thực không hợp lệ");
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Gọi API gửi lại mã
      // await authService.resendVerificationCode(email);

      // Giả lập gửi lại mã
      setTimeout(() => {
        setSuccess("✓ Mã xác thực mới đã được gửi!");
        setTimer(300);
        setCanResend(false);
        setCode("");
        setLoading(false);
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError("Không thể gửi lại mã. Vui lòng thử lại.");
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-header">
            <h1>Xác Thực E-mail</h1>
            <p className="subtitle">
              Nhập mã xác thực được gửi đến e-mail của bạn
            </p>
          </div>

          <div className="email-display">
            <p className="email-text">
              E-mail: <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="verify-form">
            <div className="form-group">
              <label className="form-label">Mã Xác Thực </label>
              <input
                type="text"
                id="code"
                className="form-control code-input"
                placeholder="000000"
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength="6"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-search-go w-100"
              disabled={loading || !code.trim()}
            >
              {loading ? "Đang xác thực..." : "Xác Thực"}
            </button>
          </form>

          <div className="resend-section">
            <p className="resend-text">Không nhận được mã?</p>
            <button type="button" className="btn btn-link btn-resend">
              Gửi lại mã
            </button>
          </div>

          <div className="d-flex justify-content-center">
            <Link
              to="/auth/login"
              className="text-secondary text-decoration-none"
            >
              Quay về trang đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
