import { useState } from "react";
import RoutePage from "../../components/Common/RoutePage";
import { Link } from "react-router";
import { toSlug } from "../../utils/helpers";
import "./SearchPage.scss";

const search = [
  {
    title: "Chuyên khoa",
    list: [
      {
        name: "Mắt tai mũi họng",
        img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tai-mui-hong.png",
        link: "",
      },
      {
        name: "Cột sống",
        img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-cot-song.png",
        link: "",
      },
      {
        name: "Mắt",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
    ],
  },
  {
    title: "Cơ sở y tế",
    list: [
      {
        name: "Bênh Viện Mắt",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
      {
        name: "Bênh viện ung bướu",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
      {
        name: "Bệnh viên 175",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
    ],
  },
  {
    title: "Bác sĩ",
    list: [
      {
        name: "Huỳnh Hoàng Khoa",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
      {
        name: "Nguyên Đứu Thuận",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
      {
        name: "Phạm Minh Tuấn",
        img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
        link: "",
      },
    ],
  },
];

const SearchPage = () => {
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [searchName, setSearchName] = useState("");

  // Lấy danh sách các tỉnh/thành duy nhất
  const cities = ["Tất cả", ...new Set(search.map((h) => h.title))];

  // Flatten data từ nested structure
  const flattenedItems = search.flatMap((group) =>
    group.list.map((item) => ({
      ...item,
      category: group.title,
    })),
  );

  // Lọc theo loại và tên được chọn
  const filteredHospitals = flattenedItems.filter((item) => {
    const categoryMatch =
      selectedCity === "Tất cả" || item.category === selectedCity;
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    return categoryMatch && nameMatch;
  });

  return (
    <>
      <div className="search">
        <div className="filter-section">
          <div className="filter-content">
            <div className="filter-group">
              <input
                id="search-name"
                type="text"
                className="search-input"
                placeholder="Nhập chủ đề tìm kiếm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="filter-group">
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
          </div>
          <div className="items-container">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((item, index) => (
                <Link
                  key={index}
                  to={`/hospitals/${toSlug(item.name)}`}
                  className="specialty-card"
                >
                  <div className="specialty-icon">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <h3 className="specialty-name">{item.name}</h3>
                </Link>
              ))
            ) : (
              <div className="no-results">
                <p>Không tìm thấy phòng khám nào ở {selectedCity}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
