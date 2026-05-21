import { Link } from "react-router";
import { useState } from "react";
import RoutePage from "../../components/Common/RoutePage";
import { toSlug } from "../../utils/helpers";

// Collapse Info Section Component
const CollapsibleSection = ({ items, initialItemsCount = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedItems = isExpanded ? items : items.slice(0, initialItemsCount);
  const hasMore = items.length > initialItemsCount;

  return (
    <>
      <ul>
        {displayedItems.map((item, index) => (
          <li key={index}> {item}</li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-view-more"
          style={{
            background: "none",
            border: "none",
            color: "#0066cc",
            cursor: "pointer",
            padding: "8px 0",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </>
  );
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

const specialty = {
  name: "Cơ xương khớp",
  logo: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-co-xuong-khop.png",
  info: [
    "Các chuyên gia có quá trình đào tạo bài bản, nhiều kinh nghiệm",
    "Các giáo sư, phó giáo sư đang trực tiếp nghiên cứu và giảng dạy tại Đại học Y khoa Hà Nội",
    "Các bác sĩ đã, đang công tác tại các bệnh viện hàng đầu Khoa Cơ Xương Khớp - Bệnh viện Bạch Mai, Bệnh viện Hữu nghị Việt Đức,Bệnh Viện E.",
    "Là thành viên hoặc lãnh đạo các tổ chức chuyên môn như: Hiệp hội Cơ Xương Khớp, Hội Thấp khớp học,...",
    "Được nhà nước công nhận các danh hiệu Thầy thuốc Nhân dân, Thầy thuốc Ưu tú, Bác sĩ Cao cấp,...",
  ],
  diseases: [
    "Gout",
    "Thoái hóa khớp: khớp gối, cột sống thắt lưng, cột sống cổ",
    "Viêm khớp dạng thấp, Viêm đa khớp, Viêm gân",
    "Tràn dịch khớp gối, Tràn dịch khớp háng, Tràn dịch khớp khủy, Tràn dịch khớp vai",
    "Loãng xương, đau nhức xương",
    "Viêm xương, gai xương",
    "Viêm cơ, Teo cơ, chứng đau mỏi cơ",
    "Yếu cơ, Loạn dưỡng cơ",
    "Các chấn thương về cơ, xương, khớp",
  ],
};

const SpecialtyDetailPage = () => {
  return (
    <>
      <div
        className="specialty-header d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${specialty.logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form className="hospital-info-form d-flex align-items-center gap-4">
          <div className="flex-grow-1">
            <h1 className="fw-bold mb-2">{specialty.name}</h1>
            <p>Bác sĩ {specialty.name} giỏi</p>
            <ul>
              {specialty.info.map((item, index) => (
                <li key={index}> {item}</li>
              ))}
            </ul>
            <p>Bệnh {specialty.name}</p>
            <ul>
              {specialty.diseases.map((item, index) => (
                <li key={index}> {item}</li>
              ))}
            </ul>
          </div>
        </form>
      </div>

      <div className="specialty doctors-page-container p-5">
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
              <Link
                to={`/doctors/${toSlug(name)}`}
                className="btn-book-doc btn btn-rounded flex-shrink-0"
              >
                Đặt lịch
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SpecialtyDetailPage;
