import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { BsShieldFillCheck } from "react-icons/bs";
import { FaSearch, FaCalendarCheck } from "react-icons/fa";
import { FaLocationDot, FaFaceSmile } from "react-icons/fa6";
import StarRating from "../Common/StarRating";
import DynamicIcon from "../Icons/DynamicIcon";
import { Link, useNavigate } from "react-router-dom";
import { doctorService, hospitalService, specialtyService } from "../../api/appService";

const tabs = [
  { key: "doctor", icon: "bsPersonBadgeFill", label: "Bác sĩ" },
  { key: "specialty", icon: "faClipboardList", label: "Chuyên khoa" },
  { key: "hospital", icon: "faHospital", label: "Bệnh viện" },
];

const FALLBACK_QUICK_TAGS = ["Tim mạch", "Nha khoa", "Nhi khoa", "Da liễu", "Mắt"];
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0fa39b&color=fff&size=200&name=";
const FALLBACK_DOCTOR = {
  slug: "",
  name: "Chưa có bác sĩ nổi bật",
  avatar: `${DEFAULT_AVATAR}${encodeURIComponent("BS")}`,
  specialty: "Chưa có thông tin",
  hospital: "Chưa có thông tin",
  rating: 0,
  totalReviews: 0,
};

const formatNumber = (value, fallback) =>
  value === undefined || value === null ? fallback : value.toLocaleString("vi-VN");

const getDoctorName = (doctor) => {
  const fullName = `${doctor?.user?.lastName || ""} ${doctor?.user?.firstName || ""}`.trim();
  return fullName || FALLBACK_DOCTOR.name;
};

const mapFeaturedDoctor = (doctor) => {
  if (!doctor) return FALLBACK_DOCTOR;

  const name = getDoctorName(doctor);
  const specialty =
    doctor.specialties?.find((item) => item.isPrimary)?.specialty?.name ||
    doctor.specialties?.[0]?.specialty?.name ||
    "Chưa cập nhật";
  const hospital = doctor.hospitals?.[0]?.hospital?.name || "Chưa cập nhật";

  return {
    slug: doctor.slug || "",
    name,
    avatar: doctor.imgURL || `${DEFAULT_AVATAR}${encodeURIComponent(name)}`,
    specialty,
    hospital,
    rating: doctor.rating || 0,
    totalReviews: doctor.totalReviews || 0,
  };
};

export default function HeroSection({ stats }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("doctor");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [quickTags, setQuickTags] = useState(FALLBACK_QUICK_TAGS);
  const [featuredDoctor, setFeaturedDoctor] = useState(FALLBACK_DOCTOR);

  useEffect(() => {
    let isMounted = true;

    specialtyService
      .specialties({ page: 1, limit: 5 })
      .then((res) => {
        if (!isMounted) return;
        const names = (res.data?.data || []).map((item) => item.name).filter(Boolean);
        if (names.length > 0) setQuickTags(names);
      })
      .catch((err) => console.error("Lỗi lấy chuyên khoa tìm nhanh:", err));

    hospitalService
      .getCities()
      .then((res) => {
        if (!isMounted) return;
        setCities(res.data?.data || []);
      })
      .catch((err) => console.error("Lỗi lấy danh sách thành phố:", err));

    doctorService
      .doctors({ page: 1, limit: 1 })
      .then((res) => {
        if (!isMounted) return;
        setFeaturedDoctor(mapFeaturedDoctor(res.data?.data?.[0]));
      })
      .catch((err) => console.error("Lỗi lấy bác sĩ nổi bật:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const heroNumbers = useMemo(
    () => ({
      doctors: formatNumber(stats?.doctors?.total, "0"),
      hospitals: formatNumber(stats?.hospitals?.total, "0"),
      todayAppointments: formatNumber(stats?.appointments?.today, "0"),
      satisfactionRate: formatNumber(stats?.reviews?.satisfactionRate, "0"),
    }),
    [stats],
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const keyword = searchInput.trim();

    if (!keyword) {
      navigate("/search");
      return;
    }

    const params = new URLSearchParams({ q: keyword, type: activeTab });
    if (selectedCity) params.set("city", selectedCity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-bg-shape" />
      <div className="hero-bg-dots" />

      <Container>
        <div className="row align-items-center min-vh-100 pt-5">
          <div className="col-lg-6 hero-content">
            <div className="hero-badge">
              <BsShieldFillCheck className="me-2" />
              Nền tảng y tế uy tín top đầu Việt Nam
            </div>

            <h1 className="hero-title">
              Đặt Lịch Khám
              <br />
              <em>Nhanh – Dễ – Tiện</em>
            </h1>

            <p className="hero-desc">
              Kết nối bạn với hơn <strong>{heroNumbers.doctors}+ bác sĩ</strong> chuyên khoa và{" "}
              <strong>{heroNumbers.hospitals}+ bệnh viện</strong> trên toàn quốc. Đặt lịch trong 60
              giây, nhận xác nhận ngay lập tức.
            </p>

            <form className="hero-search-box" onSubmit={handleSearchSubmit}>
              <div className="search-tabs">
                {tabs.map(({ key, icon, label }) => (
                  <button
                    key={key}
                    type="button"
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className="si-group si-location">
                  <FaLocationDot />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    aria-label="Lọc theo thành phố"
                  >
                    <option value="">Tất cả thành phố</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-search-go" type="submit">
                  <FaSearch className="me-2" />
                  Tìm kiếm
                </button>
              </div>
            </form>

            <div className="quick-tags">
              <span className="qt-label">Tìm nhanh:</span>
              {quickTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?q=${encodeURIComponent(tag)}&type=specialty`}
                  className="qt"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-lg-6 hero-visual d-none d-lg-flex justify-content-center">
            <div className="hero-card-stack">
              <div className="hcard hcard-main">
                <div className="hcard-avatar">
                  <img src={featuredDoctor.avatar} alt={featuredDoctor.name} />
                  <div className="hcard-status" />
                </div>
                <div className="hcard-info">
                  <div className="hcard-name">{featuredDoctor.name}</div>
                  <div className="hcard-spec">
                    {featuredDoctor.specialty} – {featuredDoctor.hospital}
                  </div>
                  <div className="hcard-stars">
                    <StarRating
                      rating={featuredDoctor.rating}
                      showValue
                      reviewCount={featuredDoctor.totalReviews}
                      size={13}
                    />
                  </div>
                </div>
                {featuredDoctor.slug ? (
                  <Link to={`/doctors/${featuredDoctor.slug}`} className="hcard-btn">
                    Xem bác sĩ
                  </Link>
                ) : (
                  <Link to="/doctors" className="hcard-btn">
                    Xem bác sĩ
                  </Link>
                )}
              </div>

              <div className="hfloat hfloat-1">
                <FaCalendarCheck />
                <div>
                  <div className="hf-num">{heroNumbers.todayAppointments}</div>
                  <div className="hf-lbl">Lịch hôm nay</div>
                </div>
              </div>

              <div className="hfloat hfloat-2">
                <FaFaceSmile />
                <div>
                  <div className="hf-num">{heroNumbers.satisfactionRate}%</div>
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
