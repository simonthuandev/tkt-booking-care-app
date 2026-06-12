import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import authService from "../../api/authService";
import "./VerifyEmailPage.scss";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực email...");

  useEffect(() => {
    let mounted = true;

    authService
      .confirmEmailVerification({ token })
      .then(() => {
        if (!mounted) return;
        setStatus("success");
        setMessage("Email của bạn đã được xác thực thành công.");
        setTimeout(() => navigate("/auth/login", { replace: true }), 2200);
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus("error");
        setMessage(error?.response?.data?.message || "Token xác thực không hợp lệ.");
      });

    return () => {
      mounted = false;
    };
  }, [navigate, token]);

  return (
    <div className="verify-email-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-header">
            <span className="verify-icon">
              {status === "loading" ? "…" : status === "success" ? "✓" : "!"}
            </span>
            <h1>{status === "success" ? "Xác thực thành công" : "Xác thực email"}</h1>
            <p className="subtitle">{message}</p>
          </div>

          <div className="text-center">
            <Link to="/auth/login" className="btn btn-primary">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
