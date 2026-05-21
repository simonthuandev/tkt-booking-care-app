import { Link } from "react-router";
import RoutePage from "../../components/Common/RoutePage";
import { useState } from "react";
import "./HospitalsPage.scss";
import { toSlug } from "../../utils/helpers";

const hospitals = [
  {
    name: "Phòng khám Đa khoa Hoàn Mỹ Sài Gòn",
    city: "TP.HCM",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
  },
  {
    name: "Phòng khám Quốc tế CarePlus",
    city: "TP.HCM",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80",
  },
  {
    name: "Phòng khám FV Sài Gòn",
    city: "TP.HCM",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
  },
  {
    name: "Phòng khám Đa khoa Medic",
    city: "TP.HCM",
    img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&q=80",
  },
  {
    name: "Phòng khám Vinmec Hà Nội",
    city: "Hà Nội",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  },
  {
    name: "Phòng khám Hồng Ngọc",
    city: "Hà Nội",
    img: "https://images.unsplash.com/photo-1576765608622-067973a79f53?w=400&q=80",
  },
  {
    name: "Phòng khám Việt Pháp",
    city: "Hà Nội",
    img: "https://images.unsplash.com/photo-1580281657527-47a3d1c2a6e4?w=400&q=80",
  },
  {
    name: "Phòng khám Tâm Anh Hà Nội",
    city: "Hà Nội",
    img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80",
  },
  {
    name: "Phòng khám Đa khoa Đà Nẵng",
    city: "Đà Nẵng",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
  },
  {
    name: "Phòng khám Hoàn Mỹ Đà Nẵng",
    city: "Đà Nẵng",
    img: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&q=80",
  },
  {
    name: "Phòng khám Gia Đình Đà Nẵng",
    city: "Đà Nẵng",
    img: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&q=80",
  },
  {
    name: "Phòng khám Quốc tế Hải Phòng",
    city: "Hải Phòng",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80",
  },
  {
    name: "Phòng khám Đa khoa Cần Thơ",
    city: "Cần Thơ",
    img: "https://images.unsplash.com/photo-1587502537104-aac10f5d4c64?w=400&q=80",
  },
  {
    name: "Phòng khám Hoàn Mỹ Cần Thơ",
    city: "Cần Thơ",
    img: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80",
  },
  {
    name: "Phòng khám Đa khoa Bình Dương",
    city: "Bình Dương",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80",
  },
  {
    name: "Phòng khám Quốc tế Đồng Nai",
    city: "Đồng Nai",
    img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&q=80",
  },
  {
    name: "Phòng khám Đa khoa Nha Trang",
    city: "Khánh Hòa",
    img: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=400&q=80",
  },
  {
    name: "Phòng khám Đa khoa Vũng Tàu",
    city: "Bà Rịa - Vũng Tàu",
    img: "https://images.unsplash.com/photo-1581093588401-22fbc02b9c5b?w=400&q=80",
  },
];

const HospitalsPage = () => {
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [searchName, setSearchName] = useState("");

  // Lấy danh sách các tỉnh/thành duy nhất
  const cities = ["Tất cả", ...new Set(hospitals.map((h) => h.city))];

  // Lọc phòng khám theo tỉnh và tên được chọn
  const filteredHospitals = hospitals.filter((hospital) => {
    const cityMatch =
      selectedCity === "Tất cả" || hospital.city === selectedCity;
    const nameMatch = hospital.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    return cityMatch && nameMatch;
  });

  return (
    <>
      <div className="hospitals-wrapper">
        <div className="hospitals-header">
          <h1 className="hospitals-title">Phòng khám và Bệnh viện</h1>
          <p className="hospitals-subtitle">
            Danh sách các phòng khám và bệnh viện uy tín trên toàn quốc
          </p>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-content">
            <div className="filter-group">
              <label htmlFor="city-select" className="filter-label">
                Lọc theo tỉnh/thành phố
              </label>
              <select
                id="city-select"
                className="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="search-name" className="filter-label">
                Tìm kiếm theo tên
              </label>
              <input
                id="search-name"
                type="text"
                className="search-input"
                placeholder="Nhập tên phòng khám..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="hospitals-container">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospitail, index) => (
              <Link
                key={index}
                to={`/hospitals/${toSlug(hospitail.name)}`}
                className="specialty-card"
              >
                <div className="specialty-image">
                  <img
                    src={hospitail.img}
                    alt={hospitail.name}
                    loading="lazy"
                  />
                  <span className="city-badge">{hospitail.city}</span>
                </div>
                <h3 className="specialty-name">{hospitail.name}</h3>
              </Link>
            ))
          ) : (
            <div className="no-results">
              <p>Không tìm thấy phòng khám nào ở {selectedCity}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HospitalsPage;
