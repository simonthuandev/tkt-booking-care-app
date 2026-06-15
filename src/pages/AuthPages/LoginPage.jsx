import { useState } from "react";
import { FaArrowRight, FaEye, FaLock, FaRegEnvelope } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import authService from "../../api/authService";
import { BrandLogo } from "../../components/Common/BrandLogo";
import { login } from "../../store/slices/authSlice";
import { getRoleLandingPath } from "../../utils/rolePaths";
import "./LoginPage.scss";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login(formData)).unwrap();
      toast.success("Đăng nhập thành công!");
      navigate(getRoleLandingPath(resultAction.role));
    } catch (error) {
      toast.error(error || "Đăng nhập thất bại");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-visual__brand">
          <BrandLogo />
          <p>Nâng tầm trải nghiệm y tế, kết nối chuyên gia hàng đầu</p>
        </div>
        <div className="auth-visual__note">
          <h2>Nâng tầm trải nghiệm y tế</h2>
          <p>
            Hệ thống đặt lịch chuyên nghiệp, bảo mật và tận tâm. Chúng tôi kết
            nối bạn với những chuyên gia hàng đầu.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card__brand">
            <BrandLogo />
          </div>

          <header className="auth-card__header">
            <h1>Chào mừng trở lại</h1>
            <p>Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.</p>
          </header>

          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <div className="auth-input">
              <FaRegEnvelope />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="password">Mật khẩu</label>
              <Link to="/auth/forgot-password">Quên mật khẩu?</Link>
            </div>
            <div className="auth-input">
              <FaLock />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="auth-icon-btn"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <FaEye />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? "Đang xử lý..." : "Đăng nhập"}</span>
            <FaArrowRight />
          </button>

          <div className="auth-divider">
            <span>HOẶC</span>
          </div>

          <button
            type="button"
            className="auth-google-btn"
            onClick={() => authService.loginWithGoogle()}
          >
            <span className="auth-google-mark">g</span>
            <span>Tiếp tục với Google</span>
          </button>

          <p className="auth-switch">
            Chưa có tài khoản?
            <Link to="/auth/register">
              <FaUserPlus /> Đăng ký ngay
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
