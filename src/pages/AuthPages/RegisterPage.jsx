import { CgLogIn } from "react-icons/cg";
import {
  FaLock,
  FaUserPlus,
  FaFacebookF,
  FaGoogle,
  FaGithub,
  FaFacebook,
} from "react-icons/fa";
// import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register } from "../../store/slices/authSlice";
import Password from "../../components/Common/Password";
import { BrandLogo } from "../../components/Common/BrandLogo";
import authService from "../../api/authService";

export default function RegisterInvite() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

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
    
    // Chuẩn bị payload khớp với backend
    const payload = {
      firstName: formData.name,
      lastName: formData.surname,
      email: formData.email,
      password: formData.password,
    };

    try {
      const resultAction = await dispatch(register(payload)).unwrap();
      toast.success("Đăng ký thành công!");
      const returnUrl = resultAction.role === "admin" ? "/app/admin/dashboard" 
        : resultAction.role === "doctor" ? "/app/doctor/dashboard" : "/app/user/dashboard";
      navigate(returnUrl);
    } catch (error) {
      toast.error(error || "Đăng ký thất bại");
    }
  };

  return (
    <div className="login-container min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
      <div className="p-3">
        <BrandLogo />
      </div>

      <form
        onSubmit={handleSubmit}
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
        <button type="submit" className="btn-search-go mt-3" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng ký →"}
        </button>

        {/* Divider */}
        <div className="">
          <hr className="my-3" />
          <p className="text-center">Hoặc</p>
        </div>

        {/* OAuth Buttons */}
        {/* <div className="row justify-content-center">
          <div className="col-4">
            <button type="button" className="btn-search-go w-100" onClick={() => authService.loginWithGoogle()}>
              <FaGoogle />
            </button>
          </div>
        </div> */}
        <div className="d-flex justify-content-center mb-4">
          <button 
            className="btn-search-go"
            onClick={() => {authService.loginWithGoogle()}}
          >
            {/* <FaGoogle /> */}
            <span>Đăng nhập với Google</span>
          </button>
        </div>
      </form>
    </div>
  );
}
