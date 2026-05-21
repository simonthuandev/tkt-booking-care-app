import { Link } from "react-router";
import RoutePage from "../../components/Common/RoutePage";
import "./SpecialtiesPage.scss";
import { toSlug } from "../../utils/helpers";

const specialties = [
  {
    name: "Cơ Xương Khớp",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-co-xuong-khop.png",
  },
  {
    name: "Thần Kinh",
    img: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png",
  },
  {
    name: "Tiêu Hóa",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tieu-hoa.png",
  },
  {
    name: "Tim Mạch",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tim-mach.png",
  },
  {
    name: "Tai Mũi Họng",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tai-mui-hong.png",
  },
  {
    name: "Cột Sống",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-cot-song.png",
  },
  {
    name: "Y Học Cổ Truyền",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101739-y-hoc-co-truyen.png",
  },
  {
    name: "Châm Cứu",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-cham-cuu.png",
  },
  {
    name: "Sản Phụ Khoa",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-san-phu-khoa.png",
  },
  {
    name: "Siêu Âm Thai",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-suc-khoe-tam-than.png",
  },
  {
    name: "Nhi Khoa",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101655-nhi-khoa.png",
  },
  {
    name: "Da Liễu",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101638-da-lieu.png",
  },
  {
    name: "Viêm Gan",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101739-viem-gan.png",
  },
  {
    name: "Sức Khỏe Tâm Thần",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-suc-khoe-tam-than.png",
  },
  {
    name: "Dị Ứng - Miễn Dịch",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101638-di-ung-mien-dich.png",
  },
  {
    name: "Hô Hấp - Phổi",
    img: "https://cdn.bookingcare.vn/fo/w384/2023/12/26/101638-ho-hap-phoi.png",
  },
];

const SpecialtiesPage = () => {
  return (
    <>
      <div className="specialties-container">
        {specialties.map((specialty, index) => (
          <Link
            key={index}
            // chỉnh lại link to để chuyển sang form khác
            to={`/specialties/${toSlug(specialty.name)}`}
            className="specialty-card"
          >
            <div className="specialty-image">
              <img src={specialty.img} alt={specialty.name} />
            </div>
            <h3 className="specialty-name">{specialty.name}</h3>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SpecialtiesPage;
