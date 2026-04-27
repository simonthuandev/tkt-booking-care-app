import { CgLogIn } from "react-icons/cg";
import {
  FaLock,
  FaUserPlus,
  FaFacebookF,
  FaGoogle,
  FaGithub,
  FaFacebook,
} from "react-icons/fa";
import { Link } from "react-router";
import { useState } from "react";
import Password from "../../components/Common/Password";
import { BrandLogo } from "../../components/Common/BrandLogo";

export default function RegisterInvite() {
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

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center">
      <div className="p-3">
        <BrandLogo />
      </div>

      <div
        className="card p-4 shadow-sm"
        style={{ width: "420px", borderRadius: "12px" }}
      >
        <h5 className="text-center">Đăng ký người mời</h5>

        {/* Ho */}
        <div className="">
          <label className="form-label fw-semibold text-secondary">Họ</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        {/* Ten */}
        <div className="">
          <label className="form-label fw-semibold text-secondary">Tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Email */}
        <div className="">
          <label className="form-label fw-semibold text-secondary">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Password */}
        <Password
          label="Mật khẩu"
          name="password"
          value={formData.password}
          onChange={handleChange}
        ></Password>

        {/* Confirm */}
        <Password
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        ></Password>

        {/* Button */}
        <button className="btn-search-go mt-3">Đăng ký →</button>

        {/* Divider */}
        <div className="">
          <hr className="my-3" />
          <p className="text-center">Đăng ký với</p>
        </div>

        {/* OAuth Buttons */}
        <div className="row justify-content-center">
          <div className="col-4">
            <button className="btn-search-go w-100">
              <FaGoogle />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
