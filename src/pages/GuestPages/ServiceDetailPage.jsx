import { Link } from "react-router";
import RoutePage from "../../components/Common/RoutePage";
import "./ServiceDetailPage.scss";
const service = {
  name: "Dịch vụ khám chữ bệnh tại nhà",
  list: [
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
    {
      name: "Khám tai mũi họng tại nhà",
      img: "https://cdn.bookingcare.vn/fo/w640/2024/01/04/160245-tai-mui-hong-tu--xa.png",
      link: "",
    },
  ],
};

const ServiceDetailPage = () => {
  return (
    <div className="service-page">
      <div className="page-header">
        <h1>{service.name}</h1>
      </div>
      <div className="service-grid">
        {service.list.map((item, index) => (
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

export default ServiceDetailPage;
