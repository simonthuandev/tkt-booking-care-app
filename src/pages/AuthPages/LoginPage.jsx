import axios from "axios";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { FcLock } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/Common/BrandLogo";
import "./LoginPage.scss";
import { FaUserPlus } from "react-icons/fa6";

const LoginPage = () => {
  return (
    <div className="login-container min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
      {/* Logo */}
      <div className="p-3">
        <BrandLogo />
      </div>

      {/* Login Card */}
      <div
        className="card shadow-lg p-5"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            E-mail
          </label>
          <input
            type="email"
            placeholder=""
            className="form-control form-control-lg"
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Password
          </label>
          <input
            type="password"
            placeholder=""
            className="form-control form-control-lg"
          />
        </div>

        {/* Login Button */}
        <button className="btn-search-go">Đăng nhập →</button>

        {/* Divider */}
        <div className="mb-4">
          <hr className="my-3" />
        </div>

        {/* OAuth Buttons */}
        <div className="mb-4 row ">
          <div className="col-4">
            <button className="btn-search-go w-100">
              <FaFacebook />
            </button>
          </div>
          <div className="col-4">
            <button className="btn-search-go w-100">
              <FaGoogle />
            </button>
          </div>
          <div className="col-4">
            <button className="btn-search-go w-100">
              <FaGithub />
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-between align-items-center text-secondary">
            <Link
              to="/auth/forgot-password"
              className="text-secondary text-decoration-none"
            >
              <FcLock /> Quên mật khẩu
            </Link>
          </div>
          <div className="d-flex justify-content-between align-items-center text-secondary">
            <Link
              to="/auth/register"
              className="text-secondary text-decoration-none"
            >
              Chưa có tài khoản <FaUserPlus />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
