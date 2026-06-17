import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../api/authService";
import { fetchCurrentUser } from "../../store/slices/authSlice";
import { getRoleSettingsPath } from "../../utils/rolePaths";
import "./VerifyEmailPage.scss";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực email...");

  useEffect(() => {
    let mounted = true;
    let redirectTimer;

    authService
      .confirmEmailVerification({ token })
      .then(async () => {
        if (!mounted) return;
        setStatus("success");
        setMessage("Email của bạn đã được xác thực thành công.");

        if (isAuthenticated) {
          try {
            const refreshedUser = await dispatch(fetchCurrentUser()).unwrap();
            if (!mounted) return;

            const nextRole = refreshedUser?.role || user?.role;
            redirectTimer = setTimeout(
              () => navigate(getRoleSettingsPath(nextRole), { replace: true }),
              2200,
            );
            return;
          } catch {
            if (!mounted) return;
          }
        }

        redirectTimer = setTimeout(() => navigate("/auth/login", { replace: true }), 2200);
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus("error");
        setMessage(error?.response?.data?.message || "Token xác thực không hợp lệ.");
      });

    return () => {
      mounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [dispatch, isAuthenticated, navigate, token, user?.role]);

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
