import { useState } from "react";
import { Container } from "react-bootstrap";
import { BsShieldFillCheck } from "react-icons/bs";
import { FaSearch, FaCalendarCheck } from "react-icons/fa";
import { FaLocationDot, FaFaceSmile } from "react-icons/fa6";
import StarRating from "../Common/StarRating";
import DynamicIcon from "../Icons/DynamicIcon";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/helpers";

const tabs = [
  { key: "doctor", icon: "bsPersonBadgeFill", label: "Bác sĩ" },
  { key: "specialty", icon: "faClipboardList", label: "Chuyên khoa" },
  { key: "hospital", icon: "faHospital", label: "Bệnh viện" },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("doctor");

  return (
    <section className="hero-section" id="home">
      <div className="hero-bg-shape" />
      <div className="hero-bg-dots" />

      <Container>
        <div className="row align-items-center min-vh-100 pt-5">
          {/* Left */}
          <div className="col-lg-6 hero-content">
            <div className="hero-badge">
              <BsShieldFillCheck className="me-2" />
              Nền tảng y tế uy tín #1 Việt Nam
            </div>

            <h1 className="hero-title">
              Đặt Lịch Khám
              <br />
              <em>Nhanh – Dễ – Tiện</em>
            </h1>

            <p className="hero-desc">
              Kết nối bạn với hơn <strong>5.000+ bác sĩ</strong> chuyên khoa và{" "}
              <strong>200+ bệnh viện</strong> trên toàn quốc. Đặt lịch trong 60
              giây, nhận xác nhận ngay lập tức.
            </p>

            {/* Search box */}
            <div className="hero-search-box">
              <div className="search-tabs">
                {tabs.map(({ key, icon, label }) => (
                  <button
                    key={key}
                    className={`stab${activeTab === key ? " active" : ""}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <DynamicIcon name={`${icon}`} />
                    <span className="ms-1">{label}</span>
                  </button>
                ))}
              </div>

              <div className="search-input-row">
                <div className="si-group">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Tìm bác sĩ, chuyên khoa, bệnh viện..."
                  />
                </div>
                <div className="si-group si-location">
                  <FaLocationDot />
                  <select>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                  </select>
                </div>
                <Link className="btn-search-go" to="/search">
                  <FaSearch className="me-2" />
                  Tìm kiếm
                </Link>
              </div>
            </div>

            {/* Quick tags */}
            <div className="quick-tags">
              <span className="qt-label">Tìm nhanh:</span>
              {["Tim mạch", "Nha khoa", "Nhi khoa", "Da liễu", "Mắt"].map(
                (t) => (
                  <Link
                    key={t}
                    to={`/search?q=${encodeURIComponent(t)}`}
                    className="qt"
                  >
                    {t}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Right visual */}
          <div className="col-lg-6 hero-visual d-none d-lg-flex justify-content-center">
            <div className="hero-card-stack">
              <div className="hcard hcard-main">
                <div className="hcard-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Doctor"
                  />
                  <div className="hcard-status" />
                </div>
                <div className="hcard-info">
                  <div className="hcard-name">BS. Nguyễn Thị Lan</div>
                  <div className="hcard-spec">Tim mạch – BV Chợ Rẫy</div>
                  <div className="hcard-stars">
                    <StarRating rating={4.8} half={true} />
                    <span>4.8 (320 đánh giá)</span>
                  </div>
                </div>
                <button className="hcard-btn">
                  <Link to={`/doctors/${toSlug("BS . Nguyễn Thị Lan")}`}>
                    Xem bác sĩ
                  </Link>
                </button>
              </div>

              <div className="hfloat hfloat-1">
                <FaCalendarCheck />
                <div>
                  <div className="hf-num">1,240</div>
                  <div className="hf-lbl">Lịch hôm nay</div>
                </div>
              </div>

              <div className="hfloat hfloat-2">
                <FaFaceSmile />
                <div>
                  <div className="hf-num">98%</div>
                  <div className="hf-lbl">Hài lòng</div>
                </div>
              </div>

              <div className="hero-circle hc1" />
              <div className="hero-circle hc2" />
            </div>
          </div>
        </div>
      </Container>

      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="var(--bg-main)"
          />
        </svg>
      </div>
    </section>
  );
}
