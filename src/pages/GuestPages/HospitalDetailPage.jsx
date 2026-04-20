import { Link } from "react-router";
import RoutePage from "../../components/Common/RoutePage";
import StarRating from "../../components/Common/StarRating";
import { toSlug } from "../../utils/helpers";
import "./HospitalDetailPage.scss";

const hospital = {
  name: "Bệnh viên Đa Khoa Hoàng Khoa",
  address: "số 1 Nguyễn Văn Tăng, Long Trường, Thủ Đức",
  img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80",
  logo: "https://cdn.bookingcare.vn/fo/2018/06/18/083122lo-go-viet-duc.jpg",
};

const doctors = [
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "PGS.TS. Trần Minh Khoa",
    spec: "Tim mạch",
    hospital: "BV Chợ Rẫy, TP.HCM",
    rating: 4.9,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "TS.BS. Lê Thu Hằng",
    spec: "Da liễu",
    hospital: "BV Da Liễu TW, HN",
    rating: 4.8,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "GS.TS. Nguyễn Đức Tuấn",
    spec: "Nhi khoa",
    hospital: "BV Nhi Đồng 1, TP.HCM",
    rating: 4.9,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "ThS.BS. Phạm Bích Ngọc",
    spec: "Sản phụ khoa",
    hospital: "BV Từ Dũ, TP.HCM",
    rating: 3,
    info: [
      "Gần 40 năm kinh nghiệm điều trị và phẫu thuật thành công hàng ngàn ca viêm Amidan, viêm VA, viêm xoang, u thanh quản, u hạ họng, viêm tai giữa, ù tai, nghe kém, điếc đột ngột, thủng màng nhĩ...",
      "Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương",
      "Giám đốc bệnh viện Đa khoa An Việt",
      "Giám đốc bệnh viện Đa khoa An Việt",
      "Giám đốc bệnh viện Đa khoa An Việt",
    ],
  },
];

const HospitalDetailPage = () => {
  return (
    <>
      <div
        className="hospital-header d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${hospital.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form className="hospital-info-form d-flex align-items-center gap-4">
          <div className="logo-wrapper flex-shrink-0">
            <img src={hospital.logo} alt={hospital.name} className="rounded" />
          </div>
          <div className="flex-grow-1">
            <h1 className="fw-bold mb-2">{hospital.name}</h1>
            <p className="mb-0">{hospital.address}</p>
          </div>
        </form>
      </div>

      <div className="hospital doctors-page-container p-5">
        <div className="d-flex flex-column">
          {doctors.map(({ id, img, name, spec, hospital, rating, info }) => (
            <div
              key={id}
              className="doctor-item d-flex align-items-center gap-4 p-4 border-bottom"
            >
              <img src={img} alt={name} className="rounded flex-shrink-0" />
              <div className="d-flex flex-column gap-2 flex-grow-1">
                <div className="fw-bold">{name}</div>
                <ul className="info">
                  {info.map((item, index) => (
                    <li key={index}> {item}</li>
                  ))}
                </ul>
              </div>
              <button className="btn-book-doc btn btn-rounded flex-shrink-0">
                <Link to={`/doctors/${toSlug(name)}`}>Đặt lịch</Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HospitalDetailPage;
