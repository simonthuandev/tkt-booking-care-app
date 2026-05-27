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
import { FaUserPlus } from "react-icons/fa6";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../store/slices/authSlice";
import authService from "../../api/authService";
import Password from "../../components/Common/Password";
import "./LoginPage.scss";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

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
      // RoleRoute Redirect mapping
      const returnUrl = resultAction.role === "admin" ? "/app/admin/dashboard" 
        : resultAction.role === "doctor" ? "/app/doctor/dashboard" : "/app/user/dashboard";
      navigate(returnUrl);
    } catch (error) {
      toast.error(error || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-container min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
      {/* Logo */}
      <div className="p-3">
        <BrandLogo />
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
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
        <button type="submit" className="btn-search-go mt-3" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng nhập →"}
        </button>

        {/* Divider */}
        <div className="">
          <hr className="my-3" />
          <p className="text-center" style={{ fontSize: "0,75rem" }}>
            Hoặc
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="d-flex justify-content-center mb-4">
          <button 
            className="btn-search-go"
            onClick={() => {authService.loginWithGoogle()}}
          >
            {/* <FaGoogle /> */}
            <span>Đăng nhập với Google</span>
          </button>
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
      </form>
    </div>
  );
};

export default LoginPage;
