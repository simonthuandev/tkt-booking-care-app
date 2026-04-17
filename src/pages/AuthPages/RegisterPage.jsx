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

export default function RegisterInvite() {
  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div
        className="card p-4 shadow-sm"
        style={{ width: "420px", borderRadius: "12px" }}
      >
        <h5 className="text-center mb-4">Đăng ký người mời</h5>

        {/* Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Họ tên
          </label>
          <input type="text" className="form-control" />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            E-mail
          </label>
          <input type="email" className="form-control" />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Mật khẩu
          </label>
          <input type="password" className="form-control" />
        </div>

        {/* Confirm */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-secondary">
            Nhập lại mật khẩu
          </label>
          <input type="password" className="form-control" />
        </div>

        {/* Button */}
        <button className="btn-search-go">Đăng ký →</button>

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

        {/* Bottom links */}
        <div className="d-flex justify-content-center">
          <Link
            to="/auth/login"
            className="text-secondary text-decoration-none"
          >
            Đã có tài khoản <CgLogIn />
          </Link>
        </div>
      </div>
    </div>
  );
}
