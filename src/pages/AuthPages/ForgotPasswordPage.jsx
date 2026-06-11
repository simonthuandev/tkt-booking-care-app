import { FaArrowRight, FaRegEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BrandLogo } from "../../components/Common/BrandLogo";
import "./LoginPage.scss";

const ForgotPasswordPage = () => {
  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-hidden="true">
        <div className="auth-visual__brand">
          <BrandLogo />
          <p>Nâng tầm trải nghiệm y tế, kết nối chuyên gia hàng đầu</p>
        </div>
        <div className="auth-visual__note">
          <h2>Khôi phục truy cập dễ dàng</h2>
          <p>
            Chúng tôi sẽ hướng dẫn bạn đặt lại mật khẩu để tiếp tục quản lý lịch
            hẹn và hồ sơ sức khỏe.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card auth-card--compact">
          <div className="auth-card__brand">
            <BrandLogo />
          </div>

          <header className="auth-card__header">
            <h1>Quên mật khẩu?</h1>
            <p>Nhập email gắn với tài khoản của bạn để khôi phục mật khẩu.</p>
          </header>

          <div className="auth-field">
            <label htmlFor="reset-email">E-mail</label>
            <div className="auth-input">
              <FaRegEnvelope />
              <input
                id="reset-email"
                type="email"
                placeholder="ten@gmail.com"
              />
            </div>
          </div>

          <button type="button" className="auth-primary-btn">
            <span>Tiếp tục</span>
            <FaArrowRight />
          </button>

          <p className="auth-switch">
            <Link to="/auth/login">Quay lại trang đăng nhập</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
