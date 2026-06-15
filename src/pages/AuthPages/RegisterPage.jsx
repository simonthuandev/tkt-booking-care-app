import { useState } from "react";
import {
  FaArrowRight,
  FaEye,
  FaLock,
  FaRegEnvelope,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import authService from "../../api/authService";
import { BrandLogo } from "../../components/Common/BrandLogo";
import { register } from "../../store/slices/authSlice";
import { getRoleLandingPath } from "../../utils/rolePaths";
import "./LoginPage.scss";

export default function RegisterInvite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    const payload = {
      firstName: formData.name,
      lastName: formData.surname,
      email: formData.email,
      password: formData.password,
    };

    try {
      const resultAction = await dispatch(register(payload)).unwrap();
      toast.success("Đăng ký thành công!");
      navigate(getRoleLandingPath(resultAction.role));
    } catch (error) {
      toast.error(error || "Đăng ký thất bại");
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
          <h2>Bắt đầu hành trình chăm sóc sức khỏe</h2>
          <p>
            Tạo tài khoản để đặt lịch nhanh hơn, quản lý hồ sơ và theo dõi lịch
            hẹn của bạn tại một nơi.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card auth-card--register" onSubmit={handleSubmit}>
          <div className="auth-card__brand">
            <BrandLogo />
          </div>

          <header className="auth-card__header">
            <h1>Tạo tài khoản</h1>
            <p>Nhập thông tin để bắt đầu sử dụng TKTBookingCare.</p>
          </header>

          <div className="auth-grid">
            <div className="auth-field">
              <label htmlFor="surname">Họ</label>
              <div className="auth-input">
                <FaUser />
                <input
                  id="surname"
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Nguyen"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="name">Tên</label>
              <div className="auth-input">
                <FaUser />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Van A"
                />
              </div>
            </div>
          </div>

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
            <label htmlFor="password">Mật khẩu</label>
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

          <div className="auth-field">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <div className="auth-input">
              <FaLock />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="auth-icon-btn"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={
                  showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                <FaEye />
              </button>
            </div>
          </div>

          <button type="submit" className="auth-primary-btn" disabled={isLoading}>
            <span>{isLoading ? "Đang xử lý..." : "Đăng ký"}</span>
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
            Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
