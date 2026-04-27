import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Password({ label, className, name, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="">
      <label className="form-label fw-semibold text-secondary">{label}</label>
      <div className="position-relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-control ${className}`}
        />
        <button
          type="button"
          className="btn btn-sm position-absolute end-0 top-50 translate-middle-y"
          onClick={() => setShowPassword(!showPassword)}
          style={{ background: "none", border: "none", zIndex: 10 }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

export default Password;
