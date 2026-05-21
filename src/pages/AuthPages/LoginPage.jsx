import axios from "axios";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcLock } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/Common/BrandLogo";
import "./LoginPage.scss";
import { FaUserPlus } from "react-icons/fa6";
import { useState } from "react";
import Password from "../../components/Common/Password";

const LoginPage = () => {
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=""
            className="form-control"
          />
        </div>

        {/* Password Input */}
        <Password
          label="Nhập mật khẩu"
          className=""
          name="password"
          value={formData.password}
          onChange={handleChange}
        ></Password>

        {/* Login Button */}
        <button className="btn-search-go mt-3">Đăng nhập →</button>

        {/* Divider */}
        <div className="">
          <hr className="my-3" />
          <p className="text-center" style={{ fontSize: "0,75rem" }}>
            Đăng nhập với
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="row justify-content-center mb-4">
          <div className="col-4 ">
            <button className="btn-search-go w-100">
              <FaGoogle />
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
