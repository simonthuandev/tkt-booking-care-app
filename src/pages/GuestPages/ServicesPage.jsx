import { Link } from "react-router";
import RoutePage from "../../components/Common/RoutePage";
import "./ServicesPage.scss";

const services = [
  {
    name: "Chuyên khoa",
    img: "https://cdn.bookingcare.vn/fo/w128/2023/06/07/161905-iconkham-chuyen-khoa.png",
    link: "/specialties",
  },
  {
    name: "Khám từ xa",
    img: "https://cdn.bookingcare.vn/fo/w128/2023/06/07/161817-iconkham-tu-xa.png",
    link: "/services/new/kham-tu-xa",
  },
  {
    name: "Khám tại nhà",
    img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-than-kinh-tu-xa.png",
    link: "/services/kham-tai-nha",
  },
  {
    name: "Xét nghiệm và chuyển đoán",
    img: "https://cdn.bookingcare.vn/fo/w128/2023/06/07/161340-iconxet-nghiem-y-hoc.png",
    link: "/services/xet-nghiem-va-chuan-doan",
  },
  {
    name: "Gói khám sức khỏe",
    img: "https://cdn.bookingcare.vn/fo/w128/2023/06/07/161350-iconkham-tong-quan.png",
    link: "/services/goi-kham-suc-khoe",
  },
];

const ServicesPage = () => {
  return (
    <div className="services-page">
      <div className="page-header">
        <h1>Các dịch vụ khám chữa bệnh</h1>
        <p>
          Khám phá các dịch vụ y tế chuyên nghiệp và toàn diện từ các bác sĩ
          hàng đầu
        </p>
      </div>
      <div className="services-grid">
        {services.map((item, index) => (
          <Link key={index} to={item.link} className="service-card">
            <div className="icon-wrapper">
              <img src={item.img} alt={item.name} />
            </div>
            <h3>{item.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
