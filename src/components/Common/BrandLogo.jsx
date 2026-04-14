import { Link } from "react-router";
import { FaHeartPulse } from "react-icons/fa6";

export const BrandLogo = () => {
  return (
    <>
      <Link to="/" className="d-flex align-items-center gap-2">
        <div className="brand-icon">
          <FaHeartPulse />
        </div>
        <span className="brand-text">
          <span>TKT</span>
          <span>BookingCare</span>
        </span>
      </Link>
    </>
  )
};